import type { Preview } from '@storybook/react-vite';
import type { ArgTypesEnhancer, InputType } from 'storybook/internal/types';
import '../src/styles/tokens.css';
import '../src/styles/base.css';
import './preview.css';

// ReactNode props get an object control by default, and "Set object" passes `{}`,
// which React can't render. Edit them as plain text instead.
const reactNodeAsText: ArgTypesEnhancer = ({ argTypes }) =>
  Object.fromEntries(
    Object.entries(argTypes).map(([name, argType]: [string, InputType]) => {
      const type = argType.type;
      const isNode = typeof type === 'object' && type.name === 'other' && type.value === 'ReactNode';
      return [name, isNode && argType.control === undefined ? { ...argType, control: { type: 'text' } } : argType];
    }),
  );

const preview: Preview = {
  argTypesEnhancers: [reactNodeAsText],
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
