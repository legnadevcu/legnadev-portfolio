# Portfolio

**Live site:** https://legnadevcu.github.io/legnadev-portfolio/

Personal portfolio as a single page, built with plain HTML, CSS and JavaScript.

## Structure

```
index.html    Markup and content
styles.css    Design tokens, layout and components
script.js     Theme switching and interactions
```

## Design system

- **Typography:** SF Pro Display for headings, SF Pro Text for body copy, both
  falling back to Inter (loaded from Google Fonts) on non-Apple platforms.
- **Color:** blue-based palette with a light and a dark theme, driven by CSS
  custom properties in `styles.css`.
- **Theme:** follows `prefers-color-scheme` on first visit and remembers the
  user's choice in `localStorage`.

## Languages

The site ships in Spanish and English. A switch in the header stores the choice
in `localStorage` and falls back to the browser language on the first visit.

Copy lives in the `TRANSLATIONS` object at the top of `script.js`. Markup points
at a key instead of holding the text:

```html
<h2 data-i18n="projects.title">Proyectos</h2>
<input data-i18n-placeholder="contact.namePlaceholder" />
<meta data-i18n-content="meta.description" />
```

To add a language, add one entry to `TRANSLATIONS` and one button with
`data-lang="<code>"` to the header.

## Phases

1. Repository and design system ✅
2. Intro section ✅
3. Projects gallery ✅
4. Contact form (WhatsApp) ✅
5. Responsive polish and accessibility pass ✅

## Accessibility notes

- Skip link to the main content.
- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`).
- `aria-expanded` on the mobile menu, closable with `Escape`.
- Nav links expose `aria-current` while their section is on screen.
- Focus rings on every interactive element; card reveal also triggers on
  `:focus-within`.
- The hover reveal is wrapped in `@media (hover: hover)`, so touch devices never
  get a permanently blurred image.
- `prefers-reduced-motion` disables transitions and smooth scrolling.

## Adding a project

The gallery is rendered from the `projects` array at the top of `script.js`.
Append one object per project:

```js
{
  title: "To-Do con persistencia",
  description: "Gestor de tareas con filtros y datos guardados en localStorage.",
  tech: ["HTML", "CSS", "JavaScript"],
  link: "https://github.com/legnadevcu/todo-app",
  image: "assets/todo.png",
}
```

- `image` is optional. Without it the card shows a gradient with the project's
  initial. With it, the screenshot stays blurred until hover.
- Recommended screenshot size: 1280x800 (16:10).
- Cards without `link` render as static cards, not links.

## Cache busting

GitHub Pages serves every file with `Cache-Control: max-age=600`, so a browser
can keep an old `script.js` for up to 10 minutes after a deploy. That is how you
end up with new HTML and an old script. Both assets carry a version query:

```html
<link rel="stylesheet" href="styles.css?v=20261126" />
<script src="script.js?v=20261126" defer></script>
```

**Bump that number every time you change `styles.css` or `script.js`.** Changing
only `index.html` does not need a bump.

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```
npx serve .
```
