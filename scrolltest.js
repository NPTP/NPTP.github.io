function $(x) {
  return document.getElementById(x);
}

document.addEventListener("scroll", appear);

const docElement =
  document.compatMode === "CSS1Compat"
    ? document.documentElement
    : document.body;
const viewportHeight = docElement.clientHeight;
var viewportWidth = docElement.clientWidth;

function appear() {
  let rev = $("revealer");
  //   console.log("document scrollTop: " + document.scrollingElement.scrollTop);
  console.log("pageYoffset: " + window.pageYOffset);
  //   console.log("revealer top: " + rev.yoffset);

  const rect = rev.getBoundingClientRect();
  console.log("rect.top = " + rect.top);
  console.log("rect.height = " + rect.height);
  console.log("viewportHeight = " + viewportHeight);
  if (rect.top <= viewportHeight) {
    rev.classList.add("show");
    rev.classList.remove("hide");
    // document.removeEventListener("scroll", appear);
  }
}

// document.addEventListener("scroll", function (event) {
//     window.addEventListener("click", (e) => {
//       var y_scroll_pos = window.pageYOffset;
//       console.log(y_scroll_pos);
//       var scroll_pos_test = 200; // Determines how far down the page the div fades in.
//       if (y_scroll_pos > scroll_pos_test) {
//         console.log("y scroll pos > scroll pos test!\n");
//         reveal_text = $("revealer");
//         reveal_text.classList.add("show");
//         reveal_text.classList.remove("hide");
//       }
//     });
// });

// $("#revealer").addEventListener("click", (e) => {
//   $("html, body").animate({ scrollTop: 0 }, "slow");
// });
