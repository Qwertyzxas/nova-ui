import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Avatar, initials } from './Avatar/Avatar';
import { Badge } from './Badge/Badge';
import { Button } from './Button/Button';
import { Spinner } from './Spinner/Spinner';

describe('Button', () => {
  it('is a real button that defaults to type="button"', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ignores clicks while loading but stays focusable and announces busy', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toBeDisabled();
    button.focus();
    expect(button).toHaveFocus();
  });

  it('passes refs and native props through', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref} type="submit" variant="outline" tone="danger" data-testid="b">Delete</Button>);
    expect(ref.current).toBe(screen.getByTestId('b'));
    expect(ref.current).toHaveAttribute('type', 'submit');
    expect(ref.current).toHaveClass('nova-button--outline', 'nova-button--danger');
  });

  it('hides decorative icons from assistive tech', () => {
    render(<Button iconStart={<svg data-testid="icon" />}>Add</Button>);
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button')).toHaveAccessibleName('Add');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Button>One</Button>
        <Button loading>Two</Button>
        <Button disabled>Three</Button>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Spinner', () => {
  it('announces a label or stays silent when decorative', () => {
    const { rerender } = render(<Spinner label="Saving" />);
    expect(screen.getByRole('status', { name: 'Saving' })).toBeInTheDocument();
    rerender(<Spinner label={null} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('Badge', () => {
  it('renders text with a tone class', async () => {
    const { container } = render(<Badge tone="success" dot>Active</Badge>);
    expect(screen.getByText('Active')).toHaveClass('nova-badge--success');
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Avatar', () => {
  it('computes initials', () => {
    expect(initials('Ada Lovelace')).toBe('AL');
    expect(initials('  Тимур ')).toBe('Т');
    expect(initials('Jean Claude Van Damme')).toBe('JC');
  });

  it('falls back to initials when the image fails', async () => {
    const { container } = render(<Avatar name="Ada Lovelace" src="broken.png" />);
    const img = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(img.tagName).toBe('IMG');
    fireEvent.error(img);
    const fallback = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(fallback.tagName).toBe('SPAN');
    expect(fallback).toHaveTextContent('AL');
    expect(await axe(container)).toHaveNoViolations();
  });
});
