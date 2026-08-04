export const getImageUrl = (path: string | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // In local development, the vite proxy handles relative paths
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  if (baseUrl === '/api') {
    return path;
  }
  
  // In production, VITE_API_BASE_URL is something like "https://kallettumkarachurch.site/api"
  // We need to strip the "/api" to get the root URL, then append the image path (e.g. "/uploads/xyz.jpg")
  const backendUrl = baseUrl.replace(/\/api$/, '');
  
  // Ensure we don't end up with double slashes like "https://kallettumkarachurch.site//uploads"
  if (path.startsWith('/')) {
    return `${backendUrl}${path}`;
  }
  return `${backendUrl}/${path}`;
};
