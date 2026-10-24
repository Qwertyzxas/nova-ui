import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Accordion, AccordionItem } from './Accordion/Accordion';
import { Button } from './Button/Button';
import { Dialog } from './Dialog/Dialog';
import { Tab, TabList, TabPanel, Tabs } from './Tabs/Tabs';
import { ToastProvider, useToast } from './Toast/Toast';
import { computeTooltipPosition, Tooltip } from './Tooltip/Tooltip';

describe('Tabs', () => {
  function Example({ onValueChange }: { onValueChange?: (v: string) => void }) {
    return (
      <Tabs defaultValue="account" onValueChange={onValueChange}>
        <TabList aria-label="Settings">
          <Tab value="account">Account</Tab>
          <Tab value="billing" disabled>
            Billing
          </Tab>
          <Tab value="team">Team</Tab>
        </TabList>
        <TabPanel value="account">Account panel</TabPanel>
        <TabPanel value="billing">Billing panel</TabPanel>
        <TabPanel value="team">Team panel</TabPanel>
      </Tabs>
    );
  }

  it('wires tabs to panels with a roving tabindex', async () => {
    const { container } = render(<Example />);
    const account = screen.getByRole('tab', { name: 'Account' });
    expect(account).toHaveAttribute('aria-selected', 'true');
    expect(account).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Team' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tabpanel', { name: 'Account' })).toHaveTextContent('Account panel');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('moves with arrow keys, skipping disabled tabs, and wraps', async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    screen.getByRole('tab', { name: 'Account' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Team' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Team panel');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(onValueChange).toHaveBeenLastCalledWith('team');
  });
});

describe('Accordion', () => {
  it('toggles one item at a time in single mode', async () => {
    const { container } = render(
      <Accordion defaultValue="a">
        <AccordionItem value="a" title="Shipping">
          Ships in 2 days
        </AccordionItem>
        <AccordionItem value="b" title="Returns">
          30-day returns
        </AccordionItem>
      </Accordion>,
    );
    const shipping = screen.getByRole('button', { name: 'Shipping' });
    const returns = screen.getByRole('button', { name: 'Returns' });
    expect(shipping).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Shipping' })).toBeVisible();
    await userEvent.click(returns);
    expect(returns).toHaveAttribute('aria-expanded', 'true');
    expect(shipping).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('heading', { level: 3, name: 'Returns' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps several open in multiple mode and reports values', async () => {
    const onValueChange = vi.fn();
    render(
      <Accordion type="multiple" onValueChange={onValueChange}>
        <AccordionItem value="a" title="One">
          1
        </AccordionItem>
        <AccordionItem value="b" title="Two">
          2
        </AccordionItem>
      </Accordion>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'One' }));
    await userEvent.click(screen.getByRole('button', { name: 'Two' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b']);
  });

  it('can forbid collapsing the open item', async () => {
    render(
      <Accordion defaultValue="a" collapsible={false}>
        <AccordionItem value="a" title="Always one">
          x
        </AccordionItem>
      </Accordion>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Always one' }));
    expect(screen.getByRole('button', { name: 'Always one' })).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('Dialog', () => {
  function Example() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Delete project</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Delete project?"
          description="This can't be undone."
          footer={<Button onClick={() => setOpen(false)}>Cancel</Button>}
        >
          Body
        </Dialog>
      </>
    );
  }

  it('opens as a labelled modal and closes with Escape, the close button or the backdrop', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete project?' });
    expect(dialog).toHaveAccessibleDescription("This can't be undone.");
    expect(document.documentElement.style.overflow).toBe('hidden');

    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.documentElement.style.overflow).toBe('');

    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    fireEvent.click(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no axe violations when open', async () => {
    const { container } = render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Tooltip', () => {
  afterEach(() => vi.useRealTimers());

  it('describes its trigger and shows on keyboard focus, hides on Escape', async () => {
    render(
      <Tooltip content="Copy to clipboard">
        <button type="button">Copy</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Copy' });
    expect(trigger).toHaveAccessibleDescription('Copy to clipboard');
    expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();

    await userEvent.tab();
    expect(screen.getByRole('tooltip')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();
  });

  it('shows on hover after the delay', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hint" delay={300}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    fireEvent.pointerEnter(screen.getByRole('button').parentElement!);
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();
    act(() => vi.advanceTimersByTime(150));
    expect(screen.getByRole('tooltip')).toBeVisible();
  });

  it('flips below and stays on screen when there is no room', () => {
    const viewport = { width: 400, height: 800 };
    const tip = { width: 120, height: 30 };
    expect(computeTooltipPosition({ top: 200, bottom: 230, left: 100, width: 80 }, tip, viewport, 'top')).toEqual({
      top: 162,
      left: 80,
      side: 'top',
    });
    expect(computeTooltipPosition({ top: 10, bottom: 40, left: 0, width: 40 }, tip, viewport, 'top')).toMatchObject({
      top: 48,
      left: 8,
      side: 'bottom',
    });
    expect(computeTooltipPosition({ top: 10, bottom: 40, left: 380, width: 20 }, tip, viewport, 'bottom').left).toBe(272);
  });
});

describe('Toast', () => {
  afterEach(() => vi.useRealTimers());

  function Trigger(props: { duration?: number }) {
    const { toast } = useToast();
    return (
      <Button
        onClick={() => toast({ title: 'Saved', description: 'All changes stored', duration: props.duration, action: { label: 'Undo', onClick: () => {} } })}
      >
        Save
      </Button>
    );
  }

  it('announces toasts in a live region and dismisses them', async () => {
    const { container } = render(
      <ToastProvider>
        <Trigger duration={Infinity} />
      </ToastProvider>,
    );
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region.querySelector('[aria-live="polite"]')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('auto-dismisses, but pauses while hovered', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger duration={1000} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    const region = screen.getByRole('region', { name: 'Notifications' });
    act(() => vi.advanceTimersByTime(600));
    fireEvent.pointerEnter(region);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    fireEvent.pointerLeave(region);
    act(() => vi.advanceTimersByTime(399));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('keeps at most `max` toasts', () => {
    render(
      <ToastProvider max={2}>
        <Trigger duration={Infinity} />
      </ToastProvider>,
    );
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getAllByText('Saved')).toHaveLength(2);
  });
});
