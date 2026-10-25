import { createContext, useContext, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import './Tabs.css';

interface TabsContextValue {
  value: string;
  select: (value: string) => void;
  baseId: string;
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Tabs>`);
  return ctx;
}

const tabId = (base: string, value: string) => `${base}-tab-${value}`;
const panelId = (base: string, value: string) => `${base}-panel-${value}`;

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children: ReactNode;
}

export function Tabs({ defaultValue, value: valueProp, onValueChange, orientation = 'horizontal', className, children }: TabsProps) {
  const baseId = useId();
  const [value, select] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  return (
    <TabsContext.Provider value={{ value, select, baseId, orientation }}>
      <div className={cx('nova-tabs', `nova-tabs--${orientation}`, className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  'aria-label': string;
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className, ...rest }: TabListProps) {
  const { orientation, select } = useTabs('TabList');
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [])];
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    const [prev, next] = orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    const target =
      event.key === next ? tabs[(index + 1) % tabs.length]
      : event.key === prev ? tabs[(index - 1 + tabs.length) % tabs.length]
      : event.key === 'Home' ? tabs[0]
      : event.key === 'End' ? tabs.at(-1)
      : undefined;
    if (!target) return;
    event.preventDefault();
    target.focus();
    select(target.dataset.value!);
  };

  return (
    <div ref={ref} role="tablist" aria-orientation={orientation} className={cx('nova-tabs__list', className)} onKeyDown={onKeyDown} {...rest}>
      {children}
    </div>
  );
}

export interface TabProps {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

export function Tab({ value, disabled, children }: TabProps) {
  const ctx = useTabs('Tab');
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={tabId(ctx.baseId, value)}
      aria-selected={selected}
      aria-controls={panelId(ctx.baseId, value)}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-value={value}
      className="nova-tabs__tab nova-focusable"
      onClick={() => ctx.select(value)}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const ctx = useTabs('TabPanel');
  return (
    <div
      role="tabpanel"
      id={panelId(ctx.baseId, value)}
      aria-labelledby={tabId(ctx.baseId, value)}
      hidden={ctx.value !== value}
      tabIndex={0}
      className={cx('nova-tabs__panel nova-focusable', className)}
    >
      {children}
    </div>
  );
}
