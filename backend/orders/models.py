from django.contrib.auth.models import AbstractUser
from django.db import models


# ------------------------------------------------------------
# Users
# ------------------------------------------------------------
class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN   = "admin",   "Admin"
        WAITER  = "waiter",  "Waiter"
        CHEF    = "chef",    "Chef"
        CASHIER = "cashier", "Cashier"

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.WAITER,
    )
    # Added name field as used in __str__
    name = models.CharField(max_length=255, blank=True)

    def __str__(self):
        name_to_show = self.name if self.name else self.username
        return f"{name_to_show} ({self.role})"


# ------------------------------------------------------------
# Menu Items
# ------------------------------------------------------------
class MenuItem(models.Model):
    name        = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    category    = models.CharField(max_length=100)
    price       = models.DecimalField(max_digits=8, decimal_places=2)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} — {self.category} (${self.price})"


# ------------------------------------------------------------
# Orders
# ------------------------------------------------------------
class Order(models.Model):
    class Status(models.TextChoices):
        IN_PROGRESS = "in_progress", "In Progress"
        READY       = "ready",       "Ready"
        DELIVERED   = "delivered",   "Delivered"
        CANCELLED   = "cancelled",   "Cancelled"

    table_number = models.PositiveIntegerField()
    order_status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.IN_PROGRESS,
    )
    priority   = models.PositiveIntegerField(default=1)
    created_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="orders",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["priority", "created_at"]
        indexes = [
            models.Index(fields=["order_status"]),
            models.Index(fields=["priority"]),
        ]

    def __str__(self):
        return f"Order #{self.id} — Table {self.table_number} [{self.order_status}]"


# ------------------------------------------------------------
# Order Items
# ------------------------------------------------------------
class OrderItem(models.Model):
    order     = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )
    menu_item = models.ForeignKey(
        MenuItem,
        on_delete=models.PROTECT,
        related_name="order_items",
    )
    quantity  = models.PositiveIntegerField(default=1)
    notes     = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name} (Order #{self.order_id})"
