import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './Button';

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

const meta = {
  title: 'Компоненты/Button',
  component: Button,
  args: { children: 'Сохранить', variant: 'solid', tone: 'accent', size: 'md' },
  argTypes: {
    iconStart: { control: false },
    iconEnd: { control: false },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    loading: {
      description:
        "Shows a spinner and ignores clicks while keeping the button focusable and its\nwidth stable (it uses `aria-disabled`, not `disabled`, so focus isn't lost).",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['accent', 'neutral', 'danger'] as const).map((tone) => (
        <div key={tone} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['solid', 'soft', 'outline', 'ghost'] as const).map((variant) => (
            <Button key={variant} {...args} tone={tone} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { iconStart: <PlusIcon />, children: 'Новая задача' },
};

export const Loading: Story = {
  parameters: {
    docs: { description: { story: '`loading` keeps the button focusable and its width stable; clicks are ignored.' } },
  },
  render: function Render(args) {
    const [loading, setLoading] = useState(false);
    return (
      <Button
        {...args}
        loading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1500);
        }}
      >
        Отправить
      </Button>
    );
  },
};

export const Disabled: Story = { args: { disabled: true } };
