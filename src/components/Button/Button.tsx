import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Spinner } from '../Spinner/Spinner';
import './Button.css';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  tone?: 'accent' | 'neutral' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'solid',
  tone = 'accent',
  size = 'md',
  loading = false,
  iconStart,
  iconEnd,
  fullWidth,
  type = 'button',
  className,
  children,
  onClick,
  disabled,
  ...rest
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={type}
      className={cx(
        'nova-button',
        'nova-focusable',
        `nova-button--${variant}`,
        `nova-button--${tone}`,
        `nova-button--${size}`,
        fullWidth && 'nova-button--full',
        loading && 'is-loading',
        className,
      )}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      <span className="nova-button__content">
        {iconStart && <span className="nova-button__icon" aria-hidden="true">{iconStart}</span>}
        {children}
        {iconEnd && <span className="nova-button__icon" aria-hidden="true">{iconEnd}</span>}
      </span>
      {loading && <Spinner size="sm" label={null} className="nova-button__spinner" />}
    </button>
  );
}
