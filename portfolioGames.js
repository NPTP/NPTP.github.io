// PORTFOLIO Games List
//
// Contains all games/projects information used by portfolio.js to populate the
// portfolio page.
//
// Add and edit items as necessary. If a video is defined for any game, it will
// be shown instead of the given images.

const games = [
  {
    name: "INHERITORS",
    platform: "Unity, C#",
    images: [
      "images/games/inheritors/inheritors01.png",
      "images/games/inheritors/inheritors02.png"
    ],
    video: ["images/games/inheritors/inheritors-video.mp4"],
    blurbLines: [
      'Inheritors is a brief look at the "uncontacted" Akuntsu tribe in the southern Brazilian Amazon, what it means to give up heritage, and what their story means for similar tribes in the Amazon.',
      "The game features persistent terrain/environment manipulation, and recording & playback of past player actions, as you lay down a short heritage of your own.",
      "To be released early 2021."
    ],
    linkURLs: [
      "https://github.com/NPTP/InheritorsDev",
    ],
    linkTexts: ["Development repo"],
  },
  {
    name: "RAYLTIME",
    platform: "C++ with Eigen & SDL2",
    images: [
      "images/games/rayltime/rt01.png",
      "images/games/rayltime/rt02.png",
      "images/games/rayltime/rt03.png",
      "images/games/rayltime/rt04.png",
    ],
    video: ["images/games/rayltime/rt_video.webm"],
    blurbLines: [
      "A simple interactive ray tracer running on the CPU and built on top of the Eigen linear algebra library.",
      'RaylTime allows you to move around raytraced scenes in real-time, and features a text-based "level editing" system allowing you to quickly make new scenes which you can move around in.',
      "RaylTime employs a number of raytracing optimizations including bounding volume hierarchies and phong exponentiation thresholding to keep things running in real time.",
    ],
    linkURLs: [
      "data/downloads/RaylTime_Winx86-64.zip",
      "https://github.com/NPTP/RaylTime",
    ],
    linkTexts: ["Download for Windows", "Source on GitHub"],
  },
  {
    name: "GET HOME",
    platform: "Unity, C#",
    images: [
      "images/games/gethome/gethome01.png",
      "images/games/gethome/gethome02.png"
    ],
    video: ["images/games/gethome/gethome-video.mp4"],
    blurbLines: [
      "Get Home is being built with a team under the banner Red Cassette Studios.",
      "A puzzle game set in deep space, where you must enlist the aid of repair bots and a gravity manipulator device to uncover the mystery of the reactor and the missing crew.",
      "Get Home features full 3D gravity flipping mechanics, and the ability to control asymmetrical repair bots to overcome puzzles.",
      "Slated for completion in mid 2021 !"
    ],
    linkURLs: [
      "https://github.com/NPTP/GetHome",
    ],
    linkTexts: ["Development Repo"],
  },
  {
    name: "DEADWOOD DUEL",
    platform: "Stencyl",
    images: [
      "images/games/dd/dd01.png",
      "images/games/dd/dd02.png",
      "images/games/dd/dd03.png",
      "images/games/dd/dd04.png",
    ],
    video: [],
    blurbLines: [
      "A reflex shooter set in the Old West.",
      "Choose your difficulty, watch the clock, and be quick - or be dead.",
      "I created every part of the game: design, gameplay, and 100% of the assets (art, animation, sound and music).",
    ],
    linkURLs: ["https://nickperrin.itch.io/deadwoodduel"],
    linkTexts: ["Play on itch.io"],
  },
  {
    name: "LOONY LAB",
    platform: "Unity, C#",
    images: [
      "images/games/ll/ll01.png",
      "images/games/ll/ll02.png",
      "images/games/ll/ll03.png",
      "images/games/ll/ll04.png",
    ],
    video: [],
    blurbLines: [
      "Loony Lab was part of a research project headed by Steve Engels at the University of Toronto, studying the effectiveness of design changes in pedagogical techniques in videogames. The material was taken straight from high school curriculum.",
      "Working with a partner, the two of us created a game design document, recorded progress in a dev blog, ran playtests with various demographics including game industry professionals, conducted two rounds of research with the game using self-developed study instruments, and produced a final report on our findings.",
      "I contributed code, design, art, animation, and sound. Royalty-free visual assets were modified to suit our needs.",
    ],
    linkURLs: [
      "data/downloads/LoonyLab_Winx86-64.zip",
      "data/downloads/LoonyLab_MacOS.zip",
      "https://github.com/NPTP/LoonyLab",
    ],
    linkTexts: ["Download for Windows", "Download for Mac", "Source on GitHub"],
  },

  {
    name: "GAME JAMS",
    platform: "HTML5 / Javascript",
    images: [
      "images/games/gj/gj01.png",
      "images/games/gj/gj02.png",
      "images/games/gj/gj03.png",
      "images/games/gj/gj04.png",
      "images/games/gj/gj05.jpg",
    ],
    video: [],
    blurbLines: [
      `For several game jams in Toronto, I've worked with a team consisting of a designer, an artist and a programmer, all of whom have experience either in AAA or indie game production. They're a truly talented bunch and it's been a privilege to do these jams with them under the banner of "ButterBrains."`,
      "We put our heads together and designed the games as a group. Additionally, I did all sound and music, and some level design.",
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
    name: "KCSHARE",
    platform: "Web & Mobile with React & React Native",
    images: [
      "images/games/kcshare/kcs01.png",
      "images/games/kcshare/kcs02.png",
      "images/games/kcshare/kcs03.png",
      "images/games/kcshare/kcs04.png",
    ],
    video: [],
    blurbLines: [
      "A combo web and mobile app with unique experiences for each, designed as a prototype for a private high school's new learning platform.",
      "KCShare allows students to share their learning and unique experiences with other students and teachers in a low-pressure social space.",
      "Working with a team, I contributed team leadership, design, and code for web and mobile, as we translated client needs into finished product.",
    ],
    linkURLs: ["https://github.com/NPTP/KCShare"],
    linkTexts: ["Source on GitHub"],
  },
  {
    name: "OTHER PROJECTS",
    platform: "Various",
    images: [
      "images/games/other/industrialsector01.png",
      "images/games/other/industrialsector02.png",
      "images/games/other/404jam1.png",
    ],
    video: [],
    blurbLines: [
      `<span class="bold">INDUSTRIAL SECTOR:</span> A high-concept, grim post-apocalyptic mod for Doom (1993) built on a modern port of the game's open-source engine. <a>In Progress</a>`,
      `<span class="bold">CSC404 Game Jam:</span> Bounce around & destroy Fine China! Made in 6 hours with a cool team. <a href="https://nickperrin.itch.io/armadillo-in-a-china-shop-jam-game">Play on itch.io</a>`,
    ],
    linkURLs: [],
    linkTexts: [],
  },
];
