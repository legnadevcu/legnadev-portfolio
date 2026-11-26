const STORAGE_KEY = "theme";
const LANG_KEY = "lang";

const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");
const toggleLabel = document.querySelector("[data-theme-label]");
const yearSlot = document.querySelector("[data-year]");
const ageSlots = document.querySelectorAll("[data-age]");
const birthDate = document.body.dataset.birthDate;
const projectsRoot = document.querySelector("[data-projects]");
const contactForm = document.querySelector("[data-contact-form]");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector(".site-header");
const langButtons = [...document.querySelectorAll("[data-lang]")];

/** Cuba country code (53) plus the number, digits only. */
const WHATSAPP_NUMBER = "5355335781";

/**
 * Every piece of visible copy lives here, keyed once and translated twice.
 * Markup references a key with data-i18n, so switching a language never
 * touches the HTML structure.
 */
const TRANSLATIONS = {
  es: {
    "meta.title": "Legna Ivett — Desarrollo web",
    "meta.description":
      "Portfolio de Legna Ivett, estudiante de Ciencias Informáticas en la UCI (Cuba) y desarrolladora web.",
    "meta.locale": "es_ES",

    skip: "Saltar al contenido",
    "nav.label": "Navegación principal",
    "nav.about": "Sobre mí",
    "nav.projects": "Proyectos",
    "nav.contact": "Contacto",

    "lang.label": "Idioma",
    "theme.toDark": "Modo oscuro",
    "theme.toLight": "Modo claro",
    "menu.open": "Abrir menú",
    "menu.close": "Cerrar menú",

    "hero.eyebrow": "Estudiante de Ciencias Informáticas · Cuba",
    "hero.greeting": "Hola, soy",
    "hero.leadBefore": "Soy cubana, tengo",
    "hero.leadAfter":
      "años y desde 2024 estudio Ciencias Informáticas en la Universidad de Ciencias Informáticas (UCI). Me encanta el desarrollo web.",
    "hero.ctaProjects": "Ver proyectos",
    "hero.ctaContact": "Hablemos",

    "projects.title": "Proyectos",
    "projects.lead":
      "Lo que voy construyendo mientras aprendo. Pasa el cursor sobre cada tarjeta para ver el proyecto con claridad.",
    "projects.empty":
      "Todavía no hay proyectos publicados. El primero está en camino.",

    "contact.title": "Contacto",
    "contact.lead":
      "¿Tienes una idea, una propuesta o una duda? Escríbeme y te respondo por WhatsApp.",
    "contact.direct": "Directo",
    "contact.name": "Tu nombre",
    "contact.namePlaceholder": "Ana Pérez",
    "contact.message": "Tu mensaje",
    "contact.messagePlaceholder": "Hola Legna, me gustaría...",
    "contact.submit": "Enviar por WhatsApp",
    "contact.whatsappIntro": "Hola Legna, soy",

    "footer.top": "Volver arriba ↑",
  },

  en: {
    "meta.title": "Legna Ivett — Web development",
    "meta.description":
      "Portfolio of Legna Ivett, Computer Science student at UCI (Cuba) and web developer.",
    "meta.locale": "en_US",

    skip: "Skip to content",
    "nav.label": "Main navigation",
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.contact": "Contact",

    "lang.label": "Language",
    "theme.toDark": "Dark mode",
    "theme.toLight": "Light mode",
    "menu.open": "Open menu",
    "menu.close": "Close menu",

    "hero.eyebrow": "Computer Science student · Cuba",
    "hero.greeting": "Hi, I'm",
    "hero.leadBefore": "I'm Cuban, I'm",
    "hero.leadAfter":
      "years old and I have been studying Computer Science at the University of Informatics Sciences (UCI) since 2024. I love web development.",
    "hero.ctaProjects": "View projects",
    "hero.ctaContact": "Let's talk",

    "projects.title": "Projects",
    "projects.lead":
      "What I'm building while I learn. Hover over a card to see the project clearly.",
    "projects.empty": "No projects published yet. The first one is on its way.",

    "contact.title": "Contact",
    "contact.lead":
      "Do you have an idea, a proposal or a question? Write to me and I'll reply on WhatsApp.",
    "contact.direct": "Direct",
    "contact.name": "Your name",
    "contact.namePlaceholder": "Ana Pérez",
    "contact.message": "Your message",
    "contact.messagePlaceholder": "Hi Legna, I would like...",
    "contact.submit": "Send via WhatsApp",
    "contact.whatsappIntro": "Hi Legna, I'm",

    "footer.top": "Back to top ↑",
  },
};

