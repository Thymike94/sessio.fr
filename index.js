function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

const LB_ORDER = [
  { src: "./assets/shots/dashboard1.jpg", label: "Dashboard — démarrer une séance" },
  { src: "./assets/shots/dashboard2.jpg", label: "Dashboard — objectifs & outils" },
  { src: "./assets/shots/historyscreen.jpg", label: "Historique — calendrier" },
  { src: "./assets/shots/completedseance2.jpg", label: "Séance terminée — résumé" },
  { src: "./assets/shots/centreperf1.jpg", label: "Centre de performance — focus musculaire" },
  { src: "./assets/shots/centreperf2.jpg", label: "Centre de performance — bilan" },
  { src: "./assets/shots/dashboard3.jpg", label: "Fil d’actualité" },
  { src: "./assets/shots/profil.jpg", label: "Profil utilisateur" },
  { src: "./assets/shots/records.jpg", label: "Records — favoris" },
  { src: "./assets/shots/completedseance1.jpg", label: "Séance terminée — muscles travaillés" },
];

function setYear(){
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

/* Mobile menu */
function setupMenu(){
  const btn = $("#menuBtn");
  const nav = $("#nav");
  if (!btn || !nav) return;

  function close(){
    nav.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  $all(".nav__link").forEach((a) => {
    a.addEventListener("click", close);
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("open")) return;
    if (e.target === btn || btn.contains(e.target)) return;
    if (e.target === nav || nav.contains(e.target)) return;
    close();
  });
}

/* Smooth scroll */
function setupSmoothScroll(){
  $all('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });
}

/* Lightbox */
function setupLightbox(){
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbLabel = $("#lbLabel");
  const closeBtn = $("#lbClose");
  const prevBtn = $("#lbPrev");
  const nextBtn = $("#lbNext");
  if (!lb || !lbImg || !lbLabel || !closeBtn || !prevBtn || !nextBtn) return;

  const shotButtons = $all(".shot[data-lb]");
  if (shotButtons.length === 0) return;

  function indexOfSrc(src){
    const i = LB_ORDER.findIndex((x) => x.src === src);
    return i >= 0 ? i : 0;
  }

  let idx = 0;

  function openAt(i){
    idx = Math.max(0, Math.min(i, LB_ORDER.length - 1));
    lbImg.src = LB_ORDER[idx].src;
    lbImg.alt = LB_ORDER[idx].label;
    lbLabel.textContent = `${LB_ORDER[idx].label} • ${idx + 1}/${LB_ORDER.length}`;
    lb.classList.add("show");
    lb.setAttribute("aria-hidden", "false");
  }

  function close(){
    lb.classList.remove("show");
    lb.setAttribute("aria-hidden", "true");
  }

  shotButtons.forEach((b) => {
    b.addEventListener("click", () => {
      const src = b.getAttribute("data-lb") || "";
      idx = indexOfSrc(src);
      openAt(idx);
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

setYear();
setupMenu();
setupSmoothScroll();
setupLightbox();