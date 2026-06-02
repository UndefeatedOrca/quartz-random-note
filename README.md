# Quartz Random Note

A Quartz v5 community component plugin that adds a die-shaped random note button. It is intended to sit with small chrome controls like reader mode and dark mode.

The button chooses from built Markdown files in the vault only. Files without a Markdown extension, such as images, bases, JSON files, and generated pages, are ignored.

## Install

```bash
npx quartz plugin add github:quartz-community/random-note
```

## Usage

Register the component in your Quartz layout next to the reader mode and dark mode controls.

```ts
import * as RandomNotePlugin from "./.quartz/plugins/random-note";

export const sharedPageComponents = {
  right: [RandomNotePlugin.RandomNote()],
};
```

The plugin manifest also exposes `RandomNote` as a component with a default right-sidebar position for Quartz plugin discovery.

## Options

```ts
RandomNote({
  label: "Open a random note",
  includeCurrentPage: false,
  className: "",
});
```

- `label`: Accessible label and tooltip text for the button.
- `includeCurrentPage`: Include the current Markdown page in the random note pool.
- `className`: Optional extra CSS class for local layout tweaks.

## Behavior

The die face rolls with `Math.random()` when the component initializes and again when clicked. The note target is also selected with `Math.random()` from the Markdown candidate list rendered by Quartz for the current page.

The button uses `currentColor`, `var(--darkgray)`, and `var(--secondary)` so its color behavior follows the same light/dark theme variable changes used by nearby Quartz controls.
