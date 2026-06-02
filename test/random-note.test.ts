import { describe, expect, it } from "vitest";
import { getRandomNoteCandidates, isMarkdownVaultFile } from "../src/random-note";

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
    ] as Array<Record<string, unknown>>;

    expect(files.map(isMarkdownVaultFile)).toEqual([true, false, false, true]);
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
