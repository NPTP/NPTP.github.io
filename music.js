// ------------------------------------
// MUSIC PAGE script
// ------------------------------------

// Constant used by appear.js to know how many cards are on this page.
// Hardcoded for this page.
const NUM_CARDS = 2;

// // Get viewport height and width dependent on CSS compat
// const docElement =
//   document.compatMode === "CSS1Compat"
//     ? document.documentElement
//     : document.body;
// const viewportHeight = docElement.clientHeight;
// const viewportWidth = docElement.clientWidth;

// // Listen for scroll events
// document.addEventListener("scroll", appear);

// function reveal(cardList, index) {
//   cardList[index].classList.remove("hide-card");
//   cardList[index].classList.add("card");
//   cardList[index].classList.add("card-appear");

//   if (index < cardList.length - 1) {
//     delay = setTimeout(function () {
//       reveal(cardList, index + 1);
//     }, CARDREVEAL_TIMEOUT_VAL);
//   }
// }

// // Make hidden divs change class when SCROLLED into view
// function appear() {
//   cardList = [];
//   let firstCardIncluded = false;
//   for (let i = 0; i < NUM_MUSIC_CARDS; i++) {
//     const card = document.getElementById(i.toString());
//     const top = card.getBoundingClientRect().top;
//     if (top <= viewportHeight) {
//       if (card.className === "hide-card") {
//         cardList.push(card);
//         if (i === 0) {
//           firstCardIncluded = true;
//         }
//       }
//       if (i === NUM_MUSIC_CARDS - 1) {
//         document.removeEventListener("scroll", appear);
//       }
//     }
//   }

//   if (cardList.length > 0) {
//     if (firstCardIncluded) {
//       // If the first card is part of this call, delay its appearance until after the header has appeared.
//       initialDelay = setTimeout(function () {
//         reveal(cardList, 0);
//       }, 800);
//     } else {
//       reveal(cardList, 0);
//     }
//   }
// }
