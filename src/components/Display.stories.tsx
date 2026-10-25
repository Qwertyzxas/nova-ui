import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem } from './Accordion/Accordion';
import { Avatar } from './Avatar/Avatar';
import { Badge } from './Badge/Badge';
import { Spinner } from './Spinner/Spinner';
import { Tab, TabList, TabPanel, Tabs } from './Tabs/Tabs';

const meta = {
  title: 'Компоненты/Отображение',
  component: Tabs,
  args: { defaultValue: 'overview', children: null },
  argTypes: {
    defaultValue: { description: 'The tab that is open first (uncontrolled).' },
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: { component: 'WAI-ARIA tabs with automatic activation: arrow keys move focus and select.' },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TabsStory: Story = {
  name: 'Tabs',
  parameters: {
    docs: { description: { story: '← → Home End переключают вкладки; Tab уходит сразу в содержимое.' } },
  },
  render: () => (
    <Tabs defaultValue="overview">
      <TabList aria-label="Проект">
        <Tab value="overview">Обзор</Tab>
        <Tab value="tasks">Задачи</Tab>
        <Tab value="billing" disabled>
          Оплата
        </Tab>
        <Tab value="settings">Настройки</Tab>
      </TabList>
      <TabPanel value="overview">12 задач, 3 в работе, 2 участника.</TabPanel>
      <TabPanel value="tasks">Список задач проекта.</TabPanel>
      <TabPanel value="billing">Тариф и счета.</TabPanel>
      <TabPanel value="settings">Название, доступ и интеграции.</TabPanel>
    </Tabs>
  ),
};

export const VerticalTabs: Story = {
  name: 'Tabs: вертикальные',
  render: () => (
    <Tabs defaultValue="profile" orientation="vertical">
      <TabList aria-label="Настройки">
        <Tab value="profile">Профиль</Tab>
        <Tab value="security">Безопасность</Tab>
        <Tab value="notifications">Уведомления</Tab>
      </TabList>
      <TabPanel value="profile">Имя, фото и часовой пояс.</TabPanel>
      <TabPanel value="security">Пароль и двухфакторная аутентификация.</TabPanel>
      <TabPanel value="notifications">Что и куда присылать.</TabPanel>
    </Tabs>
  ),
};

export const AccordionStory: Story = {
  name: 'Accordion',
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Accordion defaultValue="delivery">
        <AccordionItem value="delivery" title="Сколько идёт доставка?">
          1–3 рабочих дня по городу, до 7 дней по России.
        </AccordionItem>
        <AccordionItem value="return" title="Можно ли вернуть товар?">
          Да, в течение 30 дней без объяснения причин.
        </AccordionItem>
        <AccordionItem value="pay" title="Какие способы оплаты?">
          Карта, СБП или наличными курьеру.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const BadgesAndAvatars: Story = {
  name: 'Badge · Avatar · Spinner',
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Badge>Черновик</Badge>
        <Badge tone="accent">Новое</Badge>
        <Badge tone="success" dot>
          Активен
        </Badge>
        <Badge tone="warning" dot>
          На проверке
        </Badge>
        <Badge tone="danger">Просрочено</Badge>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Avatar name="Тимур" size="lg" />
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" size="sm" />
        <Avatar name="Broken Image" src="/missing.png" />
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'var(--nova-color-accent-fg)' }}>
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" label="Загрузка проекта" />
      </div>
    </div>
  ),
};
