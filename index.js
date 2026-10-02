// Infinite carousels: repeat the items until one set covers the screen,
// then duplicate that set and wrap the offset every set-width for a seamless loop.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Loading carousel items from a folder ----
// The order comes from CAROUSELS in carousels/carousels.js. Each name there is a JSON file
// in carousels/<carousel>/:
//   { "title": "...", "description": "...", "media": "file-in-this-folder.mp4", "media_url": "https://...",
//     "poster": "still-shown-while-the-video-loads.jpg" }
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

// Nothing waits on media: a carousel appears as soon as its JSON files are in, and media fills in.
// Local media goes in straight away (images load as they arrive). Local videos show their poster
// and only start downloading once every carousel is on screen (see startVideos), so they don't
// crowd out the JSON files and images. A media_url can't be trusted to load, so its item shows a
// grey box until the url (or, failing that, the local media) is ready, then swaps it in.
const placeholder = () => Object.assign(document.createElement("div"), { className: "placeholder" });

function localMedia(folder, data) {
  if (!data.media) return null;
  const url = `${folder}/${data.media}`;
  if (isVideoUrl(url)) {
    const video = document.createElement("video");
    Object.assign(video, { muted: true, loop: true, autoplay: true, playsInline: true, preload: "auto" });
    if (data.poster) video.poster = `${folder}/${data.poster}`;
    video.dataset.src = url;
    return video;
  }
  const img = document.createElement("img");
  img.src = url;
  return img;
}

// media_url (a url with no recognisable extension is tried as an image, then a video),
// then the local media file, then null (stay a grey box)
async function remoteMedia(folder, data) {
  const attempts = isVideoUrl(data.media_url) ? [true] : [false, true];
  for (const asVideo of attempts) {
    const el = await loadMedia(data.media_url, asVideo, MEDIA_URL_TIMEOUT);
    if (el) return el;
  }
  return localMedia(folder, data);
}

// Resolves to [{ media, later }] in list order. `later` is a promise for the media to swap in
// (media_url items only). A listed name whose JSON is missing or invalid is skipped.
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
      const media = data.media_url ? placeholder() : localMedia(folder, data) || placeholder();
      if (data.title) media.dataset.title = data.title;
      if (data.description) media.dataset.description = data.description;
      if (data.soundcloud) media.dataset.soundcloud = data.soundcloud;
      if (data.link) media.dataset.link = data.link;
      if (data.start_offset) media.dataset.startOffset = data.start_offset;
      return { media, later: data.media_url ? remoteMedia(folder, data) : null };
    })
  );
  return items.filter(Boolean);
}

// ---- Videos ----
let videosStarted = false;

function startVideo(video) {
  if (video.dataset.src && !video.getAttribute("src")) video.src = video.dataset.src;
  video.muted = true;
  syncVideo(video);
  video.play().catch(() => {});
}

// Called once every carousel is on screen; copies made after this start themselves
function startAllVideos() {
  videosStarted = true;
  document.querySelectorAll(".track video").forEach(startVideo);
}

// Videos play in step with the time since the page opened, shifted by their
// start_offset (seconds). So every copy of a video, and videos that load late,
// stay in a fixed relationship to each other and to animations that start on load.
function syncVideo(video) {
  const apply = () => {
    const offset = parseFloat(video.dataset.startOffset) || 0;
    if (video.duration) video.currentTime = (performance.now() / 1000 + offset) % video.duration;
  };
  if (video.readyState >= 1) apply();
  else video.addEventListener("loadedmetadata", apply, { once: true });
  // Browsers pause videos in hidden tabs; jump back into step whenever playback resumes
  video.addEventListener("play", apply);
}

// A page opened in a background tab can have its autoplay blocked; start the videos once it's shown
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") return;
  document.querySelectorAll(".track video").forEach((v) => {
    if (v.paused) v.play().catch(() => {});
  });
});

