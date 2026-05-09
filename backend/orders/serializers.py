from rest_framework import serializers
from .models import User, MenuItem, Order, OrderItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'role']

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.ReadOnlyField(source='menu_item.name')
    
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'menu_item', 'menu_item_name', 'quantity', 'notes', 'created_at']
        read_only_fields = ['order']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    created_by_name = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Order
        fields = ['id', 'table_number', 'order_status', 'priority', 'created_by', 'created_by_name', 'items', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
