// ------------------------------------
// ABOUT PAGE script
// ------------------------------------

// Number of cards on music page. Hard-coded value since
// music page cards have different structures.
const NUM_ABOUT_CARDS = 4;
// Time (ms) between cards revealing
const CARDREVEAL_TIMEOUT_VAL = 250;

// Get viewport height and width dependent on CSS compat
const docElement =
  document.compatMode === "CSS1Compat"
    ? document.documentElement
    : document.body;
const viewportHeight = docElement.clientHeight;
const viewportWidth = docElement.clientWidth;

let displaying = false;

// Listen for scroll events
document.addEventListener("scroll", appear);

function reveal(cardList, index) {
  let revealTimeout = 0;
  if (cardList[index].id === "0") {
    blurbContainer = cardList[0];
    blurbContainer.classList.remove("hide");
    blurbContainer.classList.add("about-container");
    let leftSide = document.querySelector("#left-about-id");
    let rightSide = document.querySelector("#right-about-id");
    let footnote = document.querySelector("#footnote");
    leftSide.classList.remove("hide");
    rightSide.classList.remove("hide");
    footnote.classList.remove("hide");
    leftSide.classList.add("left-about");
    leftSide.classList.add("left-about-anim");
    rightSide.classList.add("right-about");
    rightSide.classList.add("right-about-anim");
    footnote.classList.add("about-buildnote");
    footnote.classList.add("vwtext-16");
    revealTimeout = 1750;
  } else {
    cardList[index].classList.remove("hide-card");
    cardList[index].classList.add("card");
    cardList[index].classList.add("card-appear");
    revealTimeout = CARDREVEAL_TIMEOUT_VAL;
  }

  if (index < cardList.length - 1) {
    delay = setTimeout(function () {
      reveal(cardList, index + 1);
    }, revealTimeout);
  }
}

// Make hidden divs change class when SCROLLED into view
function appear() {
  cardList = [];
  for (let i = 0; i < NUM_ABOUT_CARDS; i++) {
    const card = document.getElementById(i.toString());
    if (i === 0 && card.className === "hide") {
      cardList.push(card);
    } else {
      const top = card.getBoundingClientRect().top;
      if (top <= viewportHeight) {
        if (card.className === "hide-card") {
          cardList.push(card);
        }
        if (i === NUM_ABOUT_CARDS - 1) {
          document.removeEventListener("scroll", appear);
        }
      }
    }
  }

  if (cardList.length > 0) {
    // console.log(cardList);
    reveal(cardList, 0);
  }
}

// Call to make hidden elements appear if they're ALREADY in view.
appear();
