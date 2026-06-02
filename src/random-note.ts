import type { QuartzPluginData } from "@quartz-community/types";

export interface RandomNoteCandidate {
  slug: string;
  title: string;
}

const markdownExtensions = [".md", ".markdown"];
const excludedSlugPrefixes = ["tag/", "tags/", "folder/", "folders/"];
const excludedSlugs = ["tag", "tags", "folder", "folders"];

const normalizePath = (value: unknown) =>
  typeof value === "string" ? value.replace(/\\/g, "/").toLowerCase() : "";

const normalizeSlug = (value: unknown) =>
  typeof value === "string" ? value.replace(/^\/+/, "").replace(/\/+$/, "") : "";

const stripMarkdownExtension = (filePath: string) => {
  const extension = markdownExtensions.find((ext) => filePath.endsWith(ext));
  if (!extension) return "";

  return filePath.slice(0, -extension.length).replace(/\/index$/, "");
};

const getTitle = (file: QuartzPluginData & Record<string, unknown>) => {
  const frontmatter = file.frontmatter as { title?: unknown } | undefined;
  if (typeof frontmatter?.title === "string" && frontmatter.title.trim().length > 0) {
    return frontmatter.title;
  }

  if (typeof file.slug === "string") {
    const parts = file.slug.split("/");
    return parts.at(-1) ?? file.slug;
  }

  return "Untitled";
};

export const isMarkdownVaultFile = (file: QuartzPluginData & Record<string, unknown>) => {
  const filePath = normalizePath(file.filePath ?? file.relativePath);
  return markdownExtensions.some((extension) => filePath.endsWith(extension));
};

export const isContentPage = (file: QuartzPluginData & Record<string, unknown>) => {
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

export const getRandomNoteCandidates = (
  allFiles: (QuartzPluginData & Record<string, unknown>)[],
  currentSlug?: unknown,
  includeCurrentPage = false,
): RandomNoteCandidate[] => {
  const normalizedCurrentSlug = typeof currentSlug === "string" ? currentSlug : undefined;

  return allFiles
    .filter((file) => typeof file.slug === "string")
    .filter(isContentPage)
    .filter((file) => includeCurrentPage || file.slug !== normalizedCurrentSlug)
    .map((file) => ({
      slug: file.slug as string,
      title: getTitle(file),
    }));
};
