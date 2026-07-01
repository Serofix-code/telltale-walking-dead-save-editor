window.TWD_CHOICE_DATABASE = [
  {
    game: "wd1",
    episode: "Episode 1",
    key: "shawnduck_choice",
    title: "Hershel's farm rescue",
    description: "Who Lee tried to save at Hershel's farm.",
    values: ["duck", "shawn"]
  },
  {
    game: "wd1",
    episode: "Episode 1",
    key: "sided_with_kenny",
    title: "Drugstore argument",
    description: "Whether Lee backed Kenny when Larry accused Duck.",
    values: ["true", "false"]
  },
  {
    game: "wd1",
    episode: "Episode 1",
    key: "lied_to_hershel",
    title: "Hershel honesty",
    description: "Whether Lee lied to Hershel about his past.",
    values: ["false", "true"]
  },
  {
    game: "wd1",
    episode: "Episode 1",
    key: "gave_irene_gun",
    title: "Irene's request",
    description: "Whether Lee gave Irene the gun at the motel.",
    values: ["true", "false"]
  },
  {
    game: "wd1",
    episode: "Episode 1",
    key: "dougcarley_saved",
    title: "Drugstore survivor",
    description: "Who Lee saved during the drugstore escape.",
    values: ["doug", "carley"]
  },
  {
    game: "wd1",
    episode: "Episode 2",
    key: "helped_kill_larry",
    title: "Meat locker",
    description: "Whether Lee helped Kenny kill Larry in the meat locker.",
    values: ["true", "false"]
  },
  {
    game: "wd1",
    episode: "Episode 2",
    key: "left_lilly",
    title: "Roadside Lilly choice",
    description: "Whether Lilly was left behind after the RV argument.",
    values: ["true", "false"]
  },
  {
    game: "wd1",
    episode: "Episode 2",
    key: "shot_jolene",
    title: "Jolene encounter",
    description: "Whether Lee shot Jolene in the woods.",
    values: ["true", "false"]
  },
  {
    game: "wd1",
    episode: "Episode 2",
    key: "shot_beatrice",
    title: "Beatrice at the pharmacy",
    description: "Whether Lee shot Beatrice outside the pharmacy.",
    values: ["true", "false"]
  },
  {
    game: "wd1",
    episode: "Episode 2",
    key: "chopped_leg",
    title: "Teacher trap",
    description: "Whether Lee chopped off the teacher's leg.",
    values: ["true", "false"]
  },
  {
    game: "wd1",
    episode: "Progress",
    key: "WalkingDead101",
    title: "Season 1 Episode 1 marker",
    description: "Detected when the slot still points to Episode 1.",
    values: ["WalkingDead101", "WalkingDead102"]
  },
  {
    game: "wd1",
    episode: "Progress",
    key: "WalkingDead102",
    title: "Season 1 Episode 2 marker",
    description: "Detected when Episode 2 is unlocked or active.",
    values: ["WalkingDead102", "WalkingDead101"]
  },
  {
    game: "wd2",
    episode: "Imported Season 1",
    key: "christa",
    title: "Season 2 Christa marker",
    description: "Known Season 2 choice/progress token found in some saves.",
    values: ["christa"]
  }
];

window.TWD_PRESETS = [
  {
    id: "good",
    title: "Good",
    description: "Compassionate Lee: protects kids, tells the truth, avoids unnecessary killing, and tries to preserve the group.",
    values: {
      shawnduck_choice: "duck",
      sided_with_kenny: "true",
      lied_to_hershel: "false",
      gave_irene_gun: "true",
      dougcarley_saved: "carley",
      helped_kill_larry: "false",
      left_lilly: "false",
      shot_jolene: "false",
      shot_beatrice: "true",
      chopped_leg: "true"
    }
  },
  {
    id: "evil",
    title: "Evil",
    description: "Harsh Lee: lies, favors survival over mercy, backs brutal calls, and abandons people more readily.",
    values: {
      shawnduck_choice: "shawn",
      sided_with_kenny: "false",
      lied_to_hershel: "true",
      gave_irene_gun: "false",
      dougcarley_saved: "doug",
      helped_kill_larry: "true",
      left_lilly: "true",
      shot_jolene: "true",
      shot_beatrice: "false",
      chopped_leg: "false"
    }
  },
  {
    id: "natural",
    title: "Natural",
    description: "Balanced first-playthrough style: mostly kind to Clementine, pragmatic with danger, not perfectly loyal to anyone.",
    values: {
      shawnduck_choice: "duck",
      sided_with_kenny: "true",
      lied_to_hershel: "false",
      gave_irene_gun: "true",
      dougcarley_saved: "carley",
      helped_kill_larry: "false",
      left_lilly: "true",
      shot_jolene: "false",
      shot_beatrice: "false",
      chopped_leg: "true"
    }
  }
];

window.TWD_GAME_LABELS = {
  wd1: "The Walking Dead Season 1",
  wd2: "The Walking Dead Season 2",
  wdm: "The Walking Dead: Michonne",
  wd3: "The Walking Dead: A New Frontier",
  wd4: "The Walking Dead: The Final Season",
  global: "Global / Menu Data",
  unknown: "Unknown"
};
