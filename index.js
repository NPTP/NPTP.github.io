// Infinite carousels: repeat the items until one set covers the screen,
// then duplicate that set and wrap the offset every set-width for a seamless loop.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Loading carousel items from a folder ----
// The order comes from CAROUSELS in carousels/carousels.js. Each name there is a JSON file
// in carousels/<carousel>/:
//   { "title": "...", "description": "...", "media": "file-in-this-folder.mp4", "media_url": "https://..." }
// media_url is tried first, then media, then a grey placeholder box.
const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "ogv"];
const MEDIA_URL_TIMEOUT = 8000; // ms before giving up on a media_url and trying local media

const isVideoUrl = (url) => {
  const ext = url.split(/[?#]/)[0].split(".").pop().toLowerCase();
  return VIDEO_EXTENSIONS.includes(ext);
};

// Resolve to a loaded <img>/<video>, or null if the url doesn't load
function loadMedia(url, asVideo = isVideoUrl(url), timeout = 0) {
  return new Promise((resolve) => {
    const el = document.createElement(asVideo ? "video" : "img");
    let timer;
    const done = (ok) => {
      clearTimeout(timer);
      el.onload = el.onerror = el.onloadeddata = null;
      resolve(ok ? el : null);
    };
    if (timeout) timer = setTimeout(() => done(false), timeout);
    el.onerror = () => done(false);
    if (asVideo) {
      Object.assign(el, { muted: true, loop: true, autoplay: true, playsInline: true, preload: "auto" });
      el.onloadeddata = () => done(true);
    } else {
      el.onload = () => done(true);
    }
    el.src = url;
  });
}

// media_url first (a url with no recognisable extension is tried as an image, then a video),
// then the local media file, then null (grey placeholder)
async function resolveMedia(folder, data) {
  if (data.media_url) {
    const attempts = isVideoUrl(data.media_url) ? [true] : [false, true];
    for (const asVideo of attempts) {
      const el = await loadMedia(data.media_url, asVideo, MEDIA_URL_TIMEOUT);
      if (el) return el;
    }
  }
  if (data.media) return loadMedia(`${folder}/${data.media}`);
  return null;
}

// A listed name whose JSON is missing or invalid is skipped (with a console warning)
async function loadCarouselItems(name) {
  const folder = `carousels/${name}`;
  const items = await Promise.all(
    (CAROUSELS[name] || []).map(async (entry) => {
      let data;
      try {
        const res = await fetch(`${folder}/${entry}.json`, { cache: "no-cache" });
        data = await res.json();
      } catch {
        console.warn(`Carousel "${name}": couldn't load ${folder}/${entry}.json, skipping it`);
        return null;
      }
      const media = (await resolveMedia(folder, data)) || document.createElement("div");
      if (media.tagName === "DIV") media.className = "placeholder";
      if (data.title) media.dataset.title = data.title;
      if (data.description) media.dataset.description = data.description;
      return media;
    })
  );
  return items.filter(Boolean);
}

// Put an item in a square frame with a hover overlay built from its
// data-title / data-description attributes.
function wrapItem(media) {
  const item = document.createElement("div");
  item.className = "item";
  item.appendChild(media);

  const { title, description } = media.dataset;
  if (media.tagName === "IMG") media.alt = title || "";
  if (title || description) {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    if (title) {
      const h = document.createElement("h3");
      h.textContent = title;
      overlay.appendChild(h);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description;
      overlay.appendChild(p);
    }
    item.appendChild(overlay);
  }
  return item;
}

function closeActiveItems() {
  document.querySelectorAll(".item.active").forEach((el) => el.classList.remove("active"));
}

// Tapping anywhere outside a carousel item closes its overlay
document.addEventListener("click", (e) => {
  if (!e.target.closest(".item")) closeActiveItems();
});

async function setupCarousel(carousel) {
  const track = carousel.querySelector(".track");
  const originals = (await loadCarouselItems(carousel.dataset.carousel)).map(wrapItem);
  if (!originals.length) {
    carousel.closest("section").remove(); // nothing to show: drop the heading too
    return;
  }
  const speed = reducedMotion ? 0 : Number(carousel.dataset.speed) || 40; // px per second
  const direction = carousel.hasAttribute("data-reverse") ? 1 : -1;

  let setWidth = 0;
  let pos = 0; // kept within (-setWidth, 0]
  let hovered = false;
  let glide = null; // { from, to, start } while an arrow click or reveal animates
  let last = performance.now();

  const wrap = (x) => (setWidth ? (((x % setWidth) - setWidth) % setWidth) : 0);
  const glideTo = (to) => (glide = { from: pos, to, start: performance.now() });

  // Where an item's edges will be once any in-progress glide finishes
  function edgesOf(item, shift = 0) {
    const rect = item.getBoundingClientRect();
    const pending = (glide ? glide.to - pos : 0) + shift;
    return { left: rect.left + pending, right: rect.right + pending };
  }

  // The one place alignment happens (hover, tap and arrows all use it): slide the
  // carousel just far enough that the item's hidden edge meets the screen edge.
  // The item only moves by its hidden amount, so it stays under the cursor/finger.
  function reveal(edges) {
    const view = carousel.getBoundingClientRect();
    const target = glide ? glide.to : pos;
    if (edges.left < view.left) glideTo(target + (view.left - edges.left));
    else if (edges.right > view.right) glideTo(target - (edges.right - view.right));
  }

  const bringIntoView = (item) => reveal(edgesOf(item));

  // Arrows: reveal the nearest item hidden past that edge. The track repeats every
  // setWidth, so items are also considered one set over in each direction.
  function revealNext(side) {
    const view = carousel.getBoundingClientRect();
    let best = null;
    for (const item of track.children) {
      for (const shift of [-setWidth, 0, setWidth]) {
        const e = edgesOf(item, shift);
        if (side === "right" && e.right > view.right + 0.5 && (!best || e.right < best.right)) best = e;
        if (side === "left" && e.left < view.left - 0.5 && (!best || e.left > best.left)) best = e;
      }
    }
    if (best) reveal(best);
  }

  function addArrow(side) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `arrow arrow-${side}`;
    btn.setAttribute("aria-label", side === "left" ? "Previous" : "Next");
    btn.innerHTML =
      side === "left"
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
    btn.addEventListener("click", () => revealNext(side));
    carousel.appendChild(btn);
  }
  addArrow("left");
  addArrow("right");

  // Tap (touch screens): toggle the tapped item's overlay and pause while one is open
  carousel.addEventListener("click", (e) => {
    const item = e.target.closest(".item");
    if (!item) return;
    const wasActive = item.classList.contains("active");
    closeActiveItems();
    if (!wasActive) {
      item.classList.add("active");
      bringIntoView(item);
    }
  });

  // Hover (mouse): after a shift, wait for the cursor to actually move before shifting again,
  // so items sliding under a still cursor don't chain-shift the carousel
  let lockedAt = null;
  carousel.addEventListener("pointermove", (e) => {
    if (lockedAt && (e.clientX !== lockedAt.x || e.clientY !== lockedAt.y)) lockedAt = null;
  });
  carousel.addEventListener("pointerover", (e) => {
    if (e.pointerType !== "mouse" || glide || lockedAt) return;
    const item = e.target.closest(".item");
    if (!item || item.contains(e.relatedTarget)) return;
    bringIntoView(item);
    if (glide) lockedAt = { x: e.clientX, y: e.clientY };
  });

  carousel.addEventListener("mouseenter", () => (hovered = true));
  carousel.addEventListener("mouseleave", () => {
    hovered = false;
    lockedAt = null;
  });

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.1); // avoid jumps after tab switches or stalls
    last = now;
    if (glide) {
      const t = Math.min((now - glide.start) / 450, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      pos = glide.from + (glide.to - glide.from) * ease;
      if (t === 1) {
        pos = wrap(glide.to);
        glide = null;
      }
    } else {
      if (!hovered && !track.querySelector(".item.active")) pos += direction * speed * dt;
      pos = wrap(pos);
    }
    track.style.transform = `translateX(${wrap(pos)}px)`;
    requestAnimationFrame(frame);
  }

  function build() {
    track.replaceChildren(...originals);
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    setWidth = track.scrollWidth + gap;
    const unit = setWidth;
    while (setWidth < window.innerWidth) {
      originals.forEach((el) => track.appendChild(el.cloneNode(true)));
      setWidth += unit;
    }
    Array.from(track.children).forEach((el) => {
      const copy = el.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      track.appendChild(copy);
    });
    track.querySelectorAll("video").forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });
    pos = wrap(pos);
  }

  build();
  requestAnimationFrame(frame);
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
}

