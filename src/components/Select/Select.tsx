import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import '../TextField/TextField.css';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: ReactNode;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  description?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  name?: string;
  hideLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

const TYPEAHEAD_RESET_MS = 500;

export function Select({
  label,
  options,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  placeholder = 'Select…',
  description,
  error,
  disabled,
  name,
  hideLabel,
  size = 'md',
  className,
  id: idProp,
}: SelectProps) {
  const autoId = useId();
  const id = idProp ?? `nova-select-${autoId}`;
  const ids = {
    label: `${id}-label`,
    listbox: `${id}-listbox`,
    description: description ? `${id}-description` : undefined,
    error: error ? `${id}-error` : undefined,
    option: (index: number) => `${id}-option-${index}`,
    hint: (index: number) => `${id}-hint-${index}`,
  };

  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: '', timer: 0 });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];
  const enabled = (i: number) => !!options[i] && !options[i].disabled;
  const firstEnabled = () => options.findIndex((_, i) => enabled(i));
  const lastEnabled = () => options.findLastIndex((_, i) => enabled(i));

  const step = (from: number, delta: 1 | -1) => {
    for (let i = from + delta; i >= 0 && i < options.length; i += delta) if (enabled(i)) return i;
    return from;
  };

  const show = (index: number) => {
    setOpen(true);
    setActive(index);
  };

  const commit = (index: number) => {
    if (!enabled(index)) return;
    setValue(options[index]!.value);
    setOpen(false);
  };

  const search = (char: string, from: number) => {
    const t = typeahead.current;
    window.clearTimeout(t.timer);
    t.text += char.toLowerCase();
    t.timer = window.setTimeout(() => (t.text = ''), TYPEAHEAD_RESET_MS);
    const repeated = t.text.length > 1 && [...t.text].every((c) => c === t.text[0]);
    const query = repeated ? t.text[0]! : t.text;
    const start = repeated || t.text.length === 1 ? from + 1 : from;
    for (let n = 0; n < options.length; n++) {
      const i = (start + n) % options.length;
      if (enabled(i) && options[i]!.label.toLowerCase().startsWith(query)) return i;
    }
    return -1;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const key = event.key;
    const printable = key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

    if (!open) {
      const initial = selectedIndex >= 0 ? selectedIndex : -1;
      if (['ArrowDown', 'Enter', ' '].includes(key)) show(initial >= 0 ? initial : firstEnabled());
      else if (key === 'ArrowUp') show(initial >= 0 ? initial : lastEnabled());
      else if (key === 'Home') show(firstEnabled());
      else if (key === 'End') show(lastEnabled());
      else if (printable) {
        const match = search(key, initial);
        show(match >= 0 ? match : initial);
      } else return;
      event.preventDefault();
      return;
    }

    switch (key) {
      case 'ArrowDown':
        setActive((a) => step(a, 1));
        break;
      case 'ArrowUp':
        setActive((a) => step(a, -1));
        break;
      case 'Home':
        setActive(firstEnabled());
        break;
      case 'End':
        setActive(lastEnabled());
        break;
      case 'Enter':
        commit(active);
        break;
      case ' ':
        if (typeahead.current.text) {
          const match = search(' ', active);
          if (match >= 0) setActive(match);
        } else commit(active);
        break;
      case 'Escape':
        setOpen(false);
        break;
      case 'Tab':
        if (enabled(active)) setValue(options[active]!.value);
        setOpen(false);
        return;
      default:
        if (!printable) return;
        {
          const match = search(key, active);
          if (match >= 0) setActive(match);
        }
    }
    event.preventDefault();
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open && active >= 0) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active, id]);

  const describedBy = [ids.description, ids.error].filter(Boolean).join(' ') || undefined;

  return (
    <div ref={rootRef} className={cx('nova-field', 'nova-select', `nova-field--${size}`, error ? 'is-invalid' : null, className)}>
      <span
        id={ids.label}
        className={cx('nova-field__label', hideLabel && 'nova-visually-hidden')}
        onClick={() => triggerRef.current?.focus()}
      >
        {label}
      </span>
      <div className="nova-select__anchor">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={ids.listbox}
          aria-labelledby={ids.label}
          aria-activedescendant={open && active >= 0 ? ids.option(active) : undefined}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          className="nova-field__box nova-select__trigger"
          onClick={() => (open ? setOpen(false) : show(selectedIndex >= 0 ? selectedIndex : firstEnabled()))}
          onKeyDown={onKeyDown}
        >
          <span className={cx('nova-select__value', !selected && 'is-placeholder')}>{selected ? selected.label : placeholder}</span>
          <svg className="nova-select__chevron" viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
        <ul ref={listRef} id={ids.listbox} role="listbox" aria-labelledby={ids.label} className="nova-select__list" hidden={!open}>
          {options.map((option, index) => (
            <li
              key={option.value}
              id={ids.option(index)}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              aria-describedby={option.hint ? ids.hint(index) : undefined}
              className={cx('nova-select__option', index === active && 'is-active')}
              onMouseDown={(e) => e.preventDefault()}
              onPointerMove={() => enabled(index) && setActive(index)}
              onClick={() => commit(index)}
            >
              <span className="nova-select__text">
                {option.label}
                {option.hint && (
                  <span id={ids.hint(index)} className="nova-select__hint" aria-hidden="true">
                    {option.hint}
                  </span>
                )}
              </span>
              {option.value === value && (
                <svg className="nova-select__check" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      </div>
      {name && <input type="hidden" name={name} value={value} />}
      {description && (
        <p id={ids.description} className="nova-field__description">
          {description}
        </p>
      )}
      {error && (
        <p id={ids.error} className="nova-field__error">
          {error}
        </p>
      )}
    </div>
  );
}
