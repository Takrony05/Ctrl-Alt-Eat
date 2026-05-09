import json
from channels.generic.websocket import AsyncWebsocketConsumer


class OrderConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time order status updates.
    
    All clients join the shared 'orders' group.
    When an order is marked ready, the backend broadcasts to this group
    and the relevant customer's frontend shows the notification.
    """

    GROUP_NAME = "orders"

    async def connect(self):
        await self.channel_layer.group_add(self.GROUP_NAME, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.GROUP_NAME, self.channel_name)

    async def receive(self, text_data):
        # Clients can send pings; we just echo back
        try:
            data = json.loads(text_data)
            await self.send(text_data=json.dumps({"echo": data}))
        except Exception:
            pass

    # Handler called by channel_layer.group_send with type "order_ready"
    async def order_ready(self, event):
        await self.send(text_data=json.dumps({
            "type": "order_ready",
            "order_id": event["order_id"],
            "table_number": event.get("table_number"),
            "customer_id": event.get("customer_id"),
            "message": "Your order is ready to be picked up!",
        }))
