let listeners = [];
let idCounter = 0;

export function subscribeToast(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

export function showToast(message, variant = 'info') {
  const toast = { id: ++idCounter, message, variant };
  listeners.forEach((fn) => fn(toast));
  return toast.id;
}
