/**
 * Design tokens — the single source of truth. `scripts/build-tokens.ts` turns
 * them into CSS custom properties (src/styles/tokens.css); a test keeps the two
 * in sync and checks WCAG contrast of the key colour pairs in both themes.
 */

export const colorTokens = {
  light: {
    bg: '#ffffff',
    'bg-subtle': '#f6f7f9',
    surface: '#ffffff',
    'surface-raised': '#ffffff',
    border: '#e3e5ea',
    // control boundaries (inputs, checkboxes) must reach 3:1 — WCAG 1.4.11
    'border-strong': '#858c9c',
    text: '#14161c',
    'text-muted': '#5b6170',
    'text-subtle': '#8a90a0',
    accent: '#4b5cf0',
    'accent-hover': '#3d4bd8',
    'accent-soft': '#eceffe',
    'accent-fg': '#3d4bd8',
    'on-accent': '#ffffff',
    danger: '#d92d3a',
    'danger-soft': '#fdecee',
    'danger-fg': '#b4232f',
    'on-danger': '#ffffff',
    success: '#15803d',
    'success-soft': '#e8f6ee',
    'success-fg': '#15803d',
    'warning-soft': '#fff4e0',
    'warning-fg': '#8f5400',
    'focus-ring': '#4b5cf0',
    overlay: 'rgba(15, 17, 23, 0.5)',
  },
  dark: {
    bg: '#0e1015',
    'bg-subtle': '#14171e',
    surface: '#171a22',
    'surface-raised': '#1d212b',
    border: '#2a2f3b',
    'border-strong': '#646b7e',
    text: '#eef0f5',
    'text-muted': '#9aa1b2',
    'text-subtle': '#6b7284',
    accent: '#7b8bff',
    'accent-hover': '#93a0ff',
    'accent-soft': '#1f2340',
    'accent-fg': '#9aa6ff',
    'on-accent': '#0e1015',
    danger: '#ff6b78',
    'danger-soft': '#3a1a20',
    'danger-fg': '#ff8a94',
    'on-danger': '#0e1015',
    success: '#4ade80',
    'success-soft': '#13301f',
    'success-fg': '#5be38f',
    'warning-soft': '#33260f',
    'warning-fg': '#fbbf5a',
    'focus-ring': '#93a0ff',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
} as const;

export type ColorToken = keyof (typeof colorTokens)['light'];

export const shadowTokens = {
  light: {
    sm: '0 1px 2px rgba(16, 18, 27, 0.06)',
    md: '0 4px 12px -2px rgba(16, 18, 27, 0.1), 0 2px 4px -2px rgba(16, 18, 27, 0.06)',
    lg: '0 20px 48px -12px rgba(16, 18, 27, 0.25), 0 0 0 1px rgba(16, 18, 27, 0.04)',
  },
  dark: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
    md: '0 6px 16px -4px rgba(0, 0, 0, 0.5)',
    lg: '0 24px 56px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06)',
  },
} as const;

/** Theme-independent tokens. */
export const scaleTokens = {
  space: { 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', 8: '32px', 10: '40px' },
  radius: { sm: '6px', md: '8px', lg: '12px', full: '9999px' },
  font: {
    sans: "'Inter', -apple-system, 'Segoe UI', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace",
  },
  'font-size': { xs: '12px', sm: '13px', md: '14px', lg: '16px', xl: '20px', '2xl': '24px' },
  'line-height': { tight: '1.25', normal: '1.5' },
  duration: { fast: '120ms', normal: '200ms', slow: '320ms' },
  easing: { standard: 'cubic-bezier(0.2, 0, 0, 1)', emphasized: 'cubic-bezier(0.3, 0, 0, 1.2)' },
  z: { overlay: '1000', toast: '1100', tooltip: '1200' },
} as const;

/** `var(--nova-color-accent)` etc. — typed helpers for consumers writing CSS-in-JS. */
export const cssVar = {
  color: (name: ColorToken) => `var(--nova-color-${name})`,
  space: (step: keyof typeof scaleTokens.space) => `var(--nova-space-${step})`,
  radius: (size: keyof typeof scaleTokens.radius) => `var(--nova-radius-${size})`,
};
