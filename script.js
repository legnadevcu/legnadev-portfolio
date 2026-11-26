const STORAGE_KEY = "theme";
const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");
const toggleLabel = document.querySelector("[data-theme-label]");
const yearSlot = document.querySelector("[data-year]");

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
    /* storage unavailable: theme still applies for this visit */
  }
}

toggle?.addEventListener("click", () => {
  setTheme(isDark() ? "light" : "dark");
});

if (yearSlot) {
  yearSlot.textContent = String(new Date().getFullYear());
}

applyTheme(isDark() ? "dark" : "light");
