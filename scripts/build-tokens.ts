// Regenerates src/styles/tokens.css from the TypeScript tokens.
// Runs on Node's built-in type stripping: `npm run tokens`.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderTokensCss } from '../src/tokens/css.ts';

const target = resolve(import.meta.dirname, '../src/styles/tokens.css');
writeFileSync(target, renderTokensCss());
console.log(`tokens → ${target}`);
