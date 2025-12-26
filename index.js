function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

const SHOTS = [
  { src: "./assets/shots/dashboard1.jpg", alt: "Dashboard — démarrer une séance" },
  { src: "./assets/shots/dashboard2.jpg", alt: "Dashboard — objectifs & outils" },
  { src: "./assets/shots/centreperf1.jpg", alt: "Centre de performance — focus musculaire" },
  { src: "./assets/shots/centreperf2.jpg", alt: "Centre de performance — bilan" },
  { src: "./assets/shots/completedseance1.jpg", alt: "Séance terminée — muscles travaillés" },
  { src: "./assets/shots/completedseance2.jpg", alt: "Séance terminée — résumé" },
  { src: "./assets/shots/historyscreen.jpg", alt: "Historique — calendrier" },
  { src: "./assets/shots/records.jpg", alt: "Records — favoris" },
  { src: "./assets/shots/profil.jpg", alt: "Profil" },
  { src: "./assets/shots/dashboard3.jpg", alt: "Fil d’actualité" },
];

function isDesktop(){
  return window.matchMedia("(min-width: 980px)").matches;
}

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

function setupCarousel(){
  const carousel = $("#carousel");
  const prev = $("#prev");
  const next = $("#next");
  if (!carousel || !prev || !next) return;

  buildDots();
  setActiveDot(0);

  prev.addEventListener("click", () => {
    const i = activeIndex();
    scrollToIndex(Math.max(0, i - 1));
  });

  next.addEventListener("click", () => {
    const i = activeIndex();
    scrollToIndex(Math.min(SHOTS.length - 1, i + 1));
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

function setupLightbox(){
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbLabel = $("#lbLabel");
  const closeBtn = $("#lbClose");
  const prevBtn = $("#lbPrev");
  const nextBtn = $("#lbNext");

  const thumbs = $all("#carousel .shot");
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

setupCarousel();
setupLightbox();