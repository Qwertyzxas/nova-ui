import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { cx } from './cx';
import { useControllableState } from './useControllableState';

describe('cx', () => {
  it('joins truthy class names', () => {
    expect(cx('a', false, 'b', undefined, null, '')).toBe('a b');
  });
});

describe('useControllableState', () => {
  it('works uncontrolled and notifies on change', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }));
    act(() => result.current[1](2));
    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('never changes a controlled value on its own', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(({ value }) => useControllableState({ value, defaultValue: 0, onChange }), {
      initialProps: { value: 5 },
    });
    act(() => result.current[1](6));
    expect(result.current[0]).toBe(5);
    expect(onChange).toHaveBeenCalledWith(6);
    rerender({ value: 6 });
    expect(result.current[0]).toBe(6);
  });

  it('supports updater functions and skips no-op updates', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }));
    act(() => result.current[1]((n) => n + 1));
    act(() => result.current[1](2));
    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
