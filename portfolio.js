// ------------------------------------
// PORTFOLIO PAGE script
// ------------------------------------

// Get viewport height and width dependent on CSS compat
const docElement =
  document.compatMode === "CSS1Compat"
    ? document.documentElement
    : document.body;
const viewportHeight = docElement.clientHeight;
const viewportWidth = docElement.clientWidth;

// Define games in the list here to auto-populate page
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
    linkTexts: ["Download for Windows", "Go to Github repo"],
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
    images: ["images/games/is/is01.png"],
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

let displaying = false;

function displayImages(images) {
  let showIndex = 0;
  for (let i = 0; i < images.length; i++) {
    if (images[i].className === "show-img") {
      images[i].className = "hide-img";
      if (i == images.length - 1) {
        showIndex = 0;
      } else {
        showIndex = i + 1;
      }
      break;
    }
  }
  images[showIndex].className = "show-img";
  if (displaying) {
    call = setTimeout(function () {
      displayImages(images);
    }, 1000);
  }
}

function displayAnimation(card) {
  let images = card.querySelectorAll("img");
  for (let i = 0; i < images.length; i++) {
    images[i].className = "hide-img";
  }
  let video = card.querySelectorAll("video");
  video[0].className = "show-vid";
  video[0].play();
}

function hideAnimation(card) {
  let video = card.querySelectorAll("video");
  video[0].className = "hide-vid";
  let images = card.querySelectorAll("img");
  images[0].className = "show-img";
}

function pauseAnimation(card) {
  let video = card.querySelectorAll("video");
  video[0].pause();
}

function cardMouseEnter(e) {
  const card = e.target;
  if (games[card.id].video.length === 0) {
    displaying = true;
    let images = card.querySelectorAll("img");
    displayImages(images);
  } else {
    displayAnimation(card);
  }
}

function cardMouseLeave(e) {
  const card = e.target;
  if (games[card.id].video.length === 0) {
    displaying = false;
    clearTimeout(call);
  } else {
    pauseAnimation(card);
  }
}

gamesList = document.getElementById("games");
for (let i = 0; i < games.length; i++) {
  let card = document.createElement("div");
  card.id = i; // Number each card with its index in the list
  card.classList.add("hide-card");
  let blurb = "";
  for (let j = 0; j < games[i].blurbLines.length; j++) {
    blurb = blurb + games[i].blurbLines[j];
    if (j < games[i].blurbLines.length - 1) {
      blurb = blurb + "</br></br>";
    }
  }
  let links = "";
  for (let k = 0; k < games[i].linkURLs.length; k++) {
    links =
      links +
      `<a href="${games[i].linkURLs[k]}" target="_blank" class="vwtext-24">${games[i].linkTexts[k]}</a>`;
    if (k < games[i].linkURLs.length - 1) {
      links = links + "</br>";
    }
  }
  let images = "";
  for (let l = 0; l < games[i].images.length; l++) {
    if (l === 0) {
      images = images + `<img class="show-img" src="${games[i].images[l]}" />`;
    } else {
      images = images + `<img class="hide-img" src="${games[i].images[l]}" />`;
    }
  }
  let video = "";
  if (games[i].video.length > 0) {
    video = `<video width="640" height="480" class="hide-vid" muted loop autoplay>
    <source src="${games[i].video[0]}" type="video/webm">
  </video>`;
  } else {
    video = "";
  }
  card.innerHTML = `<div class="card-inner">
    <div class="card-row1">
      <div class="card-row1-left">
        <span class="bold vwtext-36">${games[i].name}</br>
      </div>
      <div class="card-row1-right">
        <span class="italic vwtext-24"> Platform: ${games[i].platform}</br>
      </div>
    </div>

    <div class="card-row2">
      <div class="card-row2-left">
        ${images}
        ${video}
      </div>
      <div class="card-row2-right">
        <div class="card-row2-right-top">
          <span class="vwtext-20">${blurb}</span>
        </div>
        <div class="card-row2-right-bottom">
          ${links}
        </div>
      </div>
    </div>
  </div>`;

  card.addEventListener("mouseenter", cardMouseEnter);
  card.addEventListener("mouseleave", cardMouseLeave);

  gamesList.appendChild(card);
}

// Listen for scroll events
document.addEventListener("scroll", appear);

// Make hidden divs change class when SCROLLED into view
function appear() {
  for (let i = 0; i < games.length; i++) {
    const card = document.getElementById(i.toString());
    console.log(card);
    const top = card.getBoundingClientRect().top;
    if (top + 50 <= viewportHeight) {
      // TODO: Issues with finding the right scroll pos to stat showing the card
      card.classList.remove("hide-card");
      card.classList.add("card");
      card.classList.add("anim0"); // TODO: Different anims speeds depending on i index?
      if (i === games.length - 1) {
        document.removeEventListener("scroll", appear);
        console.log("Removed event listener");
      }
    }
  }
}

// Call to make hidden elements appear if they're ALREADY in view
appear();
