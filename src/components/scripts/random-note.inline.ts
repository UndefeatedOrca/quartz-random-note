type RandomNoteCandidate = {
  slug: string;
  title: string;
};

const pendingFaceStorageKey = "quartz-random-note-pending-face";

const rollDie = () => String(Math.floor(Math.random() * 6) + 1);

const parseNotes = (button: HTMLElement): RandomNoteCandidate[] => {
  const rawNotes = button.dataset.notes;
  if (!rawNotes) return [];

  try {
    const notes = JSON.parse(rawNotes) as RandomNoteCandidate[];
    return Array.isArray(notes)
      ? notes.filter((note) => typeof note.slug === "string" && note.slug.length > 0)
      : [];
  } catch {
    return [];
  }
};

const slugToUrl = (slug: string) => {
  const cleanSlug = slug.replace(/^\/+/, "").replace(/\/index$/, "");
  const path = cleanSlug.length > 0 ? `/${cleanSlug}` : "/";
  return new URL(path, window.location.origin);
};

const navigateTo = async (slug: string) => {
  const url = slugToUrl(slug);
  if (window.spaNavigate) {
    await window.spaNavigate(url, false);
    return;
  }

  window.location.assign(url);
};

const bindRandomNote = () => {
  const buttons = document.querySelectorAll<HTMLElement>("[data-random-note]");
  const cleanupFns: Array<() => void> = [];
  const pendingFace = sessionStorage.getItem(pendingFaceStorageKey);

  if (pendingFace) {
    sessionStorage.removeItem(pendingFaceStorageKey);
  }

  for (const button of buttons) {
    if (pendingFace) {
      button.dataset.face = pendingFace;
    }

    if (button.dataset.randomNoteBound === "true") continue;
    button.dataset.randomNoteBound = "true";

    const notes = parseNotes(button);
    button.toggleAttribute("disabled", notes.length === 0);

    const clickHandler = () => {
      const currentNotes = parseNotes(button);
      if (currentNotes.length === 0) return;

      button.dataset.face = rollDie();
      const note = currentNotes[Math.floor(Math.random() * currentNotes.length)];
      if (!note) return;

      sessionStorage.setItem(pendingFaceStorageKey, rollDie());
      void navigateTo(note.slug);
    };

    button.addEventListener("click", clickHandler);
    cleanupFns.push(() => button.removeEventListener("click", clickHandler));
  }

  if (window.addCleanup) {
    window.addCleanup(() => cleanupFns.forEach((cleanup) => cleanup()));
  }
};

if (typeof document !== "undefined") {
  bindRandomNote();
  document.addEventListener("nav", bindRandomNote);
  document.addEventListener("render", bindRandomNote);
}
