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

let displaying = -1;
let depth = 0;

function displayImages(card) {
  // Get images
  let images = card.querySelectorAll("img"); // TODO: Can we make this smarter by not doing this *every* single time?
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
      displayImages(card);
    }, 1000);
  }
}

function cardMouseEnter(e) {
  displaying = true;
  const card = e.target;
  displayImages(card);
}

function cardMouseLeave(e) {
  displaying = false;
  clearTimeout(call);
}

const games = [
  {
    name: "DEADWOOD DUEL",
    platform: "Stencyl",
    images: [
      "images/games/dd/dd01.png",
      "images/games/dd/dd02.png",
      "images/games/dd/dd03.png",
      "images/games/dd/dd04.png",
    ],
    blurbLines: [
      "A reflex shooter set in the Old West.",
      "Choose your difficulty, watch the clock, and be quick - or be dead.",
      "I created every part of the game: design, gameplay, and 100% of the assets (art, animation, sound and music).",
    ],
    linkURLs: ["https://itch.io/", "data/downloads/placeholder_download.zip"],
    linkTexts: ["Play on itch.io", "Download Windows executable"],
  },
  {
    name: "Mr. Placeholder",
    platform: "PlaceHeld",
    images: ["images/index_placeholder.jpg", "images/index_placeholder2.jpg"],
    blurbLines: ["I am a placeholder.", "That's right - I hold a place!"],
    linkURLs: [
      "https://www.google.ca/",
      "https://www.rockpapershotgun.com/",
      "images/logo.png",
    ],
    linkTexts: ["Go to Google", "Go to RPS", "Go to local image"],
  },
];

gamesList = document.getElementById("games");

for (let i = 0; i < games.length; i++) {
  let gameCard = document.createElement("div");
  gameCard.id = i; // Number each card with its index in the list
  gameCard.classList.add("card");
  gameCard.classList.add("anim1");
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
  for (let h = 0; h < games[i].images.length; h++) {
    if (h === 0) {
      images = images + `<img class="show-img" src="${games[i].images[h]}" />`;
    } else {
      images = images + `<img class="hide-img" src="${games[i].images[h]}" />`;
    }
  }
  gameCard.innerHTML = `<div class="card-inner">
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

  gameCard.addEventListener("mouseenter", cardMouseEnter);
  gameCard.addEventListener("mouseleave", cardMouseLeave);

  gamesList.appendChild(gameCard);
}
