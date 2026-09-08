import { type SectionKey } from '../../content/localdb.model';
import { type Lang } from '../../i18n';

/** Editable form state for a page in the admin editor. */
export interface Draft {
  slug: string;
  heroImage: string;
  sections: SectionKey[];
  text: Record<Lang, { title: string; subtitle: string }>;
}

export const blankDraft = (): Draft => ({
  slug: '',
  heroImage: '',
  sections: [],
  text: {
    de: { title: '', subtitle: '' },
    en: { title: '', subtitle: '' },
    sq: { title: '', subtitle: '' }
  }
});

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
