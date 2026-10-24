import { useEffect, useId, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import './Checkbox.css';

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  label: ReactNode;
  description?: ReactNode;
  /** "Some selected" state; screen readers announce it as mixed. */
  indeterminate?: boolean;
}

/** A native checkbox (free keyboard, form and a11y behaviour) with a custom look. */
export function Checkbox({ label, description, indeterminate = false, className, id: idProp, ref, ...rest }: CheckboxProps) {
  const autoId = useId();
  const id = idProp ?? `nova-checkbox-${autoId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const inner = useRef<HTMLInputElement>(null);

  // `indeterminate` exists only as a DOM property, not as an attribute
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={cx('nova-check', className)}>
      <span className="nova-check__box">
        <input
          ref={mergeRefs(inner, ref)}
          id={id}
          type="checkbox"
          className="nova-check__input"
          aria-describedby={descriptionId}
          {...rest}
        />
        <svg className="nova-check__mark" viewBox="0 0 16 16" aria-hidden="true">
          <path className="nova-check__tick" d="m3.5 8.5 3 3 6-7" />
          <path className="nova-check__dash" d="M4 8h8" />
        </svg>
      </span>
      <span className="nova-check__text">
        <label htmlFor={id} className="nova-check__label">
          {label}
        </label>
        {description && (
          <span id={descriptionId} className="nova-check__description">
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
