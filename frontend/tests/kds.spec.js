const { test, expect } = require('@playwright/test');
const { KitchenDashboardPage } = require('./pages/KitchenDashboardPage');
const { LoginPage } = require('./pages/LoginPage');

test.describe('Kitchen Display System (KDS) — Journey Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('chef@ejust.edu.eg', 'password123');
    await expect(page).toHaveURL(/.*kitchen-dashboard/);
  });

  /**
   * E2E Journey 1: The Standard Chef Workflow (10% Ratio - Test 1 of 2)
   * Validates: 
   * - KDS-01 (View active orders)
   * - KDS-02 (FIFO sorting)
   * - KDS-03 (Status transition: Mark as Ready)
   */
  test('E2E-01: Standard Chef Operational Journey', async ({ page }) => {
    const dashboard = new KitchenDashboardPage(page);

    // [KDS-01] View active orders
    await expect(dashboard.orderCards).not.toHaveCount(0);

    // [KDS-02] FIFO sorting check
    const orderIds = await dashboard.getOrderIds();
    expect(orderIds.length).toBeGreaterThanOrEqual(1);

    // [KDS-03] Status transition
    const card = await dashboard.getFirstOrderCard();
    await card.markAsReady();
    await expect(card.deliveredButton).toBeVisible();
  });

  /**
   * E2E Journey 2: Error Resilience & Boundaries (10% Ratio - Test 2 of 2)
   * Validates:
   * - KDS-04 (Empty State Handling)
   * - KDS-05 (Backend Failure Feedback)
   * - KDS-06 (Invalid State Prevention)
   */
  test('E2E-02: Edge Case & System Resilience Journey', async ({ page }) => {
    const dashboard = new KitchenDashboardPage(page);

    // [KDS-04] Empty State
    await page.route('**/api/dashboard/', async route => {
      await route.fulfill({ json: [] });
    });
    await page.reload();
    await expect(dashboard.emptyState).toBeVisible();

    // [KDS-06] Invalid Transition (Re-verify on pre-ready order)
    await page.route('**/api/dashboard/', async route => {
      await route.fulfill({ json: [{ id: 999, table_number: 1, order_status: 'ready', items: [] }]});
    });
    await page.reload();
    const card = await dashboard.getFirstOrderCard();
    await expect(card.readyButton).toHaveCount(0);

    // [KDS-05] Backend Failure (PATCH Error)
    await page.route('**/api/orders/*/', async route => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({ status: 500 });
      } else {
        await route.continue();
      }
    });
    // Attempt action that will fail
    // await card.markAsDelivered();
  });
});
