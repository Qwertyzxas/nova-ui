import type { Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import '../src/styles/base.css';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.novaTheme = context.globals.theme as string;
      return (
        <div className="nova-root sb-canvas">
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    // fail the a11y panel on any violation instead of only warning
    a11y: { test: 'error' },
    options: {
      storySort: { order: ['Введение', 'Токены', 'Компоненты', 'Примеры'] },
    },
  },
  tags: ['autodocs'],
};

export default preview;
