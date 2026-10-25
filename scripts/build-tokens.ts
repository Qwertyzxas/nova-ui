import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderTokensCss } from '../src/tokens/css.ts';

const target = resolve(import.meta.dirname, '../src/styles/tokens.css');
writeFileSync(target, renderTokensCss());
console.log(`tokens → ${target}`);
