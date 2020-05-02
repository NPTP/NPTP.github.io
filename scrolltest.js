// Scroll test

document.addEventListener("scroll", appear);

const docElement =
  document.compatMode === "CSS1Compat"
    ? document.documentElement
    : document.body;
const viewportHeight = docElement.clientHeight;
var viewportWidth = docElement.clientWidth;

function appear() {
  let revealer = document.getElementById("revealer");
  const rect = revealer.getBoundingClientRect();
  if (rect.top <= viewportHeight) {
    revealer.classList.add("show");
    revealer.classList.remove("hide");
    document.removeEventListener("scroll", appear);
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
