export const OPEN_SEARCH_EVENT = 'nw:open-search';

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT));
}
