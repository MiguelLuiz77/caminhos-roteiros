"use strict";

document.documentElement.classList.add("js");

const WHATSAPP_BASE = "https://wa.me/5512991318893";
for (const link of document.querySelectorAll("[data-wa-message]")) {
  const message = link.dataset.waMessage || "Olá! Acessei o site da Caminhos & Roteiros e gostaria de planejar uma viagem.";
  link.href = `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  navigation.classList.remove("is-open");
  if (restoreFocus) menuButton.focus();
}

menuButton?.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
  navigation?.classList.toggle("is-open", willOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
    closeMenu({ restoreFocus: true });
  }
});

document.addEventListener("click", (event) => {
  if (menuButton?.getAttribute("aria-expanded") !== "true") return;
  if (!navigation?.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

const revealItems = document.querySelectorAll("[data-reveal]");
revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const currentLinks = new Map(
  [...document.querySelectorAll(".nav-link")].map((link) => [link.getAttribute("href").slice(1), link])
);
const observedSections = ["destinos", "pacotes", "tranquilidade", "contato"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    for (const link of currentLinks.values()) {
      link.classList.remove("is-current");
      link.removeAttribute("aria-current");
    }
    const active = currentLinks.get(visible.target.id);
    active?.classList.add("is-current");
    active?.setAttribute("aria-current", "location");
  }, { threshold: [0.2, 0.45], rootMargin: "-20% 0px -55% 0px" });
  observedSections.forEach((section) => sectionObserver.observe(section));
}
