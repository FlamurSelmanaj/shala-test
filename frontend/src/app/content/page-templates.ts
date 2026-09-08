import { type SectionKey } from './localdb.model';

/**
 * Starting presets for a new page. Every data page is the same shape — a hero plus
 * an ordered list of sections — so these are just section-list starting points,
 * derived from the six original pages (see `tasks/todo.md` for the analysis).
 */
export interface PageTemplate {
  id: string;
  label: string;
  sections: SectionKey[];
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  { id: 'editorial', label: 'Editorial — welcome + magazine', sections: ['welcome', 'magazine'] },
  {
    id: 'catalog',
    label: 'Catalog — categories + product news',
    sections: ['category-grid', 'product-news']
  },
  { id: 'solutions', label: 'Solutions — ReSorb + service', sections: ['resorb', 'service'] },
  { id: 'service', label: 'Service — service + process', sections: ['service', 'process'] },
  { id: 'company', label: 'Company — welcome + careers CTA', sections: ['welcome', 'career-cta'] },
  { id: 'recruiting', label: 'Recruiting — careers CTA', sections: ['career-cta'] },
  { id: 'blank', label: 'Blank — hero only', sections: [] }
];
