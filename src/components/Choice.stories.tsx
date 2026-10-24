import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './Checkbox/Checkbox';
import { RadioGroup } from './RadioGroup/RadioGroup';
import { Switch } from './Switch/Switch';

const meta = {
  title: 'Компоненты/Выбор',
  component: Checkbox,
  args: { label: 'Принимаю условия использования' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxPlayground: Story = { name: 'Checkbox' };

export const CheckboxWithDescription: Story = {
  name: 'Checkbox с описанием',
  args: { label: 'Еженедельная сводка', description: 'Письмо по понедельникам, можно отписаться в один клик.', defaultChecked: true },
};

/** «Выбрать все» с частично выбранным состоянием (`indeterminate`). */
export const SelectAll: Story = {
  name: 'Checkbox: выбрать все',
  render: function Render() {
    const items = ['Дизайн', 'Фронтенд', 'Бэкенд'];
    const [checked, setChecked] = useState<string[]>(['Дизайн']);
    const all = checked.length === items.length;
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        <Checkbox
          label="Все команды"
          checked={all}
          indeterminate={checked.length > 0 && !all}
          onChange={() => setChecked(all ? [] : items)}
        />
        <div style={{ display: 'grid', gap: 10, paddingLeft: 26 }}>
          {items.map((item) => (
            <Checkbox
              key={item}
              label={item}
              checked={checked.includes(item)}
              onChange={() => setChecked((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item]))}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const SwitchStory: Story = {
  name: 'Switch',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Switch label="Тёмная тема" defaultChecked />
      <Switch label="Уведомления" description="Push и email о новых комментариях" />
      <Switch label="Недоступно" disabled />
    </div>
  ),
};

export const RadioStory: Story = {
  name: 'RadioGroup',
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <RadioGroup
        label="Тариф"
        defaultValue="pro"
        options={[
          { value: 'free', label: 'Бесплатный', description: 'До 3 проектов' },
          { value: 'pro', label: 'Pro', description: 'Безлимит и приоритетная поддержка' },
          { value: 'team', label: 'Команда', description: 'Скоро', disabled: true },
        ]}
      />
      <RadioGroup
        label="Размер"
        orientation="horizontal"
        defaultValue="m"
        options={[
          { value: 's', label: 'S' },
          { value: 'm', label: 'M' },
          { value: 'l', label: 'L' },
        ]}
      />
    </div>
  ),
};
