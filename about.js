// ------------------------------------
// ABOUT PAGE script
// ------------------------------------

// Number of cards on music page. Hard-coded value since
// music page cards have different structures.
const NUM_ABOUT_CARDS = 4;

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

// Make hidden divs change class when SCROLLED into view
function appear() {
  for (let i = 1; i < NUM_ABOUT_CARDS; i++) {
    const card = document.getElementById(i.toString());
    // console.log(card);
    const top = card.getBoundingClientRect().top;
    // console.log(viewportHeight);
    // if (top + viewportHeight / 6 <= viewportHeight) {
    if (top <= viewportHeight) {
      card.classList.remove("hide-card");
      card.classList.add("card");
      card.classList.add("card-appear");
      if (i === NUM_ABOUT_CARDS - 1) {
        document.removeEventListener("scroll", appear);
        // console.log("Removed event listener");
      }
    }
  }
}

// Call to make hidden elements appear if they're ALREADY in view.
// The first card has a class set above such that it will always appear
// automatically regardless of this call.
appear();
