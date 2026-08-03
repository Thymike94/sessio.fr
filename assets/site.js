(() => {
  const root = document.documentElement;
  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  root.classList.add(isIOS ? "platform-ios" : isAndroid ? "platform-android" : "platform-desktop");

  const header = document.querySelector(".site-header");
  const menu = document.querySelector(".nav");
  const menuButton = document.querySelector(".menu-btn");
  const sticky = document.querySelector(".sticky-download");
  const stickyClose = document.querySelector(".sticky-close");

  const onScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 8);
    if (sticky && sessionStorage.getItem("sessio_sticky_closed") !== "1") {
      sticky.classList.toggle("visible", window.scrollY > 520);
    }
  };
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  menuButton?.addEventListener("click", () => {
    const open = menu?.classList.toggle("open");
    document.body.classList.toggle("menu-open", !!open);
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
  });

  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    menu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));

  stickyClose?.addEventListener("click", () => {
    sessionStorage.setItem("sessio_sticky_closed", "1");
    sticky?.classList.remove("visible");
  });

  const platform = isIOS ? "ios" : isAndroid ? "android" : "desktop";
  const params = new URLSearchParams(location.search);
  const utm = Object.fromEntries([...params.entries()].filter(([key]) => key.startsWith("utm_")));

  const track = (name, details = {}) => {
    const payload = {
      event: name,
      page: location.pathname,
      platform,
      ...utm,
      ...details,
    };
    window.dispatchEvent(new CustomEvent("sessio:analytics", { detail: payload }));
    if (window.SESSIO_ANALYTICS?.enabled && typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }
  };

  document.querySelectorAll("[data-track]").forEach((el) => {
    el.addEventListener("click", () => track(el.dataset.track, { location: el.dataset.location || "unknown" }));
  });

  let tracked50 = false;
  let tracked90 = false;
  addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max <= 0) return;
    const ratio = scrollY / max;
    if (!tracked50 && ratio >= .5) { tracked50 = true; track("scroll_50"); }
    if (!tracked90 && ratio >= .9) { tracked90 = true; track("scroll_90"); }
  }, { passive: true });

  const finalCta = document.querySelector("[data-final-cta]");
  if (finalCta && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          track("view_final_cta");
          observer.disconnect();
        }
      });
    }, { threshold: .4 });
    observer.observe(finalCta);
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
