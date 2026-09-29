export const getAdminPath = (path: string = '') => {
  const base = import.meta.env.VITE_ADMIN_PATH || '/admin';
  return `${base}${path}`;
};
