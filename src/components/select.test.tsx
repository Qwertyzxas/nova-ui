import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Select } from './Select/Select';

const countries = [
  { value: 'am', label: 'Armenia' },
  { value: 'by', label: 'Belarus' },
  { value: 'br', label: 'Brazil' },
  { value: 'bg', label: 'Bulgaria', disabled: true },
  { value: 'ca', label: 'Canada' },
  { value: 'kz', label: 'Kazakhstan' },
];

function setup(props: Partial<Parameters<typeof Select>[0]> = {}) {
  const onValueChange = vi.fn();
  const user = userEvent.setup();
  const utils = render(<Select label="Country" options={countries} onValueChange={onValueChange} {...props} />);
  const trigger = screen.getByRole('combobox', { name: 'Country' });
  const listbox = () => screen.getByRole('listbox', { hidden: true });
  const active = () => {
    const id = trigger.getAttribute('aria-activedescendant');
    return id ? document.getElementById(id)?.textContent : null;
  };
  return { ...utils, user, trigger, listbox, active, onValueChange };
}

describe('Select', () => {
  it('is a labelled collapsed combobox showing the placeholder', () => {
    const { trigger, listbox } = setup({ placeholder: 'Choose a country' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveTextContent('Choose a country');
    expect(listbox()).not.toBeVisible();
    expect(trigger).toHaveAttribute('aria-controls', listbox().id);
  });

  it('announces an option hint as its description, not part of its name', async () => {
    const options = countries.map((o) => (o.value === 'bg' ? { ...o, hint: 'Not shipping yet' } : o));
    const { user, trigger } = setup({ options });
    await user.click(trigger);
    const option = screen.getByRole('option', { name: 'Bulgaria' });
    expect(option).toHaveAccessibleDescription('Not shipping yet');
    expect(option).toHaveAttribute('aria-disabled', 'true');
  });

  it('opens with the mouse and selects an option', async () => {
    const { user, trigger, onValueChange } = setup();
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('option', { name: 'Canada' }));
    expect(onValueChange).toHaveBeenCalledWith('ca');
    expect(trigger).toHaveTextContent('Canada');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('is fully operable with the keyboard and skips disabled options', async () => {
    const { user, trigger, active, onValueChange } = setup();
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(active()).toBe('Armenia');
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(active()).toBe('Canada'); // Bulgaria is disabled
    await user.keyboard('{End}');
    expect(active()).toBe('Kazakhstan');
    await user.keyboard('{ArrowDown}');
    expect(active()).toBe('Kazakhstan'); // stays at the end
    await user.keyboard('{Home}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('am');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('reopens on the current value and closes with Escape without changing it', async () => {
    const { user, trigger, active, onValueChange } = setup({ defaultValue: 'ca' });
    trigger.focus();
    await user.keyboard('{ArrowUp}');
    expect(active()).toBe('Canada');
    await user.keyboard('{ArrowUp}{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveTextContent('Canada');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('supports type-to-select', async () => {
    const { user, trigger, active } = setup();
    trigger.focus();
    await user.keyboard('b');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(active()).toBe('Belarus');
    await user.keyboard('b');
    expect(active()).toBe('Brazil'); // repeated letter cycles (Bulgaria is disabled)
    await user.keyboard('{Escape}');
  });

  it('commits the highlighted option on Tab', async () => {
    const { user, trigger, onValueChange } = setup();
    trigger.focus();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    await user.tab();
    expect(onValueChange).toHaveBeenCalledWith('by');
    expect(trigger).not.toHaveFocus();
  });

  it('closes on an outside click and submits through a hidden input', async () => {
    const { user, trigger, container } = setup({ name: 'country', defaultValue: 'kz' });
    await user.click(trigger);
    await user.click(document.body);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('kz');
  });

  it('links description and error, and has no axe violations open or closed', async () => {
    const { user, trigger, container } = setup({ description: 'Where you live', error: 'Required' });
    expect(trigger).toHaveAccessibleDescription('Where you live Required');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(await axe(container)).toHaveNoViolations();
    await user.click(trigger);
    expect(await axe(container)).toHaveNoViolations();
  });
});
