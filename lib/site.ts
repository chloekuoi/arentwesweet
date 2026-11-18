/** Public origin for share links. Falls back to the current origin in the browser. */
export function siteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return 'http://localhost:3000';
}
export const shareLink = (id: string) => `${siteUrl()}/g/${id}`;
/** The link as shown in the dashed box: no scheme. */
export const displayLink = (id: string) => shareLink(id).replace(/^https?:\/\//, '');
