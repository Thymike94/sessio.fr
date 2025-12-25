const $ = (sel) => document.querySelector(sel);

function toast(msg) {
  const t = $("#toast");
  const tt = $("#toastText");
  if (!t || !tt) return;

  tt.textContent = msg;
  t.classList.add("show");
  t.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    t.classList.remove("show");
    t.setAttribute("aria-hidden", "true");
  }, 2600);
}

function setYear() {
  const y = new Date().getFullYear();
  const el = $("#year");
  if (el) el.textContent = String(y);
}

function mobileNav() {
  const burger = $("#navBurger");
  const panel = $("#navMobile");
  if (!burger || !panel) return;

  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", expanded ? "false" : "true");
    panel.style.display = expanded ? "none" : "block";
    panel.setAttribute("aria-hidden", expanded ? "true" : "false");
  });

  document.querySelectorAll(".mLink").forEach((a) => {
    a.addEventListener("click", () => {
      burger.setAttribute("aria-expanded", "false");
      panel.style.display = "none";
      panel.setAttribute("aria-hidden", "true");
    });
  });
}

function shotsCarousel() {
  const track = $("#shotsTrack");
  const prev = $("#shotPrev");
  const next = $("#shotNext");
  const dotsWrap = $("#shotsDots");

  if (!track || !prev || !next || !dotsWrap) return;

  const shots = Array.from(track.querySelectorAll(".shotImg"));
  if (shots.length === 0) return;

  let idx = 0;

  // dots
  dotsWrap.innerHTML = "";
  shots.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function updateDots() {
    const dots = dotsWrap.querySelectorAll(".dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
  }

  function goTo(i) {
    idx = Math.max(0, Math.min(i, shots.length - 1));
    const gap = 12;
    const itemW = shots[0].getBoundingClientRect().width;
    const offset = (itemW + gap) * idx;
    track.style.transform = `translateX(${-offset}px)`;
    updateDots();
  }

  prev.addEventListener("click", () => goTo(idx - 1));
  next.addEventListener("click", () => goTo(idx + 1));

  // swipe
  let startX = null;
  track.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  track.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    startX = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goTo(idx + 1);
    else goTo(idx - 1);
  });

  goTo(0);
  window.addEventListener("resize", () => goTo(idx));
}

function validateDownloadLink() {
  const btn = $("#btnDownloadAndroid");
  if (!btn) return;

  if (!btn.href || btn.href.includes("DRIVE_DIRECT_APK_URL")) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toast("Ajoute le lien Google Drive de l’APK dans index.html 🔧");
    });
  } else {
    btn.addEventListener("click", () => toast("Téléchargement Android…"));
  }
}

setYear();
mobileNav();
shotsCarousel();
validateDownloadLink();
