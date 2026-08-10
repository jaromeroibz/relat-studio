import { DEFAULT_LOCALE } from './locales.js';
import {
  projects,
  getProject,
  getFeaturedProjects,
  getNextProject,
} from './projects.js';

import { site as siteEn } from './en/site.js';
import { primaryNav as navEn, footerNav as footerEn } from './en/navigation.js';
import { services as servicesEn } from './en/services.js';
import { approach as approachEn } from './en/approach.js';
import { hero as heroEn } from './en/home.js';
import { about as aboutEn } from './en/about.js';
import { contact as contactEn } from './en/contact.js';
import { projectCopy as projectCopyEn } from './en/projects.js';

/**
 * Content bundles, one per locale.
 *
 * Adding Spanish means adding an `es` key here and the matching files under
 * `src/data/es/`. Components read content through `getContent()` and never
 * import a locale file directly, so nothing else has to change.
 */
const BUNDLES = {
  en: {
    site: siteEn,
    primaryNav: navEn,
    footerNav: footerEn,
    services: servicesEn,
    approach: approachEn,
    hero: heroEn,
    about: aboutEn,
    contact: contactEn,
    projectCopy: projectCopyEn,
  },
};

/**
 * @param {string} [locale]
 * @returns {typeof BUNDLES['en']}
 */
export function getContent(locale = DEFAULT_LOCALE) {
  return BUNDLES[locale] ?? BUNDLES[DEFAULT_LOCALE];
}

export { projects, getProject, getFeaturedProjects, getNextProject };
export { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales.js';
