import { toast } from 'react-toastify';

/**
 * Menangkap semua action async thunk yang gagal (berakhiran "/rejected")
 * lalu menampilkannya sebagai toast notification.
 */
const errorMiddleware = () => (next) => (action) => {
  if (action.type?.endsWith('/rejected') && action.error) {
    toast.error(action.error.message || 'Terjadi kesalahan, silakan coba lagi.');
  }

  return next(action);
};

export default errorMiddleware;
