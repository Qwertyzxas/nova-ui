import { useCallback, useRef, useState } from 'react';

interface Options<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({ value, defaultValue, onChange }: Options<T>) {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const latest = useRef({ current, onChange, controlled });
  latest.current = { current, onChange, controlled };

  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    const { current: prev, onChange: notify, controlled: isControlled } = latest.current;
    const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
    if (Object.is(resolved, prev)) return;
    if (!isControlled) setInternal(resolved);
    notify?.(resolved);
  }, []);

  return [current, setValue] as const;
}
