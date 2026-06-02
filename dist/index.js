import { createRequire } from 'module';

createRequire(import.meta.url);

// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/random-note.ts
var markdownExtensions = [".md", ".markdown"];
var excludedSlugPrefixes = ["tag/", "tags/", "folder/", "folders/"];
var excludedSlugs = ["tag", "tags", "folder", "folders"];
var normalizePath = (value) => typeof value === "string" ? value.replace(/\\/g, "/").toLowerCase() : "";
var normalizeSlug = (value) => typeof value === "string" ? value.replace(/^\/+/, "").replace(/\/+$/, "") : "";
var stripMarkdownExtension = (filePath) => {
  const extension = markdownExtensions.find((ext) => filePath.endsWith(ext));
  if (!extension) return "";
  return filePath.slice(0, -extension.length).replace(/\/index$/, "");
};
var getTitle = (file) => {
  const frontmatter = file.frontmatter;
  if (typeof frontmatter?.title === "string" && frontmatter.title.trim().length > 0) {
    return frontmatter.title;
  }
  if (typeof file.slug === "string") {
    const parts = file.slug.split("/");
    return parts.at(-1) ?? file.slug;
  }
  return "Untitled";
};
var isMarkdownVaultFile = (file) => {
  const filePath = normalizePath(file.filePath ?? file.relativePath);
  return markdownExtensions.some((extension) => filePath.endsWith(extension));
};
var isContentPage = (file) => {
  if (!isMarkdownVaultFile(file)) return false;
  const explicitPageType = file.pageType ?? file.type;
  if (typeof explicitPageType === "string" && explicitPageType !== "content") {
    return false;
  }
  const slug = normalizeSlug(file.slug);
  if (excludedSlugs.includes(slug)) return false;
  if (excludedSlugPrefixes.some((prefix) => slug.startsWith(prefix))) return false;
  const filePath = normalizePath(file.filePath ?? file.relativePath);
  const sourceSlug = stripMarkdownExtension(filePath);
  return sourceSlug.length === 0 || slug === sourceSlug;
};
var getRandomNoteCandidates = (allFiles, currentSlug, includeCurrentPage = false) => {
  const normalizedCurrentSlug = typeof currentSlug === "string" ? currentSlug : void 0;
  return allFiles.filter((file) => typeof file.slug === "string").filter(isContentPage).filter((file) => includeCurrentPage || file.slug !== normalizedCurrentSlug).map((file) => ({
    slug: file.slug,
    title: getTitle(file)
  }));
};

// src/components/styles/random-note.scss
var random_note_default = '.random-note {\n  align-items: center;\n  background: transparent;\n  border: 0;\n  color: var(--darkgray);\n  cursor: pointer;\n  display: inline-flex;\n  height: 2rem;\n  justify-content: center;\n  padding: 0;\n  width: 2rem;\n}\n.random-note:hover, .random-note:focus-visible {\n  color: var(--secondary);\n}\n.random-note:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n.random-note:disabled {\n  cursor: not-allowed;\n  opacity: 0.45;\n}\n\n.random-note-die {\n  border: 1.75px solid currentColor;\n  border-radius: 4px;\n  box-sizing: border-box;\n  display: grid;\n  flex: 0 0 auto;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  height: 1.25rem;\n  padding: 2px;\n  width: 1.25rem;\n}\n\n.random-note-dot {\n  align-self: center;\n  background: currentColor;\n  border-radius: 50%;\n  display: none;\n  height: 3px;\n  justify-self: center;\n  width: 3px;\n}\n\n.random-note-dot-1 {\n  grid-area: 1/1;\n}\n\n.random-note-dot-2 {\n  grid-area: 1/2;\n}\n\n.random-note-dot-3 {\n  grid-area: 1/3;\n}\n\n.random-note-dot-4 {\n  grid-area: 2/1;\n}\n\n.random-note-dot-5 {\n  grid-area: 2/2;\n}\n\n.random-note-dot-6 {\n  grid-area: 2/3;\n}\n\n.random-note-dot-7 {\n  grid-area: 3/1;\n}\n\n.random-note-dot-8 {\n  grid-area: 3/2;\n}\n\n.random-note-dot-9 {\n  grid-area: 3/3;\n}\n\n.random-note[data-face="1"] .random-note-dot-5,\n.random-note[data-face="2"] .random-note-dot-1,\n.random-note[data-face="2"] .random-note-dot-9,\n.random-note[data-face="3"] .random-note-dot-1,\n.random-note[data-face="3"] .random-note-dot-5,\n.random-note[data-face="3"] .random-note-dot-9,\n.random-note[data-face="4"] .random-note-dot-1,\n.random-note[data-face="4"] .random-note-dot-3,\n.random-note[data-face="4"] .random-note-dot-7,\n.random-note[data-face="4"] .random-note-dot-9,\n.random-note[data-face="5"] .random-note-dot-1,\n.random-note[data-face="5"] .random-note-dot-3,\n.random-note[data-face="5"] .random-note-dot-5,\n.random-note[data-face="5"] .random-note-dot-7,\n.random-note[data-face="5"] .random-note-dot-9,\n.random-note[data-face="6"] .random-note-dot-1,\n.random-note[data-face="6"] .random-note-dot-3,\n.random-note[data-face="6"] .random-note-dot-4,\n.random-note[data-face="6"] .random-note-dot-6,\n.random-note[data-face="6"] .random-note-dot-7,\n.random-note[data-face="6"] .random-note-dot-9 {\n  display: block;\n}';

