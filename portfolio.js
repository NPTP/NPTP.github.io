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

const games = {
  games: [
    {
      name: "Deadwood Duel",
      platform: "Stencyl",
      images: [],
      blurbLines: [
        "A reflex shooter set in the Old West.",
        "Choose your difficulty, watch the clock, and be quick - or be dead.",
        "I created every part of the game: design, gameplay, and 100% of the assets (art, animation, sound and music).",
      ],
      linkTexts: ["Play on itch.io", "Download Windows executable"],
      linkURLs: ["https://itch.io/", "data/downloads/placeholder_download.zip"],
    },
    {
      name: "Mr. Placeholder",
      platform: "PlaceHeld",
      images: [],
      blurbLines: ["I am a placeholder.", "That's right - I hold a place!"],
      linkTexts: ["Go to Google", "Go to RPS", "Go to local image"],
      linkURLs: [
        "https://www.google.ca/",
        "https://www.rockpapershotgun.com/",
        "images/logo.png",
      ],
    },
  ],
};
