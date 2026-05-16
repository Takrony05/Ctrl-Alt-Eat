# Phase 3 Vertical Slice Demo Script

This script is designed to help you record your `≤ 5 min` screen recording to fulfill the "Vertical Slicing" and "Failure Resilience" requirements.

## Preparation
- Ensure both the frontend (React) and backend (Django) servers are running.
- Have a screen recorder ready (e.g., OBS, QuickTime, or Snipping Tool).
- Open two browser tabs/windows: one for the Customer View, one for the Chef Dashboard.

## Script & Actions

**[0:00 - 0:30] Introduction & Setup**
* **Audio/Action:** "This is the Phase 3 Vertical Slice demo for the Kitchen Display System (Ctrl-Alt-Eat)."
* **Action:** Briefly show the terminal running the React app and the Django server. This proves the UI, Logic, and DB are connected.

**[0:30 - 1:30] Failure Resilience & Edge Case Cage (Padlocks)**
* **Audio:** "First, we will demonstrate our padlocks that block AI hallucinations and edge cases."
* **Action:** Go to the Customer ordering screen.
* **Action:** Try to submit an order with a `Table Number` of `0` or `101`. (If the UI blocks it, mention it; if you bypass the UI, show the API returning a 400 Bad Request or validation error).
* **Action:** Try to add `55` of an item to the cart (the padlock boundary is `50`). Show the validation error or the UI preventing you from exceeding the limit.
* **Audio:** "Our strict mathematical boundaries successfully prevent absurd orders from being written to the database."

**[1:30 - 2:30] Customer Order Flow**
* **Audio:** "Now we will submit a valid order."
* **Action:** Set the table number to `5` (or any valid number).
* **Action:** Add a "Burger" and a "Drink" to the cart with a valid quantity (e.g., 2).
* **Action:** Click "Place Order" and show the success toast. 
* **Audio:** "The order was successfully saved to the SQLite database via our Django REST API."

**[2:30 - 4:00] Chef Dashboard Flow**
* **Action:** Switch to the second browser tab (logged in as a Chef).
* **Audio:** "Here on the Chef dashboard, the Kitchen Display System has instantly updated to show the new order for Table 5."
* **Action:** Point out the items in the order.
* **Action:** Click the "Mark as Ready" button.
* **Audio:** "The chef marks the order as ready, updating the database status."

**[4:00 - 4:30] Conclusion**
* **Action:** Switch back to the Customer tab to show the status has changed to "Ready" (if your UI supports real-time/polling updates).
* **Audio:** "This demonstrates a complete vertical slice—from the React UI to the Django Logic down to the SQLite database, with edge case padlocks intact."
* **Action:** Stop recording.

## Final Steps
1. Upload the video to YouTube (Unlisted) or Google Drive.
2. Paste the link into `demo/video_link.txt`.
3. You're done with the demo requirement!
