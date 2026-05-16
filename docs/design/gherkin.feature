Feature: Kitchen Display System (KDS)
  As a customer or chef, I want a reliable ordering and status tracking system.

  Scenario: Customer places a valid order
    Given the customer is authenticated
    And the menu is loaded
    When the customer adds items to the cart
    And the customer submits the order for table 5
    Then the order status should be "in_progress"
    And the order should appear on the Chef Dashboard

  Scenario: Chef marks an order as ready
    Given there is an "in_progress" order for table 5
    When the chef marks the order as "ready"
    Then the order status should update to "ready"
    And the customer should receive a notification

  Scenario: Unauthorized access to Chef Dashboard
    Given a user with "customer" role
    When the user attempts to access the Chef Dashboard API
    Then the response should be "403 Forbidden"

  Scenario: Order placement with invalid items
    Given the customer is authenticated
    When the customer submits an order with a non-existent menu item
    Then the response should indicate an error
    And no order should be created
