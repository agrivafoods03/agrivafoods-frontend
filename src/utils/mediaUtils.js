/**
 * Resolves media URLs for display in the frontend.
 * - Local static assets (/assets/...) remain untouched.
 * - Relative API paths (/api/media/file/...) remain untouched.
 * - Direct S3 URLs to private buckets are routed through the backend streaming proxy.
 */
export const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // If already relative or local asset
  if (trimmed.startsWith('/') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // If it's a direct AWS S3 URL to our bucket
  const s3Match = trimmed.match(/^https?:\/\/[^\/]+\.s3[.\-][^\/]+\.amazonaws\.com\/(.+)$/i);
  if (s3Match) {
    const key = s3Match[1].replace(/^\/+/, '');
    return `/api/media/file/${key}`;
  }

  return trimmed;
};
