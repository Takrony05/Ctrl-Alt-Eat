from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import User, MenuItem, Order, OrderItem, AddOn


# ------------------------------------------------------------
# Auth Serializers
# ------------------------------------------------------------
class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        # Detect role from email domain
        if email.lower().endswith('@ejust.edu.eg'):
            role = User.Role.CHEF
        else:
            role = User.Role.CUSTOMER

        user = User.objects.create_user(
            username=validated_data['username'],
            email=email,
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            role=role,
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials.")
        data['user'] = user
        return data


# ------------------------------------------------------------
# User Serializer
# ------------------------------------------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'role']


# ------------------------------------------------------------
# AddOn Serializer
# ------------------------------------------------------------
class AddOnSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddOn
        fields = ['id', 'name', 'price']


# ------------------------------------------------------------
# MenuItem Serializer
# ------------------------------------------------------------
class MenuItemSerializer(serializers.ModelSerializer):
    available_addons = AddOnSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'category', 'price', 'available_addons', 'created_at']


# ------------------------------------------------------------
# OrderItem Serializers
# ------------------------------------------------------------
class OrderItemCreateSerializer(serializers.ModelSerializer):
    """Used when a customer submits a cart."""
    notes = serializers.CharField(max_length=500, required=False, allow_blank=True)

    class Meta:
        model = OrderItem
        fields = ['menu_item', 'quantity', 'selected_addons', 'notes']


class OrderItemDetailSerializer(serializers.ModelSerializer):
    """Read-only detail view of an order item."""
    menu_item_name = serializers.ReadOnlyField(source='menu_item.name')
    menu_item_price = serializers.ReadOnlyField(source='menu_item.price')
    selected_addons = AddOnSerializer(many=True, read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'menu_item', 'menu_item_name', 'menu_item_price',
            'quantity', 'selected_addons', 'notes', 'created_at',
        ]


# ------------------------------------------------------------
# Order Serializers
# ------------------------------------------------------------
class OrderCreateSerializer(serializers.ModelSerializer):
    """Accepts a cart payload from the customer."""
    items = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = ['table_number', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            addons = item_data.pop('selected_addons', [])
            item = OrderItem.objects.create(order=order, **item_data)
            if addons:
                item.selected_addons.set(addons)
        return order


class OrderSerializer(serializers.ModelSerializer):
    """Full read-only representation of an order (used by dashboard & customer)."""
    items = OrderItemDetailSerializer(many=True, read_only=True)
    created_by_name = serializers.SerializerMethodField()
    
    # Maintain compatibility with order_tracking-feat by aliasing order_status as status
    status = serializers.CharField(source='order_status', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'table_number', 'order_status', 'status', 'priority',
            'created_by', 'created_by_name', 'items', 'created_at',
        ]

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.name or obj.created_by.username
        return None


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    """Only exposes order_status for PATCH updates."""
    class Meta:
        model = Order
        fields = ['order_status']
