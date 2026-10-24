import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import './Badge.css';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
  /** A small coloured dot before the text, e.g. for statuses. */
  dot?: boolean;
}

export function Badge({ tone = 'neutral', dot, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx('nova-badge', `nova-badge--${tone}`, className)} {...rest}>
      {dot && <span className="nova-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
