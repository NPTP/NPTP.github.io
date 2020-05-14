// ------------------------------------
// ABOUT PAGE script
// ------------------------------------

// Get viewport height and width dependent on CSS compat
const docElement =
  document.compatMode === "CSS1Compat"
    ? document.documentElement
    : document.body;
const viewportHeight = docElement.clientHeight;
const viewportWidth = docElement.clientWidth;

// Collect all sections. Hard-coding values as this page is not likely to expand.
let skillsSection = {
  elem: document.getElementById("about_skills"),
  showClass: "show-skills",
  visAdjust: 50,
};
let skills1 = {
  elem: document.getElementById("skills1"),
  showClass: "show-skills-item",
  visAdjust: 200,
};
let skills2 = {
  elem: document.getElementById("skills2"),
  showClass: "show-skills-item",
  visAdjust: 50,
};
let skills3 = {
  elem: document.getElementById("skills3"),
  showClass: "show-skills-item",
  visAdjust: 50,
};
let skills4 = {
  elem: document.getElementById("skills4"),
  showClass: "show-skills-item",
  visAdjust: 50,
};
let educationSection = {
  elem: document.getElementById("about_education"),
  showClass: "show-education",
  visAdjust: 50,
};
let footnote = {
  elem: document.getElementById("about_footnote"),
  showClass: "show-footnote",
  visAdjust: 25,
};
const sections = [
  educationSection,
  skillsSection,
  skills1,
  skills2,
  skills3,
  skills4,
  footnote,
];

// Listen for scroll events
document.addEventListener("scroll", appear);

// TODO: this whole for loop thing is called here and below again. Put it in a separate callable function
// Make hidden elements appear if they're ALREADY in view
for (let i = 0; i < sections.length; i++) {
  const section = sections[i];
  const top = section.elem.getBoundingClientRect().top;
  if (top + section.visAdjust <= viewportHeight) {
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
    const top = section.elem.getBoundingClientRect().top;
    if (top + section.visAdjust <= viewportHeight) {
      section.elem.classList.remove("hide");
      section.elem.classList.add(section.showClass);
      if (i === sections.length - 1) {
        document.removeEventListener("scroll", appear);
      }
    }
  }
}
