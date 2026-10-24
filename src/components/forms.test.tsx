import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Checkbox } from './Checkbox/Checkbox';
import { RadioGroup } from './RadioGroup/RadioGroup';
import { Switch } from './Switch/Switch';
import { TextField } from './TextField/TextField';

describe('TextField', () => {
  it('links label, description and error to the input', async () => {
    const { container } = render(
      <TextField label="Email" description="We never share it" error="Invalid email" required defaultValue="x" />,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toBeRequired();
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('We never share it Invalid email');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('works as a controlled input and as a textarea', async () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return <TextField label="Name" value={value} onChange={(e) => setValue(e.target.value.toUpperCase())} />;
    }
    render(
      <>
        <Controlled />
        <TextField label="Bio" multiline rows={4} />
      </>,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'ada');
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('ADA');
    expect(screen.getByRole('textbox', { name: 'Bio' }).tagName).toBe('TEXTAREA');
  });

  it('keeps a visually hidden label accessible', () => {
    render(<TextField label="Search" hideLabel />);
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
  });
});

describe('Checkbox', () => {
  it('toggles with the label and the keyboard', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Accept terms" onChange={onChange} />);
    const box = screen.getByRole('checkbox', { name: 'Accept terms' });
    await userEvent.click(screen.getByText('Accept terms'));
    expect(box).toBeChecked();
    box.focus();
    await userEvent.keyboard(' ');
    expect(box).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('exposes the indeterminate state as mixed', async () => {
    const { container } = render(<Checkbox label="Select all" indeterminate description="3 of 10 selected" />);
    const box = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
    expect(box).toBePartiallyChecked();
    expect(box).toHaveAccessibleDescription('3 of 10 selected');
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Switch', () => {
  it('is a switch that toggles by click, label and keyboard', async () => {
    const onCheckedChange = vi.fn();
    const { container } = render(<Switch label="Wi-Fi" description="Connect automatically" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
    await userEvent.click(screen.getByText('Wi-Fi'));
    expect(toggle).not.toBeChecked();
    toggle.focus();
    await userEvent.keyboard('{Enter}');
    expect(toggle).toBeChecked();
    expect(onCheckedChange.mock.calls).toEqual([[true], [false], [true]]);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('respects a controlled value', async () => {
    render(<Switch label="Locked" checked={false} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).not.toBeChecked();
  });
});

describe('RadioGroup', () => {
  const options = [
    { value: 'card', label: 'Card' },
    { value: 'cash', label: 'Cash', description: 'On delivery' },
    { value: 'crypto', label: 'Crypto', disabled: true },
  ];

  it('is a labelled group with arrow-key navigation', async () => {
    const onValueChange = vi.fn();
    const { container } = render(<RadioGroup label="Payment" options={options} defaultValue="card" onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'Payment' })).toBeInTheDocument();
    const card = screen.getByRole('radio', { name: 'Card' });
    expect(card).toBeChecked();
    card.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Cash' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('cash');
    expect(screen.getByRole('radio', { name: 'Crypto' })).toBeDisabled();
    expect(await axe(container)).toHaveNoViolations();
  });
});
