import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/docs/*.mdx', '../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  // the project's vite.config.ts builds a library; the docs site is a normal app
  viteFinal(config) {
    if (config.build) {
      delete config.build.lib;
      delete config.build.rollupOptions;
    }
    return config;
  },
};

export default config;
