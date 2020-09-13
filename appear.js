// CARD APPEAR script
// Used in portfolio.js, music.js
// Currently about.js uses its own appearing script due to differences

// Staggered card reveal time delay constant in milliseconds
const CARDREVEAL_TIMEOUT_VAL = 250;

// Get viewport height and width dependent on CSS compat
const docElement =
  document.compatMode === "CSS1Compat"
    ? document.documentElement
    : document.body;
const viewportHeight = docElement.clientHeight;
// const viewportWidth = docElement.clientWidth;

// Given a list of cards that are in view, changes CSS classes
// to make cards animate and show up with staggered timer
function reveal(cardList, index) {
  cardList[index].classList.remove("hide-card");
  cardList[index].classList.add("card");
  cardList[index].classList.add("card-appear");

  if (index < cardList.length - 1) {
    delay = setTimeout(function () {
      reveal(cardList, index + 1);
    }, CARDREVEAL_TIMEOUT_VAL);
  }
}

// Triggered on scroll. Checks which cards are in view. For those in view,
// make them appear! When all have appeared, remove the scroll listener.
function appear(numCards) {
  cardList = [];
  let firstCardIncluded = false;
  for (let i = 0; i < numCards; i++) {
    const card = document.getElementById(i.toString());
    const top = card.getBoundingClientRect().top;
    if (top <= viewportHeight) {
      if (card.className === "hide-card") {
        cardList.push(card);
        if (i === 0) {
          firstCardIncluded = true;
        }
      }
      if (i === numCards - 1) {
        document.removeEventListener("scroll", appear);
      }
    }
  }

  if (cardList.length > 0) {
    if (firstCardIncluded) {
      // If the first card is part of this call, delay its appearance until after the header has appeared.
      initialDelay = setTimeout(function () {
        reveal(cardList, 0);
      }, 800);
    } else {
      reveal(cardList, 0);
    }
  }
}

// Listen for scroll events. We get NUM_CARDS assigned in each page's own js file.
document.addEventListener("scroll", () => appear(NUM_CARDS));

// Initial to make cards appear if they're ALREADY in view when entering the page.
appear(NUM_CARDS);
