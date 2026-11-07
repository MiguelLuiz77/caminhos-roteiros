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

const galleryDialog = document.querySelector("#vale-gallery");
if (galleryDialog) {
  const galleryThumbnails = [...galleryDialog.querySelectorAll(".gallery-thumbnail")];
  const galleryImage = galleryDialog.querySelector(".gallery-main-image");
  const galleryCity = galleryDialog.querySelector(".gallery-city");
  const galleryCounter = galleryDialog.querySelector(".gallery-counter");
  const galleryLauncher = document.querySelector(".gallery-launcher");
  let activeGalleryIndex = 0;

  function showGalleryPhoto(index) {
    activeGalleryIndex = (index + galleryThumbnails.length) % galleryThumbnails.length;
    const selected = galleryThumbnails[activeGalleryIndex];
    galleryImage.src = selected.dataset.src;
    galleryImage.alt = selected.dataset.alt;
    galleryCity.textContent = selected.dataset.city;
    galleryCounter.textContent = `${activeGalleryIndex + 1} de ${galleryThumbnails.length}`;
    galleryThumbnails.forEach((thumbnail, thumbnailIndex) => {
      const isSelected = thumbnailIndex === activeGalleryIndex;
      thumbnail.classList.toggle("is-selected", isSelected);
      thumbnail.setAttribute("aria-pressed", String(isSelected));
    });
  }

  galleryLauncher?.addEventListener("click", () => {
    showGalleryPhoto(activeGalleryIndex);
    if (typeof galleryDialog.showModal === "function") galleryDialog.showModal();
    else galleryDialog.setAttribute("open", "");
  });
  galleryDialog.querySelector(".gallery-close")?.addEventListener("click", () => galleryDialog.close());
  galleryDialog.querySelector(".gallery-previous")?.addEventListener("click", () => showGalleryPhoto(activeGalleryIndex - 1));
  galleryDialog.querySelector(".gallery-next")?.addEventListener("click", () => showGalleryPhoto(activeGalleryIndex + 1));
  galleryThumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => showGalleryPhoto(index));
  });
  galleryDialog.addEventListener("click", (event) => {
    if (event.target === galleryDialog) galleryDialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (!galleryDialog.open) return;
    if (event.key === "ArrowLeft") showGalleryPhoto(activeGalleryIndex - 1);
    if (event.key === "ArrowRight") showGalleryPhoto(activeGalleryIndex + 1);
  });
}

const serraGalleryDialog = document.querySelector("#serra-gallery");
if (serraGalleryDialog) {
  const serraThumbnails = [...serraGalleryDialog.querySelectorAll(".gallery-thumbnail")];
  const serraImage = serraGalleryDialog.querySelector(".gallery-main-image");
  const serraCity = serraGalleryDialog.querySelector(".gallery-city");
  const serraCounter = serraGalleryDialog.querySelector(".gallery-counter");
  const serraLauncher = document.querySelector(".serra-gallery-launcher");
  let activeSerraIndex = 0;

  function showSerraPhoto(index) {
    activeSerraIndex = (index + serraThumbnails.length) % serraThumbnails.length;
    const selected = serraThumbnails[activeSerraIndex];
    serraImage.src = selected.dataset.src;
    serraImage.alt = selected.dataset.alt;
    serraCity.textContent = selected.dataset.city;
    serraCounter.textContent = `${activeSerraIndex + 1} de ${serraThumbnails.length}`;
    serraThumbnails.forEach((thumbnail, thumbnailIndex) => {
      const isSelected = thumbnailIndex === activeSerraIndex;
      thumbnail.classList.toggle("is-selected", isSelected);
      thumbnail.setAttribute("aria-pressed", String(isSelected));
    });
  }

  serraLauncher?.addEventListener("click", () => {
    showSerraPhoto(activeSerraIndex);
    if (typeof serraGalleryDialog.showModal === "function") serraGalleryDialog.showModal();
    else serraGalleryDialog.setAttribute("open", "");
  });
  serraGalleryDialog.querySelector(".gallery-close")?.addEventListener("click", () => serraGalleryDialog.close());
  serraGalleryDialog.querySelector(".gallery-previous")?.addEventListener("click", () => showSerraPhoto(activeSerraIndex - 1));
  serraGalleryDialog.querySelector(".gallery-next")?.addEventListener("click", () => showSerraPhoto(activeSerraIndex + 1));
  serraThumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => showSerraPhoto(index));
  });
  serraGalleryDialog.addEventListener("click", (event) => {
    if (event.target === serraGalleryDialog) serraGalleryDialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (!serraGalleryDialog.open) return;
    if (event.key === "ArrowLeft") showSerraPhoto(activeSerraIndex - 1);
    if (event.key === "ArrowRight") showSerraPhoto(activeSerraIndex + 1);
  });
}

const litoralGalleryDialog = document.querySelector("#litoral-gallery");
if (litoralGalleryDialog) {
  const litoralThumbnails = [...litoralGalleryDialog.querySelectorAll(".gallery-thumbnail")];
  const litoralImage = litoralGalleryDialog.querySelector(".gallery-main-image");
  const litoralCity = litoralGalleryDialog.querySelector(".gallery-city");
  const litoralCounter = litoralGalleryDialog.querySelector(".gallery-counter");
  const litoralLauncher = document.querySelector(".litoral-gallery-launcher");
  let activeLitoralIndex = 0;

  function showLitoralPhoto(index) {
    activeLitoralIndex = (index + litoralThumbnails.length) % litoralThumbnails.length;
    const selected = litoralThumbnails[activeLitoralIndex];
    litoralImage.src = selected.dataset.src;
    litoralImage.alt = selected.dataset.alt;
    litoralCity.textContent = selected.dataset.city;
    litoralCounter.textContent = `${activeLitoralIndex + 1} de ${litoralThumbnails.length}`;
    litoralThumbnails.forEach((thumbnail, thumbnailIndex) => {
      const isSelected = thumbnailIndex === activeLitoralIndex;
      thumbnail.classList.toggle("is-selected", isSelected);
      thumbnail.setAttribute("aria-pressed", String(isSelected));
    });
  }

  litoralLauncher?.addEventListener("click", () => {
    showLitoralPhoto(activeLitoralIndex);
    if (typeof litoralGalleryDialog.showModal === "function") litoralGalleryDialog.showModal();
    else litoralGalleryDialog.setAttribute("open", "");
  });
  litoralGalleryDialog.querySelector(".gallery-close")?.addEventListener("click", () => litoralGalleryDialog.close());
  litoralGalleryDialog.querySelector(".gallery-previous")?.addEventListener("click", () => showLitoralPhoto(activeLitoralIndex - 1));
  litoralGalleryDialog.querySelector(".gallery-next")?.addEventListener("click", () => showLitoralPhoto(activeLitoralIndex + 1));
  litoralThumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => showLitoralPhoto(index));
  });
  litoralGalleryDialog.addEventListener("click", (event) => {
    if (event.target === litoralGalleryDialog) litoralGalleryDialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (!litoralGalleryDialog.open) return;
    if (event.key === "ArrowLeft") showLitoralPhoto(activeLitoralIndex - 1);
    if (event.key === "ArrowRight") showLitoralPhoto(activeLitoralIndex + 1);
  });
}
