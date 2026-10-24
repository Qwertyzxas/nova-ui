import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './TextField.css';

interface BaseProps {
  label: ReactNode;
  /** Help text under the field, linked via aria-describedby. */
  description?: ReactNode;
  /** Error message; also marks the field aria-invalid. */
  error?: ReactNode;
  /** Visually hide the label (it stays available to screen readers). */
  hideLabel?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

type InputProps = BaseProps & Omit<ComponentPropsWithRef<'input'>, 'size' | 'prefix'> & { multiline?: false };
type TextareaProps = BaseProps & Omit<ComponentPropsWithRef<'textarea'>, 'prefix'> & { multiline: true };
export type TextFieldProps = InputProps | TextareaProps;

export function TextField(props: TextFieldProps) {
  const { label, description, error, hideLabel, prefix, suffix, size = 'md', className, id: idProp, multiline, ...rest } = props;
  const autoId = useId();
  const id = idProp ?? `nova-field-${autoId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [rest['aria-describedby'], descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const shared = {
    id,
    className: 'nova-field__control',
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  };

  return (
    <div className={cx('nova-field', `nova-field--${size}`, error ? 'is-invalid' : null, className)}>
      <label htmlFor={id} className={cx('nova-field__label', hideLabel && 'nova-visually-hidden')}>
        {label}
        {rest.required && (
          <span className="nova-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className={cx('nova-field__box', multiline && 'nova-field__box--multiline')}>
        {prefix && <span className="nova-field__adornment">{prefix}</span>}
        {multiline ? (
          <textarea rows={3} {...(rest as ComponentPropsWithRef<'textarea'>)} {...shared} />
        ) : (
          <input type="text" {...(rest as ComponentPropsWithRef<'input'>)} {...shared} />
        )}
        {suffix && <span className="nova-field__adornment">{suffix}</span>}
      </div>
      {description && (
        <p id={descriptionId} className="nova-field__description">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="nova-field__error">
          {error}
        </p>
      )}
    </div>
  );
}
