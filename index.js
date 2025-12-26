function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

const SHOTS = [
  { src: "./assets/shots/dashboard1.jpg", alt: "Dashboard — démarrer une séance" },
  { src: "./assets/shots/dashboard2.jpg", alt: "Dashboard — objectifs & outils" },
  { src: "./assets/shots/centreperf1.jpg", alt: "Centre de performance — focus musculaire" },
  { src: "./assets/shots/centreperf2.jpg", alt: "Centre de performance — bilan" },
  { src: "./assets/shots/completedseance1.jpg", alt: "Séance terminée — muscles travaillés" },
  { src: "./assets/shots/completedseance2.jpg", alt: "Séance terminée — résumé de séance" },
  { src: "./assets/shots/historyscreen.jpg", alt: "Historique — calendrier" },
  { src: "./assets/shots/records.jpg", alt: "Records — favoris" },
  { src: "./assets/shots/profil.jpg", alt: "Profil" },
  { src: "./assets/shots/dashboard3.jpg", alt: "Fil d’actualité" },
];

function setYear(){
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function buildDots(){
  const dots = $("#dots");
  if (!dots) return;

  dots.innerHTML = "";
  for (let i = 0; i < SHOTS.length; i++) {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "dot";
    d.setAttribute("aria-label", `Aller à la capture ${i + 1}`);
    d.addEventListener("click", () => scrollToIndex(i));
    dots.appendChild(d);
  }
}

function setActiveDot(idx){
  const dots = $all("#dots .dot");
  dots.forEach((d, i) => d.classList.toggle("active", i === idx));
}

function galleryEl(){ return $("#gallery"); }

function isDesktop(){
  return window.matchMedia("(min-width: 980px)").matches;
}

function scrollToIndex(idx){
  const gallery = galleryEl();
  if (!gallery) return;

  // On n'utilise le scroll “par index” que sur mobile (carousel).
  if (isDesktop()) return;

  const target = gallery.querySelector(`.shot[data-index="${idx}"]`);
  if (!target) return;

  const left = target.offsetLeft - 2;
  gallery.scrollTo({ left, behavior: "smooth" });
  setActiveDot(idx);
}

function computeActiveIndex(){
  const gallery = galleryEl();
  if (!gallery) return 0;
  if (isDesktop()) return 0;

  const shots = $all(".shot");
  if (shots.length === 0) return 0;

  const scrollLeft = gallery.scrollLeft;
  let best = 0;
  let bestDist = Infinity;

  for (const el of shots) {
    const dist = Math.abs(el.offsetLeft - scrollLeft);
    if (dist < bestDist) {
      bestDist = dist;
      best = Number(el.dataset.index || "0");
    }
  }
  return best;
}

function setupCarouselNav(){
  const prev = $("#prev");
  const next = $("#next");
  const gallery = galleryEl();
  if (!prev || !next || !gallery) return;

  prev.addEventListener("click", () => {
    const idx = computeActiveIndex();
    scrollToIndex(Math.max(0, idx - 1));
  });

  next.addEventListener("click", () => {
    const idx = computeActiveIndex();
    scrollToIndex(Math.min(SHOTS.length - 1, idx + 1));
  });

  gallery.addEventListener("scroll", () => {
    if (isDesktop()) return;
    window.clearTimeout(setupCarouselNav._t);
    setupCarouselNav._t = window.setTimeout(() => {
      setActiveDot(computeActiveIndex());
    }, 80);
  }, { passive: true });
}

function setupLightbox(){
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbLabel = $("#lbLabel");
  const closeBtn = $("#lbClose");
  const prevBtn = $("#lbPrev");
  const nextBtn = $("#lbNext");

  const thumbs = $all(".shot");
  if (!lb || !lbImg || !lbLabel || !closeBtn || !prevBtn || !nextBtn || thumbs.length === 0) return;

  let idx = 0;

  function openAt(i){
    idx = Math.max(0, Math.min(i, SHOTS.length - 1));
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

  thumbs.forEach((t) => {
    t.addEventListener("click", () => {
      const i = Number(t.dataset.index || "0");
      openAt(i);
    });
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

  // swipe on image
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

function init(){
  setYear();
  buildDots();
  setActiveDot(0);
  setupCarouselNav();
  setupLightbox();

  window.addEventListener("resize", () => {
    if (!isDesktop()) setActiveDot(computeActiveIndex());
  });
}

init();
