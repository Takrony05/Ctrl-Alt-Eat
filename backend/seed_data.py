import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kitchen_display.settings')
django.setup()

from orders.models import User, MenuItem, AddOn

# ─── Create Users ──────────────────────────────────────────
print("Seeding users...")

# Default Superuser
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123',
        name='System Admin',
        role='admin'
    )
    print("- Created superuser: admin / admin123")

# Your Customer Account
user, created = User.objects.get_or_create(
    username='abdulrehmanadil491@gmail.com',
    email='abdulrehmanadil491@gmail.com',
    defaults={'name': 'Abdul Rehman', 'role': 'customer'}
)
if created:
    user.set_password('123456')
    user.save()
    print("- Created customer: abdulrehmanadil491@gmail.com / 123456")

# Demo Chef Account
chef, created = User.objects.get_or_create(
    username='chef@ejust.edu.eg',
    email='chef@ejust.edu.eg',
    defaults={'name': 'Head Chef', 'role': 'chef'}
)
if created:
    chef.set_password('chef123')
    chef.save()
    print("- Created chef: chef@ejust.edu.eg / chef123")


# ─── Create Add-ons ────────────────────────────────────────
print("Seeding add-ons...")

# Shared
extra_sauce,  _ = AddOn.objects.get_or_create(name="Extra Sauce",   defaults={"price": 0.50})
extra_cheese, _ = AddOn.objects.get_or_create(name="Extra Cheese",  defaults={"price": 1.00})
ice,          _ = AddOn.objects.get_or_create(name="Ice",           defaults={"price": 0.00})
no_ice,       _ = AddOn.objects.get_or_create(name="No Ice",        defaults={"price": 0.00})
extra_sugar,  _ = AddOn.objects.get_or_create(name="Extra Sugar",   defaults={"price": 0.00})

# Burger add-ons
double_patty, _ = AddOn.objects.get_or_create(name="Double Patty",  defaults={"price": 2.50})
bacon,        _ = AddOn.objects.get_or_create(name="Bacon",         defaults={"price": 1.50})
jalapenos,    _ = AddOn.objects.get_or_create(name="Jalapeños",     defaults={"price": 0.50})
bbq_sauce,    _ = AddOn.objects.get_or_create(name="BBQ Sauce",     defaults={"price": 0.50})

# Pizza add-ons
mushrooms,    _ = AddOn.objects.get_or_create(name="Mushrooms",     defaults={"price": 1.00})
olives,       _ = AddOn.objects.get_or_create(name="Olives",        defaults={"price": 0.75})
spicy_sauce,  _ = AddOn.objects.get_or_create(name="Spicy Sauce",   defaults={"price": 0.50})
thin_crust,   _ = AddOn.objects.get_or_create(name="Thin Crust",    defaults={"price": 0.00})

print("Seeding menu items...")
items = [
    {
        "name": "Burger", "category": "Main Meal", "price": 10.99,
        "addons": [extra_sauce, extra_cheese, double_patty, bacon, jalapenos, bbq_sauce],
    },
    {
        "name": "Gourmet Burger", "category": "Main Meal", "price": 12.99,
        "addons": [extra_sauce, extra_cheese, double_patty, bacon, jalapenos, bbq_sauce],
    },
    {
        "name": "Pizza", "category": "Main Meal", "price": 12.50,
        "addons": [extra_cheese, mushrooms, olives, spicy_sauce, thin_crust],
    },
    {
        "name": "Margherita Pizza", "category": "Main Meal", "price": 10.50,
        "addons": [extra_cheese, mushrooms, olives, spicy_sauce, thin_crust],
    },
    {"name": "Chocolate Lava Cake", "category": "Dessert",   "price": 6.99, "addons": []},
    {"name": "Apple Pie",           "category": "Dessert",   "price": 5.50, "addons": [extra_cheese]},
    {"name": "Iced Latte",          "category": "Drink",     "price": 4.50, "addons": [ice, no_ice, extra_sugar]},
    {"name": "Fresh Orange Juice",  "category": "Drink",     "price": 3.99, "addons": [ice, no_ice]},
]

for item_data in items:
    addons = item_data.pop("addons")
    item, _ = MenuItem.objects.get_or_create(**item_data)
    # Always sync add-ons so re-running the script keeps them up to date
    item.available_addons.set(addons)

print("Database seeded successfully!")
