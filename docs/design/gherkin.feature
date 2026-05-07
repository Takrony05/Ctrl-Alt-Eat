Feature: Kitchen Display System
  Scenario: New order received
    Given a new order is placed
    Then it should appear on the kitchen dashboard
