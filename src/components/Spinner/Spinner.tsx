import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import './Spinner.css';

export interface SpinnerProps extends ComponentPropsWithRef<'span'> {
  size?: 'sm' | 'md' | 'lg';
  /** Announced to screen readers. Pass `null` when the spinner is decorative (e.g. inside a busy button). */
  label?: string | null;
}

export function Spinner({ size = 'md', label = 'Loading', className, ...rest }: SpinnerProps) {
  const a11y = label === null ? { 'aria-hidden': true } : { role: 'status', 'aria-label': label };
  return (
    <span className={cx('nova-spinner', `nova-spinner--${size}`, className)} {...a11y} {...rest}>
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}
