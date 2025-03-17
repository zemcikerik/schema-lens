export const escapeHtml = (html: string): string => html
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll("'", '&apos;')
  .replaceAll('"', '&quot;');