// src/components/scripts/random-note.inline.ts
var random_note_inline_default = 'var r="quartz-random-note-pending-face",c=()=>String(Math.floor(Math.random()*6)+1),l=o=>{let e=o.dataset.notes;if(!e)return[];try{let n=JSON.parse(e);return Array.isArray(n)?n.filter(t=>typeof t.slug=="string"&&t.slug.length>0):[]}catch{return[]}},g=o=>{let e=o.replace(/^\\/+/,"").replace(/\\/index$/,""),n=e.length>0?`/${e}`:"/";return new URL(n,window.location.origin)},f=async o=>{let e=g(o);if(window.spaNavigate){await window.spaNavigate(e,!1);return}window.location.assign(e)},s=()=>{let o=document.querySelectorAll("[data-random-note]"),e=[],n=sessionStorage.getItem(r);n&&sessionStorage.removeItem(r);for(let t of o){if(n&&(t.dataset.face=n),t.dataset.randomNoteBound==="true")continue;t.dataset.randomNoteBound="true";let u=l(t);t.toggleAttribute("disabled",u.length===0);let i=()=>{let a=l(t);if(a.length===0)return;t.dataset.face=c();let d=a[Math.floor(Math.random()*a.length)];d&&(sessionStorage.setItem(r,c()),f(d.slug))};t.addEventListener("click",i),e.push(()=>t.removeEventListener("click",i))}window.addCleanup&&window.addCleanup(()=>e.forEach(t=>t()))};typeof document<"u"&&(s(),document.addEventListener("nav",s),document.addEventListener("render",s));\n';
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, o2, r2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((o2 = i2.constructor) && null != o2.getDerivedStateFromError && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/RandomNote.tsx
var dieDots = Array.from({ length: 9 }, (_, index) => /* @__PURE__ */ u2("span", { class: `random-note-dot random-note-dot-${index + 1}` }));
var RandomNote_default = ((opts) => {
  const { className = "", label = "Open a random note", includeCurrentPage = false } = opts ?? {};
  const Component = (props) => {
    const notes = getRandomNoteCandidates(props.allFiles, props.fileData?.slug, includeCurrentPage);
    return /* @__PURE__ */ u2(
      "button",
      {
        type: "button",
        class: classNames("random-note", className, props.displayClass),
        "aria-label": label,
        title: label,
        "data-random-note": true,
        "data-notes": JSON.stringify(notes),
        "data-face": "1",
        children: /* @__PURE__ */ u2("span", { class: "random-note-die", "aria-hidden": "true", children: dieDots })
      }
    );
  };
  Component.css = random_note_default;
  Component.afterDOMLoaded = random_note_inline_default;
  return Component;
});

export { RandomNote_default as RandomNote };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map