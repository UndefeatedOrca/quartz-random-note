type RandomNoteCandidate = {
  slug: string;
  title: string;
};

const pendingFaceStorageKey = "quartz-random-note-pending-face";

const rollDie = () => String(Math.floor(Math.random() * 6) + 1);

const stripSlashes = (value: string) => value.replace(/^\/+/, "").replace(/\/+$/, "");

const cleanSlug = (slug: string) => stripSlashes(slug).replace(/\/index$/, "");

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

const getContentSlugs = async () => {
  try {
    return new Set(Object.keys(await fetchData));
  } catch {
    return null;
  }
};

const filterContentNotes = async (notes: RandomNoteCandidate[]) => {
  const contentSlugs = await getContentSlugs();
  if (!contentSlugs) return notes;

  return notes.filter((note) => contentSlugs.has(note.slug));
};

const getSitePathPrefix = (button: HTMLElement) => {
  const currentSlug = cleanSlug(button.dataset.currentSlug ?? "");
  if (currentSlug.length === 0) return "";

  const currentPath = stripSlashes(decodeURIComponent(window.location.pathname));
  if (currentPath === currentSlug) return "";
  if (!currentPath.endsWith(`/${currentSlug}`)) return "";

  return `/${currentPath.slice(0, -currentSlug.length).replace(/\/+$/, "")}`;
};

const slugToUrl = (slug: string, button: HTMLElement) => {
  const targetSlug = cleanSlug(slug);
  const prefix = getSitePathPrefix(button);
  const path = targetSlug.length > 0 ? `${prefix}/${targetSlug}` : `${prefix}/`;
  return new URL(path, window.location.origin);
};

const navigateTo = async (slug: string, button: HTMLElement) => {
  const url = slugToUrl(slug, button);
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

    const clickHandler = async () => {
      const currentNotes = await filterContentNotes(parseNotes(button));
      if (currentNotes.length === 0) return;

      const note = currentNotes[Math.floor(Math.random() * currentNotes.length)];
      if (!note) return;

      sessionStorage.setItem(pendingFaceStorageKey, rollDie());
      await navigateTo(note.slug, button);
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
