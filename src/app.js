(() => {
  const state = {
    files: [],
    selectedId: null
  };

  const els = {
    fileInput: document.querySelector("#fileInput"),
    folderInput: document.querySelector("#folderInput"),
    dropZone: document.querySelector("#dropZone"),
    fileList: document.querySelector("#fileList"),
    fileCount: document.querySelector("#fileCount"),
    emptyState: document.querySelector("#emptyState"),
    fileView: document.querySelector("#fileView"),
    appStatus: document.querySelector("#appStatus"),
    fileTitle: document.querySelector("#fileTitle"),
    gameLabel: document.querySelector("#gameLabel"),
    fileType: document.querySelector("#fileType"),
    slotLabel: document.querySelector("#slotLabel"),
    fileSize: document.querySelector("#fileSize"),
    stringCount: document.querySelector("#stringCount"),
    dirtyBadge: document.querySelector("#dirtyBadge"),
    knownChoices: document.querySelector("#knownChoices"),
    presets: document.querySelector("#presets"),
    detectedStrings: document.querySelector("#detectedStrings"),
    checkpointTools: document.querySelector("#checkpointTools"),
    exportChanged: document.querySelector("#exportChanged"),
    exportManifest: document.querySelector("#exportManifest"),
    clearAll: document.querySelector("#clearAll"),
    choiceTemplate: document.querySelector("#choiceRowTemplate")
  };

  function setStatus(message) {
    els.appStatus.textContent = message;
  }

  async function addFiles(fileList) {
    const files = [...fileList].filter(file => /\.(bundle|estore|epage|prop)$/i.test(file.name));
    if (!files.length) {
      setStatus("No supported save files found");
      return;
    }

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const relative = file.webkitRelativePath || file.name;
      state.files.push(window.TWDSaveFormat.analyzeFile(relative, bytes, file));
    }

    state.files.sort((a, b) => a.game.localeCompare(b.game) || a.name.localeCompare(b.name));
    state.selectedId = state.selectedId || state.files[0].id;
    render();
    setStatus(`Loaded ${files.length} file${files.length === 1 ? "" : "s"}`);
  }

  function selectedFile() {
    return state.files.find(file => file.id === state.selectedId) || null;
  }

  function render() {
    els.fileCount.textContent = state.files.length;
    els.exportManifest.disabled = state.files.length === 0;
    els.exportChanged.disabled = !state.files.some(file => file.dirty);
    renderFileList();
    renderFileView();
  }

  function renderFileList() {
    els.fileList.replaceChildren();
    for (const file of state.files) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `file-item ${file.id === state.selectedId ? "active" : ""}`;
      button.innerHTML = `
        <span>${escapeHtml(shortName(file.name))}</span>
        <small>${escapeHtml(window.TWD_GAME_LABELS[file.game] || "Unknown")} · ${escapeHtml(file.type)}${file.dirty ? " · edited" : ""}</small>
      `;
      button.addEventListener("click", () => {
        state.selectedId = file.id;
        render();
      });
      els.fileList.append(button);
    }
  }

  function renderFileView() {
    const file = selectedFile();
    els.emptyState.classList.toggle("hidden", !!file);
    els.fileView.classList.toggle("hidden", !file);
    if (!file) return;

    els.fileTitle.textContent = shortName(file.name);
    els.gameLabel.textContent = window.TWD_GAME_LABELS[file.game] || "Unknown";
    els.fileType.textContent = file.type;
    els.slotLabel.textContent = file.slot;
    els.fileSize.textContent = window.TWDSaveFormat.formatBytes(file.bytes.length);
    els.stringCount.textContent = file.strings.length;
    els.dirtyBadge.classList.toggle("hidden", !file.dirty);

    renderKnownChoices(file);
    renderPresets(file);
    renderStrings(file);
    renderCheckpointTools(file);
  }

  function renderKnownChoices(file) {
    els.knownChoices.replaceChildren();
    const found = file.knownChoices;
    if (!found.length) {
      els.knownChoices.append(emptyMessage("No known editable choices were detected in this file yet."));
      return;
    }

    for (const choice of found) {
      const row = els.choiceTemplate.content.firstElementChild.cloneNode(true);
      row.querySelector(".choice-title").textContent = choice.title;
      row.querySelector(".choice-desc").textContent = `${choice.episode || "Choice"} · ${choice.description} Offset ${choice.offset}.`;
      row.querySelector(".choice-key").textContent = choice.encodedText;
      const select = row.querySelector(".choice-select");
      for (const value of choice.values) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        option.selected = value === choice.value;
        select.append(option);
      }
      select.addEventListener("change", () => applyChoice(file, choice, select.value));
      els.knownChoices.append(row);
    }
  }

  function renderPresets(file) {
    els.presets.replaceChildren();
    const presets = window.TWD_PRESETS || [];
    const choicesByKey = new Map(file.knownChoices.map(choice => [choice.key, choice]));
    const matchingPresets = presets.filter(preset => Object.keys(preset.values).some(key => choicesByKey.has(key)));

    if (!matchingPresets.length) {
      els.presets.append(emptyMessage("No preset-compatible choices were detected in this file yet."));
      return;
    }

    for (const preset of matchingPresets) {
      const card = document.createElement("div");
      card.className = "preset-card";
      const foundKeys = Object.keys(preset.values).filter(key => choicesByKey.has(key));
      const changes = foundKeys.filter(key => choicesByKey.get(key).value !== preset.values[key]);
      card.innerHTML = `
        <div>
          <h3>${escapeHtml(preset.title)}</h3>
          <p>${escapeHtml(preset.description)}</p>
          <small>${foundKeys.length} detected target${foundKeys.length === 1 ? "" : "s"} · ${changes.length} change${changes.length === 1 ? "" : "s"} needed</small>
        </div>
        <button type="button">Apply where safe</button>
      `;
      card.querySelector("button").addEventListener("click", () => applyPreset(file, preset));
      els.presets.append(card);
    }
  }

  function applyPreset(file, preset) {
    let changed = 0;
    let skipped = 0;
    const failures = [];

    for (const [key, value] of Object.entries(preset.values)) {
      const choice = file.knownChoices.find(item => item.key === key);
      if (!choice || choice.value === value) continue;
      const nextText = choice.key.startsWith("WalkingDead")
        ? value
        : window.TWDSaveFormat.choiceLabel(choice.key, value);
      const result = window.TWDSaveFormat.patchAscii(file.bytes, choice.offset, choice.encodedText, nextText);
      if (!result.ok) {
        skipped += 1;
        failures.push(`${choice.title}: ${result.reason}`);
        continue;
      }
      file.bytes = result.bytes;
      file.dirty = true;
      file.strings = extractStringsAgain(file);
      file.knownChoices = window.TWDSaveFormat.detectKnownChoices(file);
      changed += 1;
    }

    setStatus(`${preset.title} preset: ${changed} applied, ${skipped} skipped`);
    if (failures.length) {
      alert(`Some edits were skipped to avoid corrupting the save:\n\n${failures.join("\n")}`);
    }
    render();
  }

  function applyChoice(file, choice, value) {
    const nextText = choice.key.startsWith("WalkingDead")
      ? value
      : window.TWDSaveFormat.choiceLabel(choice.key, value);
    const result = window.TWDSaveFormat.patchAscii(file.bytes, choice.offset, choice.encodedText, nextText);
    if (!result.ok) {
      alert(`${result.reason}\n\nThis first version only applies same-length edits to avoid corrupting saves.`);
      render();
      return;
    }
    file.bytes = result.bytes;
    file.dirty = true;
    file.strings = extractStringsAgain(file);
    file.knownChoices = window.TWDSaveFormat.detectKnownChoices(file);
    setStatus(`Edited ${shortName(file.name)}`);
    render();
  }

  function extractStringsAgain(file) {
    return window.TWDSaveFormat.analyzeFile(file.name, file.bytes, file.originalFile).strings;
  }

  function renderStrings(file) {
    els.detectedStrings.replaceChildren();
    const tools = document.createElement("div");
    tools.className = "string-tools";
    const input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Filter strings";
    input.addEventListener("input", () => renderStringTable(file, input.value));
    tools.append(input);
    els.detectedStrings.append(tools);

    const table = document.createElement("div");
    table.className = "string-table";
    table.id = "stringTable";
    els.detectedStrings.append(table);
    renderStringTable(file, "");
  }

  function renderStringTable(file, filter) {
    const table = document.querySelector("#stringTable");
    if (!table) return;
    table.replaceChildren();
    const normalized = filter.trim().toLowerCase();
    const rows = file.strings
      .filter(item => !normalized || item.text.toLowerCase().includes(normalized))
      .slice(0, 250);

    for (const item of rows) {
      const row = document.createElement("div");
      row.className = "string-row";
      row.innerHTML = `<code>${item.offset}</code><span>${escapeHtml(item.text)}</span>`;
      table.append(row);
    }

    if (!rows.length) table.append(emptyMessage("No strings match that filter."));
  }

  function renderCheckpointTools(file) {
    els.checkpointTools.replaceChildren();
    const box = document.createElement("div");
    box.className = "tool-box";
    box.innerHTML = `
      <h3>Checkpoint safety</h3>
      <p>This file is detected as <strong>${escapeHtml(file.type)}</strong>. For releases, checkpoint reset should move or delete autosave/checkpoint files outside the game, not rewrite them blindly.</p>
      <button type="button" id="downloadOriginal">Download original backup copy</button>
      <button type="button" id="downloadCurrent">Download current copy</button>
    `;
    els.checkpointTools.append(box);
    box.querySelector("#downloadOriginal").addEventListener("click", () => downloadBytes(file.originalBytes, `${shortName(file.name)}.backup`));
    box.querySelector("#downloadCurrent").addEventListener("click", () => downloadBytes(file.bytes, shortName(file.name)));
  }

  function downloadBytes(bytes, name) {
    const blob = new Blob([bytes], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportChangedFiles() {
    for (const file of state.files.filter(item => item.dirty)) {
      downloadBytes(file.bytes, shortName(file.name));
    }
  }

  function exportManifest() {
    const manifest = {
      app: "Telltale Walking Dead Save Editor",
      createdAt: new Date().toISOString(),
      files: state.files.map(file => ({
        name: file.name,
        game: file.game,
        type: file.type,
        slot: file.slot,
        size: file.bytes.length,
        edited: file.dirty,
        knownChoices: file.knownChoices.map(choice => ({
          title: choice.title,
          key: choice.key,
          value: choice.value,
          offset: choice.offset
        }))
      }))
    };
    const text = JSON.stringify(manifest, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "twd-save-backup-manifest.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function emptyMessage(text) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = text;
    return p;
  }

  function shortName(path) {
    return path.split(/[\\/]/).pop();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.add("hidden"));
      tab.classList.add("active");
      document.querySelector(`#${tab.dataset.tab}`).classList.remove("hidden");
    });
  });

  els.fileInput.addEventListener("change", event => addFiles(event.target.files));
  els.folderInput.addEventListener("change", event => addFiles(event.target.files));
  els.exportChanged.addEventListener("click", exportChangedFiles);
  els.exportManifest.addEventListener("click", exportManifest);
  els.clearAll.addEventListener("click", () => {
    state.files = [];
    state.selectedId = null;
    render();
    setStatus("Cleared");
  });

  els.dropZone.addEventListener("dragover", event => {
    event.preventDefault();
    els.dropZone.classList.add("dragging");
  });
  els.dropZone.addEventListener("dragleave", () => els.dropZone.classList.remove("dragging"));
  els.dropZone.addEventListener("drop", event => {
    event.preventDefault();
    els.dropZone.classList.remove("dragging");
    addFiles(event.dataTransfer.files);
  });

  render();
})();
