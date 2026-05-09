from rest_framework import serializers
from .models import User, MenuItem, Order, OrderItem, AddOn

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'role']

class AddOnSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddOn
        fields = ['id', 'name', 'price']

class MenuItemSerializer(serializers.ModelSerializer):
    available_addons = AddOnSerializer(many=True, read_only=True)
    
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'category', 'price', 'available_addons', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.ReadOnlyField(source='menu_item.name')
    selected_addons_detail = AddOnSerializer(source='selected_addons', many=True, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'menu_item', 'menu_item_name', 'quantity', 'selected_addons', 'selected_addons_detail', 'notes', 'created_at']
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
            selected_addons = item_data.pop('selected_addons', [])
            item = OrderItem.objects.create(order=order, **item_data)
            if selected_addons:
                item.selected_addons.set(selected_addons)
        return order
