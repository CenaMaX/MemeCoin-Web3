import toast from 'react-hot-toast';

const toastConfig = { duration: 4000, position: 'top-right' };

export const SuccessToast = (message) => {
  return toast.success(message, toastConfig);
};

export const ErrorToast = (message) => {
  return toast.error(message, toastConfig);
};

