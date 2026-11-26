const STORAGE_KEY = "theme";

const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");
const toggleLabel = document.querySelector("[data-theme-label]");
const yearSlot = document.querySelector("[data-year]");
const ageSlots = document.querySelectorAll("[data-age]");
const birthYear = Number(document.body.dataset.birthYear);

const isDark = () => root.dataset.theme === "dark";

function applyTheme(theme) {
  root.dataset.theme = theme;

  if (toggle) {
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  if (toggleLabel) {
    toggleLabel.textContent = theme === "dark" ? "Modo claro" : "Modo oscuro";
  }
}

function setTheme(theme, { persist = true } = {}) {
  applyTheme(theme);

  if (!persist) return;

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    /* storage unavailable: the theme still applies for this visit */
  }
}

/**
 * Derives the current age from the birth year declared on <body>.
 * It runs on every page load, so the number stays correct as years pass
 * without touching the markup again.
 */
function renderAge() {
  if (!Number.isFinite(birthYear) || birthYear <= 0) return;

  const age = new Date().getFullYear() - birthYear;

  ageSlots.forEach((slot) => {
    slot.textContent = String(age);
  });
}

toggle?.addEventListener("click", () => {
  setTheme(isDark() ? "light" : "dark");
});

if (yearSlot) {
  yearSlot.textContent = String(new Date().getFullYear());
}

renderAge();
applyTheme(isDark() ? "dark" : "light");
