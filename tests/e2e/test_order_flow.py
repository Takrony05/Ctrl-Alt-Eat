import pytest
from playwright.sync_api import Page, expect

# ------------------------------------------------------------
# E2E Test: Full Order Lifecycle
# ------------------------------------------------------------
# This test simulates a complete interaction between a 
# Customer and a Chef.
# ------------------------------------------------------------

def test_full_order_cycle(page: Page):
    # 1. Login as Customer
    page.goto("http://localhost:3000/login")
    page.fill('input[name="username"]', "student@gmail.com")
    page.fill('input[name="password"]', "password123")
    page.click('button:has-text("Login")')
    
    # Wait for menu to load
    expect(page.locator("text=Main Meal")).to_be_visible()

    # 2. Add Item to Cart
    page.click('text=Burger >> xpath=.. >> button:has-text("Add to Cart")')
    page.click('button:has-text("Cart")') # Open cart modal or page
    
    # 3. Place Order
    expect(page.locator("text=Burger")).to_be_visible()
    page.click('button:has-text("Place Order")')
    
    # 4. Success Toast
    expect(page.locator("text=Order placed successfully")).to_be_visible()

    # 5. Login as Chef (New Browser Context/Tab)
    # For simplicity in this script, we just navigate to /chef
    page.goto("http://localhost:3000/chef")
    
    # 6. Verify Order Appears on Kitchen Board
    expect(page.locator("text=Table")).to_be_visible()
    expect(page.locator("text=Burger")).to_be_visible()
    
    # 7. Mark as Ready
    page.click('button:has-text("Mark as Ready")')
    
    # 8. Verify status update
    expect(page.locator("text=Order marked as ready")).to_be_visible()
