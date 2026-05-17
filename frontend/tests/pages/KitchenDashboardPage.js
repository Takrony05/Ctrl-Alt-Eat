const { expect } = require('@playwright/test');
const { KitchenOrderCard } = require('./KitchenOrderCard');

class KitchenDashboardPage {
  constructor(page) {
    this.page = page;
    this.orderCardsLocator = page.locator('.order-card');
    this.emptyState = page.locator('text=No active orders right now.');
    this.errorToast = page.locator('.toast-error');
  }

  async navigate() {
    await this.page.goto('/kitchen-dashboard');
  }

  get orderCards() {
    return this.orderCardsLocator;
  }

  async getOrderCard(orderId) {
    const locator = this.page.locator(`.order-card:has-text("Order #${orderId}")`);
    return new KitchenOrderCard(locator);
  }

  async getFirstOrderCard() {
    return new KitchenOrderCard(this.orderCardsLocator.first());
  }

  async getOrderIds() {
    const texts = await this.orderCardsLocator.locator('h3').allTextContents();
    return texts.map(t => t.replace('Order #', '').trim());
  }
}

module.exports = { KitchenDashboardPage };
