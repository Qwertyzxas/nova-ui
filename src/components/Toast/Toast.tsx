import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Toast.css';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: 'neutral' | 'success' | 'danger';
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastApi {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast() must be used inside <ToastProvider>');
  return api;
}

export interface ToastProviderProps {
  children: ReactNode;
  label?: string;
  dismissLabel?: string;
  max?: number;
  defaultDuration?: number;
}

let counter = 0;

export function ToastProvider({ children, label = 'Notifications', dismissLabel = 'Dismiss notification', max = 3, defaultDuration = 5000 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, { handle: number; deadline: number; remaining: number }>());
  const paused = useRef(false);

  const dismiss = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) window.clearTimeout(t.handle);
    timers.current.delete(id);
    setToasts((list) => list.filter((item) => item.id !== id));
  }, []);

  const arm = useCallback(
    (id: string, ms: number) => {
      if (!Number.isFinite(ms)) return;
      const handle = window.setTimeout(() => dismiss(id), ms);
      timers.current.set(id, { handle, deadline: Date.now() + ms, remaining: ms });
    },
    [dismiss],
  );

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `nova-toast-${++counter}`;
      setToasts((list) => [...list, { ...options, id }].slice(-max));
      const duration = options.duration ?? defaultDuration;
      if (paused.current) timers.current.set(id, { handle: 0, deadline: 0, remaining: duration });
      else arm(id, duration);
      return id;
    },
    [arm, defaultDuration, max],
  );

  const pause = () => {
    if (paused.current) return;
    paused.current = true;
    for (const [, t] of timers.current) {
      window.clearTimeout(t.handle);
      t.remaining = Math.max(0, t.deadline - Date.now());
    }
  };

  const resume = () => {
    if (!paused.current) return;
    paused.current = false;
    for (const [id, t] of [...timers.current]) arm(id, t.remaining);
  };

  useEffect(() => {
    const all = timers.current;
    return () => {
      for (const [, t] of all) window.clearTimeout(t.handle);
    };
  }, []);

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <section
        aria-label={label}
        className="nova-toaster"
        onPointerEnter={pause}
        onPointerLeave={resume}
        onFocus={pause}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && resume()}
      >
        <ol className="nova-toaster__list" aria-live="polite" aria-relevant="additions text">
          {toasts.map((t) => (
            <li key={t.id} className={cx('nova-toast', `nova-toast--${t.tone ?? 'neutral'}`)}>
              <div className="nova-toast__text">
                <p className="nova-toast__title">{t.title}</p>
                {t.description && <p className="nova-toast__description">{t.description}</p>}
              </div>
              {t.action && (
                <button
                  type="button"
                  className="nova-toast__action nova-focusable"
                  onClick={() => {
                    t.action!.onClick();
                    dismiss(t.id);
                  }}
                >
                  {t.action.label}
                </button>
              )}
              <button type="button" className="nova-toast__close nova-focusable" aria-label={dismissLabel} onClick={() => dismiss(t.id)}>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="m4 4 8 8M12 4l-8 8" />
                </svg>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </ToastContext.Provider>
  );
}
