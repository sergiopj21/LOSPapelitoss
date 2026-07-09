:root {
  --paper: #F6EFDD;
  --paper-deep: #EDE3C8;
  --ink: #2B2118;
  --ink-soft: #6B5E4C;
  --line: rgba(43, 33, 24, 0.14);
  --coral: #E85D3F;
  --teal: #1F8A82;
  --indigo: #4C5BD4;
  --mustard: #D9A227;
  --plum: #8C5AC0;
  --sage: #4E8B4E;
  --rose: #C94F7C;
  --danger: #C1432E;
  --good: #2E8B57;
  --shadow-card: 0 18px 40px -18px rgba(43, 33, 24, 0.45);
  --radius-lg: 22px;
  --radius-md: 14px;
  --font-display: "Kalam", "Comic Sans MS", cursive;
  --font-hand: "Caveat", cursive;
  --font-ui: "Space Grotesk", system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
}

body {
  margin: 0;
  font-family: var(--font-ui);
  color: var(--ink);
  background: var(--paper);
  background-image:
    radial-gradient(circle at 12% 8%, rgba(232, 93, 63, 0.10), transparent 40%),
    radial-gradient(circle at 88% 92%, rgba(76, 91, 212, 0.10), transparent 42%);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

button {
  font-family: var(--font-ui);
  cursor: pointer;
}

input, textarea {
  font-family: var(--font-ui);
}

button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 3px solid var(--indigo);
  outline-offset: 2px;
}

::selection {
  background: var(--coral);
  color: var(--paper);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
