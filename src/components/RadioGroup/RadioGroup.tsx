import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import '../Checkbox/Checkbox.css';
import './RadioGroup.css';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label: ReactNode;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Form field name; generated when omitted. */
  name?: string;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
}

/** Native radios inside a fieldset: arrow keys, form submission and a11y come for free. */
export function RadioGroup({
  label,
  options,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  name,
  orientation = 'vertical',
  disabled,
  className,
}: RadioGroupProps) {
  const autoId = useId();
  const groupName = name ?? `nova-radio-${autoId}`;
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });

  return (
    <fieldset className={cx('nova-radio-group', `nova-radio-group--${orientation}`, className)} disabled={disabled}>
      <legend className="nova-radio-group__legend">{label}</legend>
      <div className="nova-radio-group__items">
        {options.map((option) => {
          const id = `${groupName}-${option.value}`;
          const descriptionId = option.description ? `${id}-description` : undefined;
          return (
            <div key={option.value} className="nova-check">
              <span className="nova-check__box">
                <input
                  type="radio"
                  id={id}
                  name={groupName}
                  value={option.value}
                  checked={value === option.value}
                  disabled={option.disabled}
                  onChange={() => setValue(option.value)}
                  aria-describedby={descriptionId}
                  className="nova-check__input"
                />
              </span>
              <span className="nova-check__text">
                <label htmlFor={id} className="nova-check__label">
                  {option.label}
                </label>
                {option.description && (
                  <span id={descriptionId} className="nova-check__description">
                    {option.description}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
