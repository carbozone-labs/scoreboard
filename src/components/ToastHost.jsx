import { useEffect, useState } from 'react';
import { subscribeToast } from '../lib/toast';

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = subscribeToast((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3200);
    });
    return unsub;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.variant}`}>{t.message}</div>
      ))}
    </div>
  );
}
