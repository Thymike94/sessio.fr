function $(sel){ return document.querySelector(sel); }

const PLAY_URL = "https://play.google.com/store/apps/details?id=com.tymike94.sessio&pcampaignid=web_share";

const SHOTS = [
  { src: "./assets/shots/shot-records.png", alt: "Suivez vos PR",           cap: "Suivez vos PR." },
  { src: "./assets/shots/shot-analyse.png", alt: "Analysez vos séances",    cap: "Analysez vos séances." },
  { src: "./assets/shots/shot-log.png",     alt: "Enregistrez vos séances", cap: "Enregistrez vos séances." },
  { src: "./assets/shots/shot-train.png",   alt: "Entraînez vous",          cap: "Entraînez vous." },
];

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
   Hero shots render (4 images)
--------------------------- */
function renderHeroShots(){
  const wrap = $("#heroShots");
  if (!wrap) return;

  wrap.innerHTML = "";
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

  // Open from hero grid
  document.addEventListener("click", (e) => {
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

  // Swipe (mobile)
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
setupLightbox();
