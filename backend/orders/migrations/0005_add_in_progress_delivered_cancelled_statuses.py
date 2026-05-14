# Generated manually — adds in_progress, delivered, cancelled status choices
# and updates the default from 'preparing' to 'in_progress'.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0004_alter_order_order_status'),
    ]

    operations = [
        # Migrate any legacy 'preparing' rows to the new 'in_progress' value
        # before altering the field so existing data stays consistent.
        migrations.RunSQL(
            sql="UPDATE orders_order SET order_status = 'in_progress' WHERE order_status = 'preparing';",
            reverse_sql="UPDATE orders_order SET order_status = 'preparing' WHERE order_status = 'in_progress';",
        ),

        migrations.AlterField(
            model_name='order',
            name='order_status',
            field=models.CharField(
                choices=[
                    ('in_progress', 'In Progress'),
                    ('ready',       'Ready'),
                    ('delivered',   'Delivered'),
                    ('cancelled',   'Cancelled'),
                ],
                default='in_progress',
                max_length=15,
            ),
        ),
    ]
