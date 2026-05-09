from rest_framework import serializers
from .models import Order, OrderItem, MenuItem, AddOn

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['menu_item', 'quantity', 'selected_addons', 'notes']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'status', 'items']
        # The model uses order_status, but requirements say 'status'. 
        # I'll add a 'status' alias if needed or just use 'order_status'.
        # Requirements: "returns the created order with its id and initial status"

    # Alias order_status as status for the API response
    status = serializers.CharField(source='order_status', read_only=True)

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            addons = item_data.pop('selected_addons', [])
            item = OrderItem.objects.create(order=order, **item_data)
            if addons:
                item.selected_addons.set(addons)
        return order
