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