// Put an item in a square frame with a hover overlay built from its
// data-title / data-description attributes, plus a Play button if it has a SoundCloud track
// (plays on the page, with a ▶ icon) or a link (opens in a new tab, text only).
function wrapItem(media) {
  const item = document.createElement("div");
  item.className = "item";
  item.appendChild(media);

  const { title, description, soundcloud, link } = media.dataset;
  if (soundcloud) item.dataset.soundcloud = soundcloud;
  else if (link) item.dataset.link = link;
  if (soundcloud || link) item.classList.add("playable");
  if (media.tagName === "IMG") media.alt = title || "";
  if (title || description || soundcloud || link) {
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
    if (soundcloud) {
      const play = document.createElement("button");
      play.type = "button";
      play.className = "play";
      play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>Play';
      overlay.appendChild(play);
    } else if (link) {
      const play = document.createElement("a");
      play.className = "play";
      play.href = link;
      play.target = "_blank";
      play.rel = "noopener";
      play.textContent = "Play";
      overlay.appendChild(play);
    }
    item.appendChild(overlay);
  }
  return item;
}

// ---- SoundCloud player bar ----
// A single player docked to the bottom of the screen; playing another track replaces it.
const canHover = window.matchMedia("(hover: hover)");
let playerBar = null;

function playTrack(url) {
  if (!playerBar) {
    playerBar = document.createElement("div");
    playerBar.className = "player-bar";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "player-close";
    close.setAttribute("aria-label", "Close player");
    close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    close.addEventListener("click", () => {
      playerBar.remove();
      playerBar = null;
      document.body.classList.remove("player-open");
    });
    const frame = document.createElement("iframe");
    frame.title = "SoundCloud player";
    frame.allow = "autoplay";
    playerBar.append(frame, close);
    document.body.appendChild(playerBar);
    document.body.classList.add("player-open");
  }
  const request = ++playRequest;
  playerSource(url).then((source) => {
    if (request !== playRequest || !playerBar) return; // another track was picked, or the player closed
    const params = new URLSearchParams({
      ...source,
      auto_play: "true",
    color: "#38bdf8",
    hide_related: "true",
    show_comments: "false",
    show_reposts: "false",
      show_teaser: "false",
      visual: "false",
    });
    playerBar.querySelector("iframe").src = `https://w.soundcloud.com/player/?${params}`;
  });
}

// The player can't open a private track's link (".../track-name/s-SECRET") directly: it needs the
// track's API address plus the secret token. SoundCloud's oEmbed service turns one into the other.
// Public links (and any lookup that fails) are passed through as they are.
let playRequest = 0;

