import { createContext, useContext, useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import './Accordion.css';

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  headingLevel: 2 | 3 | 4 | 5 | 6;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

type SingleProps = {
  type?: 'single';
  collapsible?: boolean;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};

type MultipleProps = {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AccordionProps = (SingleProps | MultipleProps) & {
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: ReactNode;
};

export function Accordion(props: AccordionProps) {
  const { headingLevel = 3, className, children } = props;
  const multiple = props.type === 'multiple';

  const [open, setOpen] = useControllableState<string[]>({
    value: multiple ? props.value : props.value === undefined ? undefined : props.value === null ? [] : [props.value],
    defaultValue: multiple ? (props.defaultValue ?? []) : props.defaultValue ? [props.defaultValue] : [],
    onChange: (next) => {
      if (props.type === 'multiple') props.onValueChange?.(next);
      else props.onValueChange?.(next[0] ?? null);
    },
  });

  const toggle = (value: string) => {
    const isOpen = open.includes(value);
    if (multiple) setOpen(isOpen ? open.filter((v) => v !== value) : [...open, value]);
    else if (!isOpen) setOpen([value]);
    else if ((props as SingleProps).collapsible !== false) setOpen([]);
  };

  return (
    <AccordionContext.Provider value={{ isOpen: (v) => open.includes(v), toggle, headingLevel }}>
      <div className={cx('nova-accordion', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  title: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

export function AccordionItem({ value, title, children, disabled }: AccordionItemProps) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('<AccordionItem> must be used inside <Accordion>');
  const id = useId();
  const open = ctx.isOpen(value);
  const Heading = `h${ctx.headingLevel}` as const;

  return (
    <div className={cx('nova-accordion__item', open && 'is-open')}>
      <Heading className="nova-accordion__heading">
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          disabled={disabled}
          className="nova-accordion__trigger nova-focusable"
          onClick={() => ctx.toggle(value)}
        >
          <span>{title}</span>
          <svg className="nova-accordion__chevron" viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
      </Heading>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} hidden={!open} className="nova-accordion__panel">
        {children}
      </div>
    </div>
  );
}
