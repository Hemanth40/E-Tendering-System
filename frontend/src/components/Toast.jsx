import toast, { Toaster } from 'react-hot-toast';

export const showSuccessToast = (message) => {
  toast.success(message, {
    style: {
      background: '#10B981',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    style: {
      background: '#EF4444',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  });
};

export const showInfoToast = (message) => {
  toast(message, {
    style: {
      background: '#3B82F6',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#3B82F6',
    },
  });
};

export const showWarningToast = (message) => {
  toast(message, {
    style: {
      background: '#F59E0B',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#F59E0B',
    },
  });
};

export const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
        },
      }}
    />
  );
};
