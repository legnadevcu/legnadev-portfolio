# Portfolio

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

## Phases

1. Repository and design system ✅
2. Intro section ✅
3. Projects gallery ✅
4. Contact form (WhatsApp)
5. Responsive polish and accessibility pass

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

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```
npx serve .
```
