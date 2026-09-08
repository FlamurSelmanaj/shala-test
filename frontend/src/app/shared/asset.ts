/**
 * Base URL for images hotlinked from the live KANN site.
 * Swap this single constant if KANN moves its assets or adds referer blocking.
 */
export const ASSET = 'https://www.kann.de';

/** Build an absolute KANN asset URL from a root-relative path. */
export const asset = (path: string): string => ASSET + path;
