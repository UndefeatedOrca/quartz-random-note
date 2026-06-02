import { describe, expect, it } from "vitest";
import { getRandomNoteCandidates, isContentPage, isMarkdownVaultFile } from "../src/random-note";

describe("RandomNote", () => {
  it("only includes markdown files from the vault", () => {
    const files = [
      {
        slug: "notes/alpha",
        filePath: "notes/alpha.md",
        frontmatter: { title: "Alpha" },
      },
      {
        slug: "assets/photo",
        filePath: "assets/photo.png",
      },
      {
        slug: "bases/tasks",
        filePath: "bases/tasks.base",
      },
      {
        slug: "notes/beta",
        relativePath: "notes/beta.markdown",
      },
      {
        slug: "tags/project",
        filePath: "tags/project.md",
      },
      {
        slug: "notes",
        filePath: "notes/index.md",
        pageType: "folder",
      },
    ] as Array<Record<string, unknown>>;

    expect(files.map(isMarkdownVaultFile)).toEqual([true, false, false, true, true, true]);
    expect(files.map(isContentPage)).toEqual([true, false, false, true, false, false]);
    expect(getRandomNoteCandidates(files, "notes/alpha")).toEqual([
      {
        slug: "notes/beta",
        title: "beta",
      },
    ]);
  });

  it("can include the current page when configured", () => {
    const files = [
      {
        slug: "notes/alpha",
        filePath: "notes/alpha.md",
        frontmatter: { title: "Alpha" },
      },
    ] as Array<Record<string, unknown>>;

    expect(getRandomNoteCandidates(files, "notes/alpha", true)).toEqual([
      {
        slug: "notes/alpha",
        title: "Alpha",
      },
    ]);
  });
});
