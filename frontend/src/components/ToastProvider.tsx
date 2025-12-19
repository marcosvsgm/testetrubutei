import { Toaster } from 'react-hot-toast'

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          maxWidth: '500px',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#27ae60',
            secondary: '#ffffff',
          },
          style: {
            borderLeft: '4px solid #27ae60',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#e74c3c',
            secondary: '#ffffff',
          },
          style: {
            borderLeft: '4px solid #e74c3c',
          },
        },
        loading: {
          iconTheme: {
            primary: '#667eea',
            secondary: '#ffffff',
          },
          style: {
            borderLeft: '4px solid #667eea',
          },
        },
      }}
    />
  )
}
