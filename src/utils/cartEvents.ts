// Very small event helper for cart updates shared across components

type Listener = () => void;

const listeners = new Set<Listener>();

export const subscribeCart = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const notifyCartChanged = (): void => {
  // Copy to prevent mutation during iteration
  Array.from(listeners).forEach((l) => {
    try {
      l();
    } catch (e) {
      // no-op
    }
  });
};


