const { expect } = require('@playwright/test');

class KitchenOrderCard {
  constructor(locator) {
    this.locator = locator;
    this.title = locator.locator('h3');
    this.statusBadge = locator.locator('.status-badge');
    this.readyButton = locator.locator('button:has-text("Mark as Ready")');
    this.deliveredButton = locator.locator('button:has-text("Mark as Delivered")');
  }

  async getOrderId() {
    const text = await this.title.textContent();
    return text.replace('Order #', '').trim();
  }

  async getStatus() {
    return await this.statusBadge.textContent();
  }

  async markAsReady() {
    await this.readyButton.click();
  }

  async markAsDelivered() {
    await this.deliveredButton.click();
  }
}

module.exports = { KitchenOrderCard };
