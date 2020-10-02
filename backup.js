function appear() {
  for (let i = 1; i < games.length; i++) {
    const card = document.getElementById(i.toString());
    // console.log(card);
    const top = card.getBoundingClientRect().top;
    // console.log(viewportHeight);
    // if (top + viewportHeight / 6 <= viewportHeight) {
    if (top <= viewportHeight) {
      card.classList.remove("hide-card");
      card.classList.add("card");
      card.classList.add("card-appear");
      if (i === games.length - 1) {
        document.removeEventListener("scroll", appear);
        // console.log("Removed event listener");
      }
    }
  }
}

// Excerpt from portfolio.js
for (let i = 0; i < games.length; i++) {
  let card = document.createElement("div");
  card.id = i; // Number each card with its index in the list
  if (i === 0) {
    card.classList.add("card");
    card.classList.add("card0-anim");
  } else {
    card.classList.add("hide-card");
  }
  let blurb = "";

  name: "INDUSTRIAL SECTOR",
  platform: "GZDoom",
  images: [
    "images/games/industrialsector/is01.png",
    "images/games/industrialsector/is02.png",
    "images/games/industrialsector/is03.png",
    "images/games/industrialsector/is04.png",
  ],
  video: [],
  blurbLines: [
    "A high-concept, grim post-apocalyptic mod for Doom (1993) built on a modern port of the game's open-source engine.",
    "A work-in-progress passion project where I produce code, levels, music, sound, animation, and narrative, while keeping the core of the game's assets and design in the classic Doom mould.",
    "I'm also using resources and tools made available by people in the incredible community around Doom that is still flourishing to this day.",
  ],
  linkURLs: [],
  linkTexts: [],
},