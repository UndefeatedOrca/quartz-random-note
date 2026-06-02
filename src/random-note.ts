import type { QuartzPluginData } from "@quartz-community/types";

export interface RandomNoteCandidate {
  slug: string;
  title: string;
}

const markdownExtensions = [".md", ".markdown"];

const normalizePath = (value: unknown) =>
  typeof value === "string" ? value.replace(/\\/g, "/").toLowerCase() : "";

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

export const getRandomNoteCandidates = (
  allFiles: (QuartzPluginData & Record<string, unknown>)[],
  currentSlug?: unknown,
  includeCurrentPage = false,
): RandomNoteCandidate[] => {
  const normalizedCurrentSlug = typeof currentSlug === "string" ? currentSlug : undefined;

  return allFiles
    .filter((file) => typeof file.slug === "string")
    .filter(isMarkdownVaultFile)
    .filter((file) => includeCurrentPage || file.slug !== normalizedCurrentSlug)
    .map((file) => ({
      slug: file.slug as string,
      title: getTitle(file),
    }));
};
