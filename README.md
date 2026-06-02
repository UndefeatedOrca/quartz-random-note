# Quartz Random Note

A Quartz v5 community component plugin that adds a die-shaped random note button. It is intended to sit in the toolbar with small chrome controls like reader mode and dark mode.

Vibe-coded with Codex (allegedly GPT-5.5), I do not know how or why this works.

The button chooses from content, tag, and folder pages (though it doesn't want to).

## Install

```bash
npx quartz plugin add github:UndefeatedOrca/quartz-random-note
```

## Usage

Register the component in your Quartz config next to the reader mode and dark mode controls.

```yaml
plugins:
  - source: github:UndefeatedOrca/quartz-random-note
    enabled: true
    options:
      label: Open a random note
      includeCurrentPage: false
    order: 50
    layout:
      position: left
      group: toolbar
      priority: 55
```

The plugin manifest also exposes `RandomNote` as a component with a default `left` position for Quartz plugin discovery. **To place it on your toolbar, you must add the toolbar group** (I don't know how to fix this).

## Options

```ts
RandomNote({
  label: "Open a random note",
  includeCurrentPage: false,
  className: "",
});
```

- `label`: Accessible label and tooltip text for the button.
- `includeCurrentPage`: Include the current Markdown page in the random note pool - I don't know why you would want this, but go for it.
- `className`: Optional extra CSS class for local layout tweaks.

## Behavior

The note target is selected with `Math.random()` from the Markdown content-page candidate list rendered by Quartz for the current page. The die face is also selected with `Math.random()`, then rendered after the destination page loads.

The button uses `currentColor`, `var(--darkgray)`, and `var(--secondary)` so its color behavior follows the same light/dark theme variable changes used by nearby Quartz controls.
