import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Nova UI',
    brandUrl: 'https://github.com/Qwertyzxas/nova-ui',
    colorPrimary: '#4b5cf0',
    colorSecondary: '#4b5cf0',
    fontBase: "'Inter', -apple-system, 'Segoe UI', system-ui, sans-serif",
  }),
});
