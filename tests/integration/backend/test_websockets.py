import pytest
from channels.testing import WebsocketCommunicator
from kitchen_display.asgi import application
from orders.models import User, Order

@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_order_ready_broadcast():
    from asgiref.sync import sync_to_async
    customer = await sync_to_async(User.objects.create_user)(
        username="customer_ws", email="c@g.com", password="pw"
    )
    order = await sync_to_async(Order.objects.create)(
        table_number=10, created_by=customer
    )

    communicator = WebsocketCommunicator(application, "ws/orders/")
    connected, _ = await communicator.connect()
    assert connected

    # Simulate chef marking order as ready via ViewSet logic
    # Since we want to test the broadcast, we'll manually fire the group_send
    # or better, use the ViewSet logic if we can mock the request.
    # For now, let's test if the Consumer handles a message.
    
    # In a real KDS, the broadcast is triggered by the ViewSet.
    # We'll test the broadcast by manually sending to the group and checking if communicator receives it.
    from channels.layers import get_channel_layer
    channel_layer = get_channel_layer()
    
    await channel_layer.group_send(
        "orders",
        {
            "type": "order_ready",
            "order_id": order.id,
            "table_number": order.table_number,
            "customer_id": customer.id,
        }
    )

    response = await communicator.receive_json_from()
    assert response["type"] == "order_ready"
    assert response["order_id"] == order.id

    await communicator.disconnect()
