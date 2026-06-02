import { QuartzComponent } from '@quartz-community/types';
export { PageGenerator, PageMatcher, QuartzComponent, QuartzComponentConstructor, QuartzComponentProps, QuartzEmitterPlugin, QuartzFilterPlugin, QuartzPageTypePlugin, QuartzPageTypePluginInstance, QuartzTransformerPlugin, StringResource, VirtualPage } from '@quartz-community/types';

interface RandomNoteOptions {
    className?: string;
    label?: string;
    includeCurrentPage?: boolean;
}
declare const _default: (opts?: RandomNoteOptions) => QuartzComponent;

export { _default as RandomNote, type RandomNoteOptions };
