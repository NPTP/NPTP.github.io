// PORTFOLIO Games List - contains all games/projects information used by
// portfolio.js to populate the portfolio page.

const games = [
  {
    name: "DEADWOOD DUEL",
    platform: "Stencyl",
    images: ["images/games/dd/dd01.png", "images/games/dd/dd02.png"],
    video: ["images/games/dd/dd_gameplay.webm"],
    blurbLines: [
      "A reflex shooter set in the Old West.",
      "Choose your difficulty, watch the clock, and be quick - or be dead.",
      "I created every part of the game: design, gameplay, and 100% of the assets (art, animation, sound and music).",
    ],
    linkURLs: ["https://itch.io/"],
    linkTexts: ["Play on itch.io"],
  },
  {
    name: "LOONY LAB",
    platform: "Unity",
    images: [
      "images/games/ll/ll01.png",
      "images/games/ll/ll02.png",
      "images/games/ll/ll03.png",
      "images/games/ll/ll04.png",
    ],
    video: [],
    blurbLines: [
      "Loony Lab was part of a research project headed by Steve Engels at the University of Toronto, studying the effectiveness of design changes in pedagogical techniques in videogames. The material was taken straight from high school curriculum.",
      "Working with a partner, we created a game design document, recorded progress in a dev blog, ran playtests with various demographics including game industry professionals, conducted two rounds of research with the game using self-developed study instruments, and produced a final report on our findings.",
      "I contributed code (C#), design, art, animation, and sound. Royalty-free visual assets were modified to suit our needs.",
    ],
    linkURLs: [
      "data/downloads/LoonyLab_Winx86-64.zip",
      "https://github.com/NPTP/LoonyLab",
    ],
    linkTexts: ["Download for Windows", "Source on GitHub"],
  },
  {
    name: "RAYLTIME",
    platform: "C++ with SDL2",
    images: ["images/index_placeholder2.jpg"],
    video: [],
    blurbLines: [
      "A simple interactive ray tracer running on the CPU and built on top of the Eigen linear algebra library.",
      'RaylTime allows you to move around raytraced scenes in real-time, and features a text-based "level editing" system allowing you to quickly make new scenes which you can move around in.',
      "RaylTime employs a number of raytracing optimizations including bounding volume hierarchies and specular highlights optimization, along with a lower resolution so that it can be run in real-time rather than offline.",
    ],
    linkURLs: ["https://www.google.ca", "https://github.com/NPTP/RaylTime"],
    linkTexts: ["TODO: Download for Windows", "Source on GitHub"],
  },
  {
    name: "KCSHARE",
    platform: "Web & Mobile with React & React Native",
    images: ["images/index_placeholder1.jpg"],
    video: [],
    blurbLines: ["TODO!"],
    linkURLs: ["https://github.com/NPTP/KCShare"],
    linkTexts: ["Source on GitHub"],
  },
  {
    name: "GAME JAMS",
    platform: "HTML5 / Javascript",
    images: [
      "images/games/gj/gj01.png",
      "images/games/gj/gj02.png",
      "images/games/gj/gj03.png",
      "images/games/gj/gj04.png",
    ],
    video: [],
    blurbLines: [
      `For several game jams in Toronto, I've worked with a team consisting of a designer, an artist and a programmer, all of whom have experience either in AAA or indie game production. They're a truly talented bunch and it's been a privilege to do these jams with them under the team banner of "ButterBrains."`,
      "We put or heads together to create the high-level designs for these games as a group. I did all sound and music, and some level design.",
    ],
    linkURLs: [
      "https://butterbrains.itch.io/relapse",
      "https://butterbrains.itch.io/jelly-jelly",
      "https://butterbrains.itch.io/battlebeans",
      "https://globalgamejam.org/2016/games/combust-move",
    ],
    linkTexts: [
      "Play (R)elapse on itch.io",
      "Play Jelly-Jelly on itch.io",
      "Play BattleBeans (2-player) on itch.io",
      "Play Combust-a-Move (2-player) on GGJ",
    ],
  },
  {
    name: "INDUSTRIAL SECTOR",
    platform: "GZDoom",
    images: [
      "images/games/is/is01.png",
      "images/games/is/is05.png",
      "images/games/is/is02.png",
      "images/games/is/is05.png",
      "images/games/is/is03.png",
      "images/games/is/is05.png",
      "images/games/is/is04.png",
    ],
    video: [],
    blurbLines: [
      "A high-concept, grim post-apocalyptic mod for Doom (1993) built on a modern port of the game's open-source engine.",
      "A work-in-progress passion project where I produce code, mapping, level design, music, sound design, animation, and narrative, while keeping the core of the game's assets and design in the classic Doom mould.",
      "It's also using existing resources and tools made available by people in the incredible community around DooM that is still flourishing today.",
    ],
    linkURLs: [],
    linkTexts: [],
  },
];
