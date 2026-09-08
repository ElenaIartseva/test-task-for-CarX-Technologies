import { test, expect, type Page } from '@playwright/test';

const login = async (page: Page) => {
  await page.goto('./login');
  await page.getByPlaceholder('Логин').fill('admin');
  await page.getByPlaceholder('Пароль').fill('admin');
  await page.getByRole('button', { name: /войти/i }).click();
};

const createTicket = async (page: Page, text = 'E2E test ticket') => {
  await page.getByRole('combobox').selectOption('Категория 1');
  await page.getByPlaceholder('Текст до 1 000 символов').fill(text);
  await page.getByRole('button', { name: /отправить/i }).click();

  await expect(page.getByText('Обращение успешно отправлено.')).toBeVisible();
  await page.getByRole('button', { name: /^ок$/i }).click();
};

test.describe('Personal cabinet', () => {
  test('login and create ticket', async ({ page }) => {
    await login(page);

    await expect(
      page.getByRole('heading', { name: /создать новое обращение/i })
    ).toBeVisible();

    await createTicket(page);
    await expect(page.getByText(/обращение:/i)).toBeVisible();
    await expect(page.getByText(/статус: открыт/i)).toBeVisible();
  });

  test('shows an error for invalid credentials', async ({ page }) => {
    await page.goto('./login');

    await page.getByPlaceholder('Логин').fill('admin');
    await page.getByPlaceholder('Пароль').fill('wrong');
    await page.getByRole('button', { name: /войти/i }).click();

    await expect(
      page.getByText('Что-то пошло не так! Попробуйте ещё раз.')
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /вход в личный кабинет/i })
    ).toBeVisible();
  });

  test('adds a comment and closes a ticket', async ({ page }) => {
    await login(page);
    await createTicket(page, 'Lifecycle ticket');

    await page.getByRole('link', { name: /lifecycle ticket/i }).click();
    const ticketDetails = page.locator('section').filter({
      has: page.getByRole('heading', { name: /информация об обращении/i })
    });
    await expect(ticketDetails.getByText(/дата создания:/i)).toBeVisible();
    await expect(ticketDetails.getByText(/статус:/i)).toBeVisible();
    await expect(ticketDetails).toContainText('Открыт');

    await page
      .getByPlaceholder('Текст до 1 000 символов')
      .fill('Lifecycle comment');
    await page.getByRole('button', { name: /добавить комментарий/i }).click();
    await expect(page.getByText('Lifecycle comment')).toBeVisible();

    await page.getByRole('button', { name: /^закрыть обращение$/i }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: /^закрыть обращение$/i }).click();

    await expect(
      page.getByText(/обращение закрыто для редактирования/i)
    ).toBeVisible();
    await expect(ticketDetails).toContainText('Закрыт');
  });

  test('logs out and protects the main page', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: /выйти/i }).click();

    await expect(
      page.getByRole('heading', { name: /вход в личный кабинет/i })
    ).toBeVisible();
  });

  test('shows 404 page for unknown routes', async ({ page }) => {
    await page.goto('./unknown-route');

    await expect(page.getByText(/страница не найдена/i)).toBeVisible();
  });
});