async function playerSource(url) {
  if (!/\/s-[A-Za-z0-9]+(?:[/?#]|$)/.test(new URL(url).pathname + "/")) return { url };
  try {
    const res = await fetch(`https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`);
    const html = (await res.json()).html;
    const embed = new URL(html.match(/src="([^"]+)"/)[1].replace(/&amp;/g, "&"));
    const params = new URLSearchParams(embed.search);
    return { url: params.get("url"), secret_token: params.get("secret_token") };
  } catch {
    console.warn(`SoundCloud couldn't look up ${url}; it may be private with embedding turned off`);
    return { url };
  }
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
  const entries = await loadCarouselItems(carousel.dataset.carousel);
  const originals = entries.map((entry, i) => {
    const item = wrapItem(entry.media);
    item.dataset.key = i;
    return item;
  });
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

  // Edge alignment (mouse hover and the arrows use it): slide the carousel just far
  // enough that the item's hidden edge meets the screen edge.
  // The item only moves by its hidden amount, so it stays under the cursor/finger.
  function reveal(edges) {
    const view = carousel.getBoundingClientRect();
    const target = glide ? glide.to : pos;
    if (edges.left < view.left) glideTo(target + (view.left - edges.left));
    else if (edges.right > view.right) glideTo(target - (edges.right - view.right));
  }

  const bringIntoView = (item) => reveal(edgesOf(item));

  // Touch taps centre the tile instead, so the nav arrows (always shown on touch screens)
  // don't cover it. No cursor to keep the tile under, so moving it further is fine.
  function centerInView(item) {
    const view = carousel.getBoundingClientRect();
    const e = edgesOf(item);
    const shift = view.left + view.width / 2 - (e.left + e.right) / 2;
    if (Math.abs(shift) > 0.5) glideTo((glide ? glide.to : pos) + shift);
  }

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

  // Touch bookkeeping, so leftovers of a tap don't act as a second action (see the arrows
  // and mouse hover below)
  let lastTouchTime = -Infinity;
  let lastTouchTarget = null;
  const recentTouch = () => performance.now() - lastTouchTime < 1000;
  carousel.addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType === "mouse") return;
      lastTouchTime = performance.now();
      lastTouchTarget = e.target;
    },
    true
  );

  function addArrow(side) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `arrow arrow-${side}`;
    btn.setAttribute("aria-label", side === "left" ? "Previous" : "Next");
    btn.innerHTML =
      side === "left"
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
    btn.addEventListener("click", () => {
      // Phones can move a tap on a nearby tile onto this button ("touch adjustment"); only
      // count it if the touch started here. Keyboard and mouse clicks always count.
      if (recentTouch() && !btn.contains(lastTouchTarget)) return;
      revealNext(side);
    });
    carousel.appendChild(btn);
  }
  addArrow("left");
  addArrow("right");

  // Playable items: the Play button plays; with a mouse, clicking anywhere on the item does too.
  // Otherwise a tap toggles the item's overlay (touch screens) and pauses while one is open.
  carousel.addEventListener("click", (e) => {
    if (swiped) return; // the end of a drag, not a tap
    const item = e.target.closest(".item");
    if (!item) return;
    const onPlay = e.target.closest(".play");
    if (item.dataset.soundcloud && (onPlay || canHover.matches)) {
      playTrack(item.dataset.soundcloud);
      return;
    }
    if (item.dataset.link && (onPlay || canHover.matches)) {
      if (!onPlay) window.open(item.dataset.link, "_blank", "noopener"); // the <a> opens itself
      return;
    }
    const wasActive = item.classList.contains("active");
    closeActiveItems();
    if (!wasActive) {
      item.classList.add("active");
      if (canHover.matches) bringIntoView(item);
      else centerInView(item);
    }
  });

  // Hover (mouse): after a shift, wait for the cursor to actually move before shifting again,
  // so items sliding under a still cursor don't chain-shift the carousel
  let lockedAt = null;
  carousel.addEventListener("pointermove", (e) => {
    if (lockedAt && (e.clientX !== lockedAt.x || e.clientY !== lockedAt.y)) lockedAt = null;
  });
  carousel.addEventListener("pointerover", (e) => {
    // recentTouch: some phones send imitation mouse events after a tap; that's not a hover
    if (e.pointerType !== "mouse" || glide || lockedAt || recentTouch()) return;
    const item = e.target.closest(".item");
    if (!item || item.contains(e.relatedTarget)) return;
    bringIntoView(item);
    if (glide) lockedAt = { x: e.clientX, y: e.clientY };
  });

  // Touch: a horizontal drag moves the carousel with the finger, and letting go flings it
  // with momentum that fades out before the normal slow scroll resumes. A touch that
  // barely moves is a tap: the tile is brought into view as the finger lifts (phones don't
  // always send a click; iOS can treat a first tap as a hover). Vertical swipes are left to
  // the page (touch-action: pan-y in the CSS) and end in pointercancel.
  const DRAG_THRESHOLD = 8; // px of movement before a touch counts as a drag, not a tap
  let drag = null; // { id, startX, startPos, lastX, lastT, moved }
  let velocity = 0; // px per second of fling momentum
  let swiped = false; // swallow the click that can follow a drag

  carousel.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" || e.target.closest(".arrow, .play")) return;
    glide = null;
    velocity = 0;
    drag = { id: e.pointerId, startX: e.clientX, startPos: pos, lastX: e.clientX, lastT: e.timeStamp, moved: false };
  });

  carousel.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) < DRAG_THRESHOLD) return;
    if (!drag.moved) {
      drag.moved = true;
      try {
        carousel.setPointerCapture(e.pointerId); // keep receiving moves if the finger leaves the carousel
      } catch {
        /* not essential */
      }
      closeActiveItems();
    }
    const dt = (e.timeStamp - drag.lastT) / 1000;
    if (dt > 0) velocity = 0.8 * ((e.clientX - drag.lastX) / dt) + 0.2 * velocity; // smoothed
    drag.lastX = e.clientX;
    drag.lastT = e.timeStamp;
    pos = wrap(drag.startPos + dx);
  });

  carousel.addEventListener("pointerup", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const wasDrag = drag.moved;
    // A finger that stopped before lifting shouldn't fling
    if (wasDrag && e.timeStamp - drag.lastT > 80) velocity = 0;
    drag = null;
    if (wasDrag) {
      swiped = true;
      setTimeout(() => (swiped = false), 0);
      return;
    }
    velocity = 0;
    const item = e.target.closest(".item");
    if (item) centerInView(item);
  });

  carousel.addEventListener("pointercancel", () => {
    drag = null;
    velocity = 0;
  });

  // Only a real mouse pauses the scroll on hover (phones fire fake mouseenters after a tap)
  carousel.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse" && !recentTouch()) hovered = true;
  });
  carousel.addEventListener("pointerleave", (e) => {
    if (e.pointerType !== "mouse") return;
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
    } else if (drag) {
      // the finger is moving the carousel (pointermove sets pos)
    } else if (Math.abs(velocity) > 20) {
      pos = wrap(pos + velocity * dt);
      velocity *= Math.exp(-3 * dt); // friction: loses ~95% of its speed per second
    } else {
      velocity = 0;
      if (!hovered && !track.querySelector(".item.active")) pos += direction * speed * dt;
      pos = wrap(pos);
    }
    track.style.transform = `translateX(${wrap(pos)}px)`;
    requestAnimationFrame(frame);
  }

  // The track holds whole copies ("sets") of the originals: enough sets to cover the
  // window, then the same number again so the loop never shows a gap. Resizing (or
  // zooming) only adds or removes sets at the end; existing items and their videos
  // are kept, so nothing restarts or fades in again.
  let sets = 1;
  function startVideos(root) {
    if (videosStarted) root.querySelectorAll("video").forEach(startVideo);
  }

  function layout() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const unit = originals.reduce((w, el) => w + el.getBoundingClientRect().width + gap, 0);
    const needed = 2 * Math.max(1, Math.ceil(window.innerWidth / unit));
    for (; sets < needed; sets++) {
      originals.forEach((el) => {
        const copy = el.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        if (initialized) copy.style.animation = "none"; // only the first load fades items in
        track.appendChild(copy);
        startVideos(copy);
      });
    }
    for (; sets > needed; sets--) {
      for (let i = 0; i < originals.length; i++) track.lastElementChild.remove();
    }
    setWidth = unit * (sets / 2);
    pos = wrap(pos);
  }

  let initialized = false;
  track.replaceChildren(...originals);
  startVideos(track);
  layout();
  initialized = true;
  requestAnimationFrame(frame);

  // media_url items: swap the resolved media into the item and every copy of it
  entries.forEach((entry, i) => {
    entry.later?.then((el) => {
      if (!el) return;
      Object.assign(el.dataset, entry.media.dataset);
      if (el.tagName === "IMG") el.alt = el.dataset.title || "";
      track.querySelectorAll(`.item[data-key="${i}"]`).forEach((item) => {
        const media = item === originals[i] ? el : el.cloneNode(true);
        item.firstElementChild.replaceWith(media);
        startVideos(item);
      });
    });
  });
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 200);
  });
}

