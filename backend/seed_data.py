import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kitchen_display.settings')
django.setup()

from orders.models import MenuItem

items = [
    {"name": "Burger", "category": "Main", "price": 10.99},
    {"name": "Pizza", "category": "Main", "price": 12.50},
    {"name": "Coke", "category": "Drink", "price": 2.50},
    {"name": "Fries", "category": "Side", "price": 3.99},
]

for item in items:
    MenuItem.objects.get_or_create(**item)

print("Database seeded with menu items!")
