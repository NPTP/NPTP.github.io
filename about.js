/* ------------------
   ABOUT PAGE script
   ----------------- */

// Going with a hard-coded approach for now, as this page is not likely to expand.

// Get viewport height and width
const docElement =
  document.compatMode === "CSS1Compat"
    ? document.documentElement
    : document.body;
const viewportHeight = docElement.clientHeight;
const viewportWidth = docElement.clientWidth;

// Make array of all temporarily hidden elements
// TODO: Get skills section and footnote in here
let hiddenElements = [document.getElementById("about_education")];

// Listen for scroll events
document.addEventListener("scroll", appear);

// Make hidden elements appear if they're already in view
if (hiddenElements[0].getBoundingClientRect().top <= viewportHeight) {
  hiddenElements[0].classList.add("show");
  hiddenElements[0].classList.remove("hide");
  // TODO: remove this element from the array
}

// Make div with id "about_education" change class when scrolled into view
function appear() {
  const rect = hiddenElements[0].getBoundingClientRect();
  /* Debugging */
  // console.log("rect.top: " + rect.top);
  // console.log("viewportHeight: " + viewportHeight);
  if (rect.top <= viewportHeight) {
    hiddenElements[0].classList.add("show");
    hiddenElements[0].classList.remove("hide");
    document.removeEventListener("scroll", appear);
  }
}
