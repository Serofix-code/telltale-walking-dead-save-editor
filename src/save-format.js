(() => {
  const decoder = new TextDecoder("latin1");
  const encoder = new TextEncoder();

  function detectGame(name) {
    const lower = name.toLowerCase();
    if (lower.startsWith("wd1_") || lower.startsWith("_wd1_")) return "wd1";
    if (lower.startsWith("wd2_") || lower.startsWith("_wd2_")) return "wd2";
    if (lower.startsWith("wdm_") || lower.startsWith("_wdm_")) return "wdm";
    if (lower.startsWith("wd3_") || lower.startsWith("_wd3_")) return "wd3";
    if (lower.startsWith("wd4_") || lower.startsWith("_wd4_")) return "wd4";
    if (lower === "global.bundle" || lower === "menu.bundle" || lower === "prefs.prop") return "global";
    return "unknown";
  }

  function detectType(name) {
    const lower = name.toLowerCase();
    if (lower.includes("checkpoint")) return "checkpoint";
    if (lower.includes("autosave")) return "autosave";
    if (lower.includes("_id")) return "slot id";
    if (lower.includes("saveslot") || lower.includes("saveslot")) return "slot";
    if (lower.endsWith(".prop")) return "preferences";
    if (lower.includes("menu_log")) return "menu log";
    return "data";
  }

  function detectSlot(name) {
    const match = name.match(/(?:saveslot|saveSlot)(\d+)/i);
    return match ? `Slot ${match[1]}` : "-";
  }

  function printableRuns(bytes, min = 4) {
    const strings = [];
    let start = -1;
    for (let i = 0; i <= bytes.length; i += 1) {
      const value = i < bytes.length ? bytes[i] : 0;
      const printable = value >= 32 && value <= 126;
      if (printable && start === -1) start = i;
      if ((!printable || i === bytes.length) && start !== -1) {
        const end = i;
        if (end - start >= min) {
          strings.push({
            offset: start,
            length: end - start,
            text: decoder.decode(bytes.slice(start, end))
          });
        }
        start = -1;
      }
    }
    return strings;
  }

  function findAscii(bytes, text) {
    const needle = encoder.encode(text);
    const hits = [];
    outer: for (let i = 0; i <= bytes.length - needle.length; i += 1) {
      for (let j = 0; j < needle.length; j += 1) {
        if (bytes[i + j] !== needle[j]) continue outer;
      }
      hits.push({ offset: i, length: needle.length, text });
    }
    return hits;
  }

  function choiceLabel(key, value) {
    return `${key} - ${value}`;
  }

  function detectKnownChoices(file) {
    const entries = [];
    const db = window.TWD_CHOICE_DATABASE || [];
    for (const choice of db) {
      if (choice.game !== file.game) continue;
      const values = choice.values || [];
      for (const value of values) {
        const forms = choice.key.startsWith("WalkingDead")
          ? [choice.key]
          : [choiceLabel(choice.key, value)];
        for (const form of forms) {
          const hits = findAscii(file.bytes, form);
          for (const hit of hits) {
            entries.push({ ...choice, value, encodedText: form, offset: hit.offset, length: hit.length });
          }
        }
      }
    }
    return entries;
  }

  function patchAscii(bytes, offset, oldText, newText) {
    const oldBytes = encoder.encode(oldText);
    const newBytes = encoder.encode(newText);
    if (oldBytes.length !== newBytes.length) {
      return {
        ok: false,
        reason: `Unsafe length change: ${oldBytes.length} bytes -> ${newBytes.length} bytes.`
      };
    }
    for (let i = 0; i < oldBytes.length; i += 1) {
      if (bytes[offset + i] !== oldBytes[i]) {
        return { ok: false, reason: "Original text no longer matches at this offset." };
      }
    }
    const copy = new Uint8Array(bytes);
    copy.set(newBytes, offset);
    return { ok: true, bytes: copy };
  }

  function analyzeFile(fileName, bytes, originalFile) {
    const file = {
      id: crypto.randomUUID(),
      name: fileName,
      originalFile,
      game: detectGame(fileName),
      type: detectType(fileName),
      slot: detectSlot(fileName),
      bytes,
      originalBytes: new Uint8Array(bytes),
      strings: printableRuns(bytes),
      knownChoices: [],
      dirty: false,
      notes: []
    };
    file.knownChoices = detectKnownChoices(file);
    return file;
  }

  function formatBytes(size) {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }

  window.TWDSaveFormat = {
    analyzeFile,
    detectKnownChoices,
    patchAscii,
    choiceLabel,
    formatBytes
  };
})();

