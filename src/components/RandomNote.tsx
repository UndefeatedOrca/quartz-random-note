import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { classNames } from "../util/lang";
import { getRandomNoteCandidates } from "../random-note";
import style from "./styles/random-note.scss";
// @ts-expect-error - inline script import handled by Quartz bundler
import script from "./scripts/random-note.inline.ts";

export interface RandomNoteOptions {
  className?: string;
  label?: string;
  includeCurrentPage?: boolean;
}

const dieDots = Array.from({ length: 9 }, (_, index) => (
  <span class={`random-note-dot random-note-dot-${index + 1}`} />
));

export default ((opts?: RandomNoteOptions) => {
  const { className = "", label = "Open a random note", includeCurrentPage = false } = opts ?? {};

  const Component: QuartzComponent = (props: QuartzComponentProps) => {
    const notes = getRandomNoteCandidates(props.allFiles, props.fileData?.slug, includeCurrentPage);

    return (
      <button
        type="button"
        class={classNames("random-note", className, props.displayClass)}
        aria-label={label}
        title={label}
        data-random-note
        data-notes={JSON.stringify(notes)}
        data-face="1"
      >
        <span class="random-note-die" aria-hidden="true">
          {dieDots}
        </span>
      </button>
    );
  };

  Component.css = style;
  Component.afterDOMLoaded = script;

  return Component;
}) satisfies QuartzComponentConstructor<RandomNoteOptions>;