/**
 * Project gallery data.
 *
 * To add a project, append one object to this array. `title` and `description`
 * hold one string per language. `image` is optional: when it is missing, the
 * card renders a gradient with the project's initial. Use a screenshot at 16:10
 * for the best result (for example 1280x800).
 */
const projects = [
  {
    title: {
      es: "Portfolio personal",
      en: "Personal portfolio",
    },
    description: {
      es: "Sitio de una sola página con modo claro/oscuro persistente, galería de proyectos y contacto directo por WhatsApp. Construido sin frameworks.",
      en: "Single-page site with persistent light/dark mode, a project gallery and direct WhatsApp contact. Built without frameworks.",
    },
    tech: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/legnadevcu/legnadev-portfolio",
    image: "",
  },

  // Copy this block when a new project is ready:
  // {
  //   title: { es: "", en: "" },
  //   description: { es: "", en: "" },
  //   tech: ["", ""],
  //   link: "",
  //   image: "",
  // },
];

let currentLang = "es";

/** Reads a translation key for the active language, falling back to Spanish. */
function t(key) {
  return TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS.es[key] ?? key;
}

const isDark = () => root.dataset.theme === "dark";

function applyTheme(theme) {
  root.dataset.theme = theme;

  if (toggle) {
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  if (toggleLabel) {
    toggleLabel.textContent = t(theme === "dark" ? "theme.toLight" : "theme.toDark");
  }

  if (themeColorMeta) {
    themeColorMeta.content = theme === "dark" ? "#050a14" : "#f6f9ff";
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

function updateNavToggleLabel() {
  if (!navToggle) return;

  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-label", t(open ? "menu.close" : "menu.open"));
}

/**
 * Rewrites every translatable node from the active dictionary.
 *
 * Text goes through `textContent`, never `innerHTML`, so a translation can
 * never inject markup. Attributes that are not text (placeholder, aria-label,
 * meta content) get their own data attribute.
 */
function applyLanguage(lang) {
  currentLang = lang;
  root.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });

  document.querySelectorAll("[data-i18n-content]").forEach((element) => {
    element.setAttribute("content", t(element.dataset.i18nContent));
  });

  langButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  });

  applyTheme(isDark() ? "dark" : "light");
  updateNavToggleLabel();
  renderProjects();
}

function setLanguage(lang, { persist = true } = {}) {
  applyLanguage(lang);

  if (!persist) return;

  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (error) {
    /* storage unavailable: the language still applies for this visit */
  }
}

/** Saved choice first, then the browser preference, then Spanish. */
function detectLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "es" || saved === "en") return saved;
  } catch (error) {
    /* fall through to the browser preference */
  }

  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "es";
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
    initial.textContent = project.title[currentLang].charAt(0).toUpperCase();
    media.append(initial);
  }

  const body = document.createElement("div");
  body.className = "project-card__body";

  const title = document.createElement("h3");
  title.className = "project-card__title";
  title.textContent = project.title[currentLang];

  const description = document.createElement("p");
  description.className = "project-card__desc";
  description.textContent = project.description[currentLang];

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
    empty.textContent = t("projects.empty");
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

    const intro = t("contact.whatsappIntro");
    const text = `${intro} ${name}.\n\n${message}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();

    contactForm.reset();
  });
}

/**
 * Mobile menu: a disclosure that stays honest about its state.
 * `aria-expanded` drives both the icon and the accessibility tree.
 */
function setupNav() {
  if (!navToggle || !nav) return;

  const isOpen = () => navToggle.getAttribute("aria-expanded") === "true";

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    updateNavToggleLabel();
  };

  navToggle.addEventListener("click", () => {
    setOpen(!isOpen());
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      navToggle.focus();
    }
  });

  window
    .matchMedia("(min-width: 721px)")
    .addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
}

function setupLanguageSwitch() {
  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.lang === currentLang) return;
      setLanguage(button.dataset.lang);
    });
  });
}

/** Adds the header divider only once the page has moved. */
function setupHeaderState() {
  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

/** Marks the nav link of the section currently crossing the viewport middle. */
function setupScrollSpy() {
  const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  if (links.length === 0) return;

  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length === 0) return;

  const setCurrent = (id) => {
    links.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

toggle?.addEventListener("click", () => {
  setTheme(isDark() ? "light" : "dark");
});

if (yearSlot) {
  yearSlot.textContent = String(new Date().getFullYear());
}

renderAge();
applyLanguage(detectLanguage());
setupContactForm();
setupNav();
setupLanguageSwitch();
setupHeaderState();
setupScrollSpy();
