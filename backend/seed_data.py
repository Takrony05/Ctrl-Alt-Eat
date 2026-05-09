import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kitchen_display.settings')
django.setup()

from orders.models import MenuItem, AddOn

# Create Add-ons
extra_sauce, _ = AddOn.objects.get_or_create(name="Extra Sauce", price=0.50)
extra_cheese, _ = AddOn.objects.get_or_create(name="Extra Cheese", price=1.00)
ice, _ = AddOn.objects.get_or_create(name="Ice", price=0.00)
no_ice, _ = AddOn.objects.get_or_create(name="No Ice", price=0.00)
extra_sugar, _ = AddOn.objects.get_or_create(name="Extra Sugar", price=0.00)

items = [
    {"name": "Gourmet Burger", "category": "Main Meal", "price": 12.99, "addons": [extra_sauce, extra_cheese]},
    {"name": "Margherita Pizza", "category": "Main Meal", "price": 10.50, "addons": [extra_cheese]},
    {"name": "Chocolate Lava Cake", "category": "Dessert", "price": 6.99, "addons": []},
    {"name": "Apple Pie", "category": "Dessert", "price": 5.50, "addons": [extra_cheese]}, # Some people like cheese on pie!
    {"name": "Iced Latte", "category": "Drink", "price": 4.50, "addons": [ice, no_ice, extra_sugar]},
    {"name": "Fresh Orange Juice", "category": "Drink", "price": 3.99, "addons": [ice, no_ice]},
]

for item_data in items:
    addons = item_data.pop("addons")
    item, created = MenuItem.objects.get_or_create(**item_data)
    if addons:
        item.available_addons.set(addons)

print("Database seeded with updated categories and add-ons!")