// One section per list in CAROUSELS, in the order they're written, placed above Contact.
// The list name becomes the heading ("sound_design" → "SOUND DESIGN") and the folder name.
// Scroll direction alternates: first right-to-left, second left-to-right, and so on.
const CAROUSEL_SPEED = 28; // px per second
const contactSection = document.querySelector(".contact-section");

Object.keys(CAROUSELS).forEach((name, i) => {
  const section = document.createElement("section");
  section.className = "section";
  const heading = document.createElement("h2");
  heading.className = "heading";
  heading.textContent = name.replace(/[_-]+/g, " ").toUpperCase();
  const carousel = document.createElement("div");
  carousel.className = "carousel";
  carousel.dataset.carousel = name;
  carousel.dataset.speed = CAROUSEL_SPEED;
  if (i % 2 === 1) carousel.dataset.reverse = "";
  const track = document.createElement("div");
  track.className = "track";
  carousel.appendChild(track);
  section.append(heading, carousel);
  contactSection.before(section);
  setupCarousel(carousel);
});

// Fade-in: every direct child of the header and each section fades in once it scrolls
// into view, staggered top to bottom. New sections are picked up automatically.
const revealGap = 180; // ms between consecutive fade-ins
let nextRevealAt = 0;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      .forEach((e) => {
        const now = performance.now();
        const delay = Math.max(0, nextRevealAt - now);
        nextRevealAt = now + delay + revealGap;
        e.target.style.transitionDelay = `${delay}ms`;
        e.target.classList.add("revealed");
        revealObserver.unobserve(e.target);
        // Once faded in, hand the element back to its own styles (e.g. hover transitions)
        setTimeout(() => {
          e.target.classList.remove("reveal", "revealed");
          e.target.style.transitionDelay = "";
        }, delay + 800);
      });
  },
  { threshold: 0.15 }
);

document.querySelectorAll("header > *, section > *").forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

// Contact: address is assembled at click time so it never appears in the page source.
const parts = ["moc.kooltuo", "nirrepptpkcin"];
const address = () => parts[1].split("").reverse().join("") + "@" + parts[0].split("").reverse().join("");

const toast = document.getElementById("toast");
let toastTimer;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  return ok;
}

document.getElementById("contact").addEventListener("click", async () => {
  const text = address();
  try {
    await navigator.clipboard.writeText(text);
    showToast("Email copied");
  } catch {
    showToast(fallbackCopy(text) ? "Email copied" : text);
  }
});
