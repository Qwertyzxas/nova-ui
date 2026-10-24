import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import './Switch.css';

export interface SwitchProps extends Omit<ComponentPropsWithRef<'button'>, 'onChange' | 'value' | 'defaultValue'> {
  label: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/** An on/off setting that takes effect immediately (WAI-ARIA switch pattern). */
export function Switch({
  label,
  description,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  className,
  id: idProp,
  onClick,
  ...rest
}: SwitchProps) {
  const autoId = useId();
  const id = idProp ?? `nova-switch-${autoId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const [checked, setChecked] = useControllableState({ value: checkedProp, defaultValue: defaultChecked, onChange: onCheckedChange });

  return (
    <div className={cx('nova-switch', className)}>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-describedby={descriptionId}
        className="nova-switch__track nova-focusable"
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setChecked(!checked);
        }}
        {...rest}
      >
        <span className="nova-switch__thumb" />
      </button>
      <span className="nova-switch__text">
        <label htmlFor={id} className="nova-switch__label">
          {label}
        </label>
        {description && (
          <span id={descriptionId} className="nova-switch__description">
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
