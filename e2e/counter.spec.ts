import { test, expect } from '@playwright/test'

test('counter state persists across route navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Counter' })).toBeVisible()
  await expect(page).toHaveTitle('Home · opinionated vuejs starter')

  await page.getByRole('button', { name: 'Increment' }).click()
  await page.getByRole('button', { name: 'Increment' }).click()
  await expect(page.getByTestId('count-home')).toContainText('2')

  await page.getByRole('link', { name: 'About' }).click()
  await expect(page.getByRole('heading', { name: 'Stats' })).toBeVisible()
  await expect(page).toHaveTitle('About · opinionated vuejs starter')
  await expect(page.getByTestId('count-about')).toContainText('2')
  await expect(page.getByTestId('double-about')).toContainText('4')

  await page.getByRole('button', { name: 'Reset' }).click()
  await expect(page.getByTestId('count-about')).toContainText('0')
  await expect(page.getByTestId('double-about')).toContainText('0')
})
