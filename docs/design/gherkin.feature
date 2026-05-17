Feature: Kitchen Display System (KDS)
  As a Chef
  I want to see and manage active orders
  So that I can prepare them in the correct priority and notify customers when ready

  Background:
    Given I am logged in as a "Chef"

  Scenario: KDS-01 View active orders
    Given there are orders with status "in_progress" or "ready"
    When I view the kitchen dashboard
    Then I should see all active orders as distinct cards

  Scenario: KDS-02 FIFO ordering
    Given Order #15 was created at 12:00 PM
    And Order #16 was created at 12:05 PM
    When I view the dashboard
    Then Order #15 should appear before Order #16

  Scenario: KDS-03 Status transition (Mark as Ready)
    Given Order #15 has status "in_progress"
    When I click "Mark as Ready" on Order #15
    Then the order status should update to "ready"
    And the customer should receive a notification

  Scenario: KDS-04 Empty dashboard
    Given there are no orders with status "in_progress" or "ready"
    When I view the dashboard
    Then I should see the message "No active orders right now."

  Scenario: KDS-05 Failed backend response
    Given the server is experiencing an error
    When I attempt to update an order status
    Then I should see an error notification "Failed to update status"

  Scenario: KDS-06 Invalid transition rejection
    Given an order is already marked as "Ready"
    Then the "Mark as Ready" button should be disabled for that order
