/**
 * NEXT_PUBLIC_SITE_URL, cleaned up: trims spaces and trailing slashes, and adds https:// if the
 * scheme was left out (e.g. "sweetlikecandy.app"). Returns '' when unset or unusable.
 */
export function configuredSiteUrl(): string {
  let v = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');
  if (!v) return '';
  if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
  try { return new URL(v).origin; } catch { return ''; }
}

/** Public origin for share links. Falls back to the current origin in the browser. */
export function siteUrl() {
  const env = configuredSiteUrl();
  if (env) return env;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'http://localhost:3000';
}
export const shareLink = (id: string) => `${siteUrl()}/g/${id}`;
/** The link as shown in the dashed box: no scheme. */
export const displayLink = (id: string) => shareLink(id).replace(/^https?:\/\//, '');
