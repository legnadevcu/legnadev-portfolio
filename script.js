const STORAGE_KEY = "theme";

const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");
const toggleLabel = document.querySelector("[data-theme-label]");
const yearSlot = document.querySelector("[data-year]");
const ageSlots = document.querySelectorAll("[data-age]");
const birthDate = document.body.dataset.birthDate;
const projectsRoot = document.querySelector("[data-projects]");
const contactForm = document.querySelector("[data-contact-form]");

/** Cuba country code (53) plus the number, digits only. */
const WHATSAPP_NUMBER = "5355335781";

/**
 * Project gallery data.
 *
 * To add a project, append one object to this array. `image` is optional: when
 * it is missing, the card renders a gradient with the project's initial.
 * Use a screenshot at 16:10 for the best result (for example 1280x800).
 */
const projects = [
  {
    title: "Portfolio personal",
    description:
      "Sitio de una sola página con modo claro/oscuro persistente, galería de proyectos y contacto directo por WhatsApp. Construido sin frameworks.",
    tech: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/legnadevcu/legnadev-portfolio",
    image: "",
  },

  // Copiá este bloque cuando termines un proyecto nuevo:
  // {
  //   title: "",
  //   description: "",
  //   tech: ["", ""],
  //   link: "",
  //   image: "",
  // },
];

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
 * Parses an ISO date (YYYY-MM-DD) as a local calendar date.
 *
 * `new Date("2006-03-02")` is read as UTC midnight, which in a negative
 * timezone becomes March 1st. Building the date from its parts keeps the
 * calendar day the same everywhere.
 */
function parseLocalDate(isoDate) {
  const parts = String(isoDate ?? "").split("-").map(Number);

  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part))) {
    return null;
  }

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);

  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateAge(birth) {
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();

  const hasHadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());

  return hasHadBirthday ? age : age - 1;
}

/**
 * Derives the exact current age from the birth date declared on <body>.
 * It runs on every page load, so the number flips on the birthday itself
 * and never needs to be edited again.
 */
function renderAge() {
  const birth = parseLocalDate(birthDate);

  if (!birth) return;

  const age = calculateAge(birth);

  ageSlots.forEach((slot) => {
    slot.textContent = String(age);
  });
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const media = document.createElement("div");
  media.className = "project-card__media";

  if (project.image) {
    const image = document.createElement("img");
    image.className = "project-card__image";
    image.src = project.image;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    media.append(image);
  } else {
    const initial = document.createElement("span");
    initial.className = "project-card__initial";
    initial.setAttribute("aria-hidden", "true");
    initial.textContent = project.title.charAt(0).toUpperCase();
    media.append(initial);
  }

  const body = document.createElement("div");
  body.className = "project-card__body";

  const title = document.createElement("h3");
  title.className = "project-card__title";
  title.textContent = project.title;

  const description = document.createElement("p");
  description.className = "project-card__desc";
  description.textContent = project.description;

  const tech = document.createElement("ul");
  tech.className = "project-card__tech";

  (project.tech ?? []).forEach((item) => {
    const tag = document.createElement("li");
    tag.textContent = item;
    tech.append(tag);
  });

  body.append(title, description, tech);

  const wrapper = document.createElement(project.link ? "a" : "div");
  wrapper.className = "project-card__link";

  if (project.link) {
    wrapper.href = project.link;
    wrapper.target = "_blank";
    wrapper.rel = "noopener noreferrer";
  }

  wrapper.append(media, body);
  card.append(wrapper);

  return card;
}

function renderProjects() {
  if (!projectsRoot) return;

  projectsRoot.replaceChildren();

  if (projects.length === 0) {
    const empty = document.createElement("p");
    empty.className = "projects__empty";
    empty.textContent =
      "Todavía no hay proyectos publicados. El primero está en camino.";
    projectsRoot.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  projects.forEach((project) => {
    fragment.append(createProjectCard(project));
  });

  projectsRoot.append(fragment);
}

/**
 * Turns the contact form into a WhatsApp deep link.
 *
 * There is no backend: the message is prefilled and WhatsApp opens in a new
 * tab, so the visitor decides whether to send it. A synthetic anchor click is
 * used instead of `window.open` because `noopener` makes `window.open` return
 * null even when it succeeds.
 */
function setupContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !message) return;

    const text = `Hola Legna, soy ${name}.\n\n${message}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();

    contactForm.reset();
  });
}

toggle?.addEventListener("click", () => {
  setTheme(isDark() ? "light" : "dark");
});

if (yearSlot) {
  yearSlot.textContent = String(new Date().getFullYear());
}

renderAge();
renderProjects();
setupContactForm();
applyTheme(isDark() ? "dark" : "light");
