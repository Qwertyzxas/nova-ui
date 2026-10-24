import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FormEvent } from 'react';
import { Avatar } from '../components/Avatar/Avatar';
import { Badge } from '../components/Badge/Badge';
import { Button } from '../components/Button/Button';
import { Checkbox } from '../components/Checkbox/Checkbox';
import { RadioGroup } from '../components/RadioGroup/RadioGroup';
import { Select } from '../components/Select/Select';
import { Switch } from '../components/Switch/Switch';
import { TextField } from '../components/TextField/TextField';
import { ToastProvider, useToast } from '../components/Toast/Toast';

function Form() {
  const { toast } = useToast();
  const [name, setName] = useState('Тимур');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const emailError = submitted && !/^\S+@\S+\.\S+$/.test(email) ? 'Введите адрес в формате name@example.com' : undefined;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: 'Профиль сохранён', tone: 'success' });
    }, 900);
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      style={{
        display: 'grid',
        gap: 20,
        maxWidth: 520,
        padding: 24,
        border: '1px solid var(--nova-color-border)',
        borderRadius: 'var(--nova-radius-lg)',
        background: 'var(--nova-color-surface)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={name || '?'} size="lg" />
        <div>
          <div style={{ fontWeight: 600, fontSize: 'var(--nova-font-size-lg)' }}>{name || 'Без имени'}</div>
          <Badge tone="success" dot>
            Pro
          </Badge>
        </div>
      </div>
      <TextField label="Имя" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} required />
      <Select
        label="Часовой пояс"
        defaultValue="msk"
        options={[
          { value: 'kgd', label: 'Калининград (UTC+2)' },
          { value: 'msk', label: 'Москва (UTC+3)' },
          { value: 'ekb', label: 'Екатеринбург (UTC+5)' },
          { value: 'nsk', label: 'Новосибирск (UTC+7)' },
          { value: 'vlad', label: 'Владивосток (UTC+10)' },
        ]}
      />
      <RadioGroup
        label="Язык интерфейса"
        orientation="horizontal"
        defaultValue="ru"
        options={[
          { value: 'ru', label: 'Русский' },
          { value: 'en', label: 'English' },
        ]}
      />
      <Switch label="Уведомления по email" description="Комментарии и упоминания" defaultChecked />
      <Checkbox label="Получать новости продукта" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="ghost" tone="neutral" type="reset">
          Сбросить
        </Button>
        <Button type="submit" loading={saving}>
          Сохранить
        </Button>
      </div>
    </form>
  );
}

const meta = {
  title: 'Примеры/Настройки профиля',
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;

/** Компоненты вместе: валидация при отправке, состояние загрузки и уведомление. */
export const SettingsForm: StoryObj = {
  name: 'Форма настроек',
  render: () => (
    <ToastProvider label="Уведомления" dismissLabel="Закрыть уведомление">
      <Form />
    </ToastProvider>
  ),
};
