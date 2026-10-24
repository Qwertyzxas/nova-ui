import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select } from './Select';

const cities = [
  { value: 'msk', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'kzn', label: 'Казань' },
  { value: 'ekb', label: 'Екатеринбург', disabled: true },
  { value: 'nsk', label: 'Новосибирск' },
  { value: 'nn', label: 'Нижний Новгород' },
  { value: 'sam', label: 'Самара' },
  { value: 'krd', label: 'Краснодар' },
  { value: 'vlad', label: 'Владивосток' },
];

/**
 * Select-only combobox по WAI-ARIA APG. Клавиатура: ↑ ↓ Home End — навигация,
 * Enter / Пробел / Tab — выбрать, Esc — закрыть, буквы — поиск по началу названия.
 */
const meta = {
  title: 'Компоненты/Select',
  component: Select,
  args: { label: 'Город', options: cities, placeholder: 'Выберите город' },
  decorators: [(Story) => <div style={{ maxWidth: 320, minHeight: 340 }}><Story /></div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('kzn');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Select {...args} value={value} onValueChange={setValue} />
        <span style={{ color: 'var(--nova-color-text-muted)' }}>value: {value}</span>
      </div>
    );
  },
};

export const WithError: Story = {
  args: { error: 'Выберите город доставки', description: 'Доставка 1–3 дня' },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: 'msk' } };
