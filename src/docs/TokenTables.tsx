import { contrast } from '../tokens/contrast';
import { colorTokens, scaleTokens, type ColorToken } from '../tokens/tokens';

const TEXT_ON: Partial<Record<ColorToken, ColorToken>> = {
  text: 'bg',
  'text-muted': 'bg',
  'accent-fg': 'surface',
  'on-accent': 'accent',
  'on-danger': 'danger',
  'danger-fg': 'danger-soft',
  'success-fg': 'success-soft',
  'warning-fg': 'warning-soft',
};

const cell = { padding: '8px 12px', borderBottom: '1px solid var(--nova-color-border)', textAlign: 'left' as const };

/** Colour tokens of both themes, generated from tokens.ts, with WCAG contrast for text pairs. */
export function ColorTable() {
  const names = Object.keys(colorTokens.light) as ColorToken[];
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
      <thead>
        <tr>
          <th style={cell}>Токен</th>
          <th style={cell}>Светлая</th>
          <th style={cell}>Тёмная</th>
          <th style={cell}>Контраст (свет / тьма)</th>
        </tr>
      </thead>
      <tbody>
        {names.map((name) => {
          const pair = TEXT_ON[name];
          return (
            <tr key={name}>
              <td style={cell}>
                <code>--nova-color-{name}</code>
              </td>
              {(['light', 'dark'] as const).map((theme) => (
                <td key={theme} style={cell}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: colorTokens[theme][name],
                        boxShadow: 'inset 0 0 0 1px rgba(127,127,127,.35)',
                      }}
                    />
                    <code>{colorTokens[theme][name]}</code>
                  </span>
                </td>
              ))}
              <td style={cell}>
                {pair
                  ? (['light', 'dark'] as const)
                      .map((theme) => `${contrast(colorTokens[theme][name], colorTokens[theme][pair]).toFixed(1)}:1`)
                      .join(' / ') + ` на ${pair}`
                  : '—'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function ScaleTable() {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
      <tbody>
        {Object.entries(scaleTokens).flatMap(([group, values]) =>
          Object.entries(values).map(([key, value]) => (
            <tr key={`${group}-${key}`}>
              <td style={cell}>
                <code>
                  --nova-{group}-{key}
                </code>
              </td>
              <td style={cell}>
                <code>{String(value)}</code>
              </td>
              <td style={cell}>
                {group === 'space' && <span style={{ display: 'block', width: value, height: 8, borderRadius: 2, background: 'var(--nova-color-accent)' }} />}
                {group === 'radius' && (
                  <span style={{ display: 'block', width: 40, height: 28, borderRadius: value, border: '2px solid var(--nova-color-accent)' }} />
                )}
              </td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  );
}
