const $ = (sel) => document.querySelector(sel);

function toast(msg) {
  const t = $("#toast");
  const tt = $("#toastText");
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
  $("#year").textContent = String(y);
}

function mobileNav() {
  const burger = $("#navBurger");
  const panel = $("#navMobile");
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

function notifyForm() {
  const form = $("#notifyForm");
  const msg = $("#formMsg");

  // Stockage local (no backend) : pratique pour commencer.
  // Quand tu veux, je te branche Firebase (Firestore/Functions) + reCAPTCHA.
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#email").value.trim().toLowerCase();
    if (!email) return;

    const key = "sessio_waitlist";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    if (!list.includes(email)) list.push(email);
    localStorage.setItem(key, JSON.stringify(list));

    msg.textContent = "✅ C’est noté ! Tu es sur la liste.";
    toast("Inscription enregistrée ✅");
    form.reset();
  });
}

function bindFakeDownload() {
  const btn = $("#btnPrimaryDownload");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toast("Bêta bientôt — laisse ton email 👇");
    document.location.hash = "#notify";
  });

  $("#btnDownloadTop").addEventListener("click", (e) => {
    e.preventDefault();
    toast("Bêta bientôt — laisse ton email 👇");
    document.location.hash = "#notify";
  });

  $("#btnNotifyTop").addEventListener("click", () => {
    toast("Dis-moi juste ton email 👇");
  });
}

function setGithubLink() {
  const btn = $("#btnGithub");
  // Mets ici ton repo plus tard, ex: https://github.com/tonuser/sessio
  // Pour l'instant ça pointe vers github.com
  btn.href = btn.dataset.github || "https://github.com/";
}

setYear();
mobileNav();
notifyForm();
bindFakeDownload();
setGithubLink();