// One section per list in CAROUSELS, in the order they're written, placed above Contact.
// The list name becomes the heading ("sound_design" → "SOUND DESIGN") and the folder name.
// Scroll direction alternates: first right-to-left, second left-to-right, and so on.
const CAROUSEL_SPEED = 28; // px per second
const contactSection = document.querySelector(".contact-section");

const carouselsReady = Object.keys(CAROUSELS).map((name, i) => {
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
  return setupCarousel(carousel);
});

// Videos download last, after every carousel (and its posters and images) is on screen
Promise.all(carouselsReady).then(startAllVideos);

// Fade-in: every direct child of the header and each section fades in on load,
// staggered top to bottom, whether or not it's on screen yet.
const revealGap = 180; // ms between consecutive fade-ins
const revealEls = [...document.querySelectorAll("header > *, section > *")];
revealEls.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = `${i * revealGap}ms`;
});

// Force a style flush so the hidden state applies before the transition starts
document.body.offsetHeight;
revealEls.forEach((el, i) => {
  el.classList.add("revealed");
  // Once faded in, hand the element back to its own styles (e.g. hover transitions)
  setTimeout(() => {
    el.classList.remove("reveal", "revealed");
    el.style.transitionDelay = "";
  }, i * revealGap + 800);
});

// Contact: address is assembled at click time so it never appears in the page source.
const parts = ["moc.kooltuo", "nirreptpkcin"];
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
