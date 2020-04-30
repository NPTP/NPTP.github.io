function $(x) {
  return document.getElementById(x);
}

document.addEventListener("scroll", appear);

function appear() {
  let rev = $("revealer");
  console.log(document.scrollingElement.scrollTop);
  console.log("revealer top: " + rev.scrollTop);
  //   if (reveal_text.scrollTop <= 0) {
  //     console.log(reveal_text.scrollTop);
  //     console.log("Scrolled to " + window.pageYOffset + "\n");
  //     reveal_text.classList.add("show");
  //     reveal_text.classList.remove("hide");
  // document.removeEventListener("scroll", appear);
  //   }
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
