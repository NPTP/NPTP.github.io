// ------------------------------------
// NAVBAR script
// Prepends the navbar on a page
// ------------------------------------

// Two elements: the "trim" above the navbar, and the navbar itself.

let navbarTrim = document.createElement("div");
navbarTrim.classList.add("navbar-trim");

let navbar = document.createElement("ul");
navbar.classList.add("navbar");
navbar.innerHTML = `<div class="nav-container">
  <li class="logo">
    <a href="index.html">
      <img class="logo-img" src="images/logo.png" width="50" height="50"
    /></a>
  </li>
  <li class="navlink"><a href="about.html#contact">CONTACT</a></li>
  <li class="navlink">
    <a href="https://github.com/NPTP" target="_blank">GITHUB</a>
  </li>
  <li class="navlink"><a href="music.html">MUSIC</a></li>
  <li class="navlink"><a href="portfolio.html">PORTFOLIO</a></li>
  <li class="navlink"><a href="about.html">ABOUT</a></li>
</div>`;

let body = document.body;
body.insertBefore(navbar, body.firstChild);
body.insertBefore(navbarTrim, body.firstChild);
