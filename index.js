function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

const PLAY_URL = "https://play.google.com/store/apps/details?id=com.tymike94.sessio&pcampaignid=web_share";

const SHOTS = [
  { src: "./assets/shots/shot-log.png",     alt: "Enregistrez vos séances", cap: "Enregistrez vos séances." },
  { src: "./assets/shots/shot-train.png",   alt: "Entraînez vous",          cap: "Entraînez-vous (repos, séries, chrono)." },
  { src: "./assets/shots/shot-records.png", alt: "Suivez vos PR",           cap: "Suivez vos PR." },
  { src: "./assets/shots/shot-analyse.png", alt: "Analysez vos séances",    cap: "Analysez vos séances." },
];

function isDesktop(){
  return window.matchMedia("(min-width: 980px)").matches;
}

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

/* ---------------------------
   Bind Play links everywhere
--------------------------- */
function bindPlayLinks(){
  const ids = ["#topCta", "#heroCta", "#inlineCta", "#finalCta", "#footerCta", "#floatingCta"];
  ids.forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.href = PLAY_URL;
  });
}

/* ---------------------------
   Hero shots render (priorité aux images)
--------------------------- */
function renderHeroShots(){
  const wrap = $("#heroShots");
  if (!wrap) return;

  wrap.innerHTML = "";
  // On met 4 images en grille 2x2
  SHOTS.forEach((s, i) => {
    const box = document.createElement("div");
    box.className = "heroShot";
    box.dataset.open = String(i);

    const img = document.createElement("img");
    img.src = s.src;
    img.alt = s.alt;
    img.loading = i < 2 ? "eager" : "lazy";
    img.decoding = "async";

    box.appendChild(img);
    wrap.appendChild(box);
  });
}

/* ---------------------------
   Gallery render
--------------------------- */
function renderGallery(){
  const carousel = $("#carousel");
  if (!carousel) return;

  carousel.innerHTML = "";
  SHOTS.forEach((s, i) => {
    const fig = document.createElement("figure");
    fig.className = "shot";
    fig.dataset.index = String(i);

    const img = document.createElement("img");
    img.src = s.src;
    img.alt = s.alt;
    img.loading = i < 2 ? "eager" : "lazy";
    img.decoding = "async";

    const cap = document.createElement("figcaption");
    cap.textContent = s.cap;

    fig.appendChild(img);
    fig.appendChild(cap);
    carousel.appendChild(fig);
  });
}

/* ---------------------------
   Dots
--------------------------- */
function buildDots(){
  const dots = $("#dots");
  if (!dots) return;
  dots.innerHTML = "";

  for (let i = 0; i < SHOTS.length; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dot";
    b.setAttribute("aria-label", `Aller à la capture ${i + 1}`);
    b.addEventListener("click", () => scrollToIndex(i));
    dots.appendChild(b);
  }
}

function setActiveDot(idx){
  const dots = $all("#dots .dot");
  dots.forEach((d, i) => d.classList.toggle("active", i === idx));
}

function scrollToIndex(idx){
  const carousel = $("#carousel");
  if (!carousel) return;
  if (isDesktop()) return;

  const target = carousel.querySelector(`.shot[data-index="${idx}"]`);
  if (!target) return;

  carousel.scrollTo({ left: target.offsetLeft - 2, behavior: "smooth" });
  setActiveDot(idx);
}

function activeIndex(){
  const carousel = $("#carousel");
  if (!carousel) return 0;
  if (isDesktop()) return 0;

  const items = $all("#carousel .shot");
  const left = carousel.scrollLeft;

  let best = 0;
  let bestDist = Infinity;
  for (const el of items) {
    const d = Math.abs(el.offsetLeft - left);
    const i = Number(el.dataset.index || "0");
    if (d < bestDist) { bestDist = d; best = i; }
  }
  return best;
}

/* ---------------------------
   Carousel controls
--------------------------- */
function setupCarousel(){
  const carousel = $("#carousel");
  const prev = $("#prev");
  const next = $("#next");
  if (!carousel || !prev || !next) return;

  buildDots();
  setActiveDot(0);

  prev.addEventListener("click", () => {
    const i = activeIndex();
    scrollToIndex(clamp(i - 1, 0, SHOTS.length - 1));
  });

  next.addEventListener("click", () => {
    const i = activeIndex();
    scrollToIndex(clamp(i + 1, 0, SHOTS.length - 1));
  });

  let t = null;
  carousel.addEventListener("scroll", () => {
    if (isDesktop()) return;
    window.clearTimeout(t);
    t = window.setTimeout(() => {
      setActiveDot(activeIndex());
    }, 80);
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (!isDesktop()) setActiveDot(activeIndex());
  });
}

/* ---------------------------
   Lightbox
--------------------------- */
function setupLightbox(){
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbLabel = $("#lbLabel");
  const closeBtn = $("#lbClose");
  const prevBtn = $("#lbPrev");
  const nextBtn = $("#lbNext");

  if (!lb || !lbImg || !lbLabel || !closeBtn || !prevBtn || !nextBtn) return;

  let idx = 0;

  function openAt(i){
    idx = clamp(i, 0, SHOTS.length - 1);
    lbImg.src = SHOTS[idx].src;
    lbImg.alt = SHOTS[idx].alt;
    lbLabel.textContent = `${SHOTS[idx].alt} • ${idx + 1}/${SHOTS.length}`;
    lb.classList.add("show");
    lb.setAttribute("aria-hidden", "false");
  }

  function close(){
    lb.classList.remove("show");
    lb.setAttribute("aria-hidden", "true");
  }

  // Open from gallery shots
  document.addEventListener("click", (e) => {
    const shot = e.target && e.target.closest ? e.target.closest(".shot") : null;
    if (shot && shot.dataset && shot.dataset.index != null) {
      const i = Number(shot.dataset.index || "0");
      openAt(i);
      return;
    }

    // Open from hero grid
    const hero = e.target && e.target.closest ? e.target.closest(".heroShot") : null;
    if (hero && hero.dataset && hero.dataset.open != null) {
      const i = Number(hero.dataset.open || "0");
      openAt(i);
    }
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => openAt(idx - 1));
  nextBtn.addEventListener("click", () => openAt(idx + 1));

  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("show")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") openAt(idx - 1);
    if (e.key === "ArrowRight") openAt(idx + 1);
  });

  // Swipe
  let startX = null;
  lbImg.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  lbImg.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    startX = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) openAt(idx + 1);
    else openAt(idx - 1);
  }, { passive: true });
}

/* ---------------------------
   Init
--------------------------- */
bindPlayLinks();
renderHeroShots();
renderGallery();
setupCarousel();
setupLightbox();
