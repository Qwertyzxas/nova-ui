import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Dialog.css';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnBackdrop?: boolean;
  closeLabel?: string;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeLabel = 'Close',
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = description ? `${id}-description` : undefined;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx('nova-dialog', `nova-dialog--${size}`, className)}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => open && onOpenChange(false)}
      onClick={(event) => {
        if (closeOnBackdrop && event.target === ref.current) onOpenChange(false);
      }}
    >
      {open && (
        <div className="nova-dialog__panel">
          <header className="nova-dialog__header">
            <div>
              <h2 id={titleId} className="nova-dialog__title">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="nova-dialog__description">
                  {description}
                </p>
              )}
            </div>
            <button type="button" className="nova-dialog__close nova-focusable" aria-label={closeLabel} onClick={() => onOpenChange(false)}>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m4 4 8 8M12 4l-8 8" />
              </svg>
            </button>
          </header>
          {children && <div className="nova-dialog__body">{children}</div>}
          {footer && <footer className="nova-dialog__footer">{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}
