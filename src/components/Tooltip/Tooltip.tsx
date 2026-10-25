import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement<{ 'aria-describedby'?: string }>;
  placement?: 'top' | 'bottom';
  delay?: number;
}

const GAP = 8;
const EDGE = 8;
const HIDE_GRACE_MS = 120;

export function computeTooltipPosition(
  anchor: { top: number; bottom: number; left: number; width: number },
  tip: { width: number; height: number },
  viewport: { width: number; height: number },
  placement: 'top' | 'bottom',
) {
  const above = anchor.top - GAP - tip.height;
  const below = anchor.bottom + GAP;
  const fitsAbove = above >= EDGE;
  const fitsBelow = below + tip.height <= viewport.height - EDGE;
  const side = placement === 'top' ? (fitsAbove || !fitsBelow ? 'top' : 'bottom') : fitsBelow || !fitsAbove ? 'bottom' : 'top';
  const left = Math.min(Math.max(anchor.left + anchor.width / 2 - tip.width / 2, EDGE), viewport.width - tip.width - EDGE);
  return { top: side === 'top' ? above : below, left, side };
}

export function Tooltip({ content, children, placement = 'top', delay = 400 }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; side: string } | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => setMounted(true), []);

  const schedule = useCallback((next: boolean, ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), ms);
  }, []);
  const showNow = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hideNow = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(false);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hideNow();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, hideNow]);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const anchor = anchorRef.current?.getBoundingClientRect();
      const tip = tipRef.current?.getBoundingClientRect();
      if (anchor && tip) setPosition(computeTooltipPosition(anchor, tip, { width: window.innerWidth, height: window.innerHeight }, placement));
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, placement]);

  if (!isValidElement(children)) throw new Error('<Tooltip> expects a single element child');
  const describedBy = [children.props['aria-describedby'], id].filter(Boolean).join(' ');

  return (
    <>
      <span
        ref={anchorRef}
        className="nova-tooltip-anchor"
        onPointerEnter={() => schedule(true, delay)}
        onPointerLeave={() => schedule(false, HIDE_GRACE_MS)}
        onFocus={(e) => (e.target as HTMLElement).matches(':focus-visible') && showNow()}
        onBlur={hideNow}
      >
        {cloneElement(children, { 'aria-describedby': describedBy })}
      </span>
      {mounted &&
        createPortal(
          <div
            ref={tipRef}
            id={id}
            role="tooltip"
            className="nova-tooltip"
            data-side={position?.side}
            hidden={!open}
            style={position ? { top: position.top, left: position.left } : undefined}
            onPointerEnter={() => window.clearTimeout(timer.current)}
            onPointerLeave={() => schedule(false, HIDE_GRACE_MS)}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
