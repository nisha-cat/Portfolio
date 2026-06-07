const nav = document.querySelector(".site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".site-nav a");
const footer = document.querySelector("footer");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

const setTheme = (theme) => {
  const isDark = theme === "dark";
  if (isDark) {
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    root.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  }
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
};

setTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  setTheme(isDark ? "light" : "dark");
});

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const animateCount = (element) => {
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";
  const decimals = Number(element.dataset.decimals || 0);
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    const value = target * eased;
    element.textContent =
      decimals > 0
        ? `${value.toFixed(decimals)}${suffix}`
        : `${Math.round(value)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const target = entry.target;
      target.classList.add("visible");
      observer.unobserve(target);

      target.querySelectorAll("[data-count]").forEach((counter) => {
        if (!counter.dataset.animated) {
          counter.dataset.animated = "true";
          animateCount(counter);
        }
      });

      target.querySelectorAll(".mini-bars").forEach((bars) => {
        bars.classList.add("animate");
      });

      target.querySelectorAll(".tag-list").forEach((tags) => {
        tags.classList.add("animate");
      });
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item) => {
  observer.observe(item);
});

const footerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        footer.classList.add("visible");
        footerObserver.unobserve(footer);
      }
    });
  },
  { threshold: 0.5 }
);

footerObserver.observe(footer);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.35, rootMargin: "-20% 0px -55% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const initPage = () => {
  if (prefersReducedMotion) {
    document.body.classList.add("loaded");
    revealItems.forEach((item) => item.classList.add("visible"));
    footer.classList.add("visible");
    document.querySelectorAll(".mini-bars").forEach((bars) => bars.classList.add("animate"));
    document.querySelectorAll(".tag-list").forEach((tags) => tags.classList.add("animate"));
    return;
  }

  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
    document.querySelectorAll(".hero-visual .mini-bars").forEach((bars) => {
      bars.classList.add("animate");
    });
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
