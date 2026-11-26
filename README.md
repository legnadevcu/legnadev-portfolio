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

1. Repository and design system
2. Intro section
3. Projects gallery
4. Contact form (WhatsApp)
5. Responsive polish and accessibility pass

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```
npx serve .
```
