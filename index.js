function $(sel){ return document.querySelector(sel); }

function setYear(){
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function shotsCarousel(){
  const shots = $("#shots");
  const prev = $("#prevShot");
  const next = $("#nextShot");
  if (!shots || !prev || !next) return;

  function scrollByOne(dir){
    const first = shots.querySelector(".shot");
    if (!first) return;
    const gap = 12;
    const w = first.getBoundingClientRect().width + gap;
    shots.scrollBy({ left: dir * w, behavior: "smooth" });
  }

  prev.addEventListener("click", () => scrollByOne(-1));
  next.addEventListener("click", () => scrollByOne(1));
}

function lightbox(){
  const lb = $("#lightbox");
  const lbImg = $("#lightboxImg");
  const lbLabel = $("#lightboxLabel");
  const btnClose = $("#lbClose");
  const btnPrev = $("#lbPrev");
  const btnNext = $("#lbNext");

  const imgs = Array.from(document.querySelectorAll('[data-shot="1"]'));
  if (!lb || !lbImg || !lbLabel || !btnClose || !btnPrev || !btnNext || imgs.length === 0) return;

  let idx = 0;

  function openAt(i){
    idx = Math.max(0, Math.min(i, imgs.length - 1));
    const src = imgs[idx].getAttribute("src");
    const alt = imgs[idx].getAttribute("alt") || "Capture Sessio";
    lbImg.src = src;
    lbImg.alt = alt;
    lbLabel.textContent = `${alt} • ${idx + 1}/${imgs.length}`;
    lb.classList.add("show");
    lb.setAttribute("aria-hidden", "false");
  }

  function close(){
    lb.classList.remove("show");
    lb.setAttribute("aria-hidden", "true");
  }

  imgs.forEach((im, i) => im.addEventListener("click", () => openAt(i)));

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => openAt(idx - 1));
  btnNext.addEventListener("click", () => openAt(idx + 1));

  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("show")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") openAt(idx - 1);
    if (e.key === "ArrowRight") openAt(idx + 1);
  });

  // Swipe left/right on the image (mobile)
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
shotsCarousel();
lightbox();
