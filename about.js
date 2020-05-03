// ------------------------------------
// ABOUT PAGE script
// ------------------------------------

// Get viewport height and width
const docElement =
  document.compatMode === "CSS1Compat"
    ? document.documentElement
    : document.body;
const viewportHeight = docElement.clientHeight;
const viewportWidth = docElement.clientWidth;

// Collect all sections. Hard-coding values as this page is not likely to expand.
let educationSection = {
  elem: document.getElementById("about_education"),
  showClass: "show-education",
};
let skillsSection = {
  elem: document.getElementById("about_skills"),
  showClass: "show-skills",
};
let footnote = {
  elem: document.getElementById("about_footnote"),
  showClass: "show-footnote",
};
const sections = [educationSection, skillsSection, footnote];

// Listen for scroll events
document.addEventListener("scroll", appear);

// TODO: this whole for loop thing is called multiple times. Put it in a separate callable function
// Make hidden elements appear if they're ALREADY in view
for (let i = 0; i < sections.length; i++) {
  const section = sections[i];
  if (section.elem.getBoundingClientRect().top <= viewportHeight) {
    section.elem.classList.remove("hide");
    section.elem.classList.add(section.showClass);
    if (i === sections.length - 1) {
      document.removeEventListener("scroll", appear);
    }
  }
}

// Make hidden divs change class when SCROLLED into view
function appear() {
  // Debugging
  // console.log("rect.top: " + rect.top);
  // console.log("viewportHeight: " + viewportHeight);

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.elem.getBoundingClientRect().top + 10 <= viewportHeight) {
      // TODO: do some (top - bottom) thing to make it appear a little later?
      section.elem.classList.remove("hide");
      section.elem.classList.add(section.showClass);
      if (i === sections.length - 1) {
        document.removeEventListener("scroll", appear);
      }
    }
  }
}
