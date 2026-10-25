import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { TextField, type TextFieldProps } from './TextField';

// TextFieldProps is an input | textarea union, which Storybook can't turn into
// controls; the stories use one flat argument shape instead
type FieldArgs = Omit<Extract<TextFieldProps, { multiline?: false }>, 'multiline'> & { multiline?: boolean; rows?: number };
const Field = TextField as unknown as ComponentType<FieldArgs>;

const meta = {
  title: 'Компоненты/TextField',
  component: Field,
  args: { label: 'Email', placeholder: 'you@example.com', description: 'Мы не передаём адрес третьим лицам.' },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithError: Story = {
  args: { defaultValue: 'not-an-email', error: 'Введите адрес в формате name@example.com', required: true },
};

export const Adornments: Story = {
  args: { label: 'Цена', prefix: '₽', suffix: '/мес', placeholder: '0', inputMode: 'numeric', description: undefined },
};

export const Multiline: Story = {
  args: { label: 'О себе', multiline: true, rows: 4, placeholder: 'Пара слов о вашем опыте', description: 'До 500 символов.' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Field {...args} size="sm" label="Small" />
      <Field {...args} size="md" label="Medium" />
      <Field {...args} size="lg" label="Large" />
    </div>
  ),
};

/** The label stays available to screen readers even when it is not shown. */
export const HiddenLabel: Story = { args: { label: 'Поиск', hideLabel: true, placeholder: 'Поиск…', description: undefined } };
