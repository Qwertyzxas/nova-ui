import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './Button/Button';
import { Dialog } from './Dialog/Dialog';
import { TextField } from './TextField/TextField';
import { ToastProvider, useToast } from './Toast/Toast';
import { Tooltip } from './Tooltip/Tooltip';

const meta = {
  title: 'Компоненты/Оверлеи',
  component: Dialog,
  args: { open: false, onOpenChange: () => {}, title: 'Dialog' },
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Нативный `<dialog>`: ловушка фокуса, Esc и возврат фокуса работают средствами браузера. */
export const DialogStory: Story = {
  name: 'Dialog',
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button tone="danger" onClick={() => setOpen(true)}>
          Удалить проект
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Удалить проект «Orbit»?"
          description="Это действие нельзя отменить: задачи, файлы и история будут удалены."
          size="sm"
          footer={
            <>
              <Button variant="ghost" tone="neutral" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button tone="danger" onClick={() => setOpen(false)}>
                Удалить
              </Button>
            </>
          }
        />
      </>
    );
  },
};

export const FormDialog: Story = {
  name: 'Dialog с формой',
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Пригласить в команду</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Приглашение"
          footer={
            <>
              <Button variant="ghost" tone="neutral" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button onClick={() => setOpen(false)}>Отправить</Button>
            </>
          }
        >
          <TextField label="Email коллеги" type="email" placeholder="name@company.com" autoFocus />
        </Dialog>
      </>
    );
  },
};

/** Наведите курсор или перейдите Tab'ом. Подсказку можно «поймать» курсором, Esc её скрывает. */
export const TooltipStory: Story = {
  name: 'Tooltip',
  render: () => (
    <div style={{ display: 'flex', gap: 12, paddingTop: 48 }}>
      <Tooltip content="Скопировать ссылку в буфер обмена">
        <Button variant="outline" tone="neutral">
          Копировать
        </Button>
      </Tooltip>
      <Tooltip content="Подсказка снизу" placement="bottom">
        <Button variant="outline" tone="neutral">
          Снизу
        </Button>
      </Tooltip>
    </div>
  ),
};

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button onClick={() => toast({ title: 'Изменения сохранены', tone: 'success' })}>Успех</Button>
      <Button
        variant="soft"
        onClick={() =>
          toast({
            title: 'Задача удалена',
            description: 'ORB-42 «Анимация карточек»',
            action: { label: 'Отменить', onClick: () => toast({ title: 'Задача восстановлена' }) },
          })
        }
      >
        С действием
      </Button>
      <Button variant="soft" tone="danger" onClick={() => toast({ title: 'Не удалось сохранить', description: 'Проверьте соединение', tone: 'danger' })}>
        Ошибка
      </Button>
    </div>
  );
}

/** Таймер останавливается, пока курсор или фокус внутри уведомлений. */
export const ToastStory: Story = {
  name: 'Toast',
  render: () => (
    <ToastProvider label="Уведомления" dismissLabel="Закрыть уведомление">
      <ToastDemo />
    </ToastProvider>
  ),
};
