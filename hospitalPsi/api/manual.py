from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('api', 'ULTIMA_MIGRACION'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solicitudpsicologo',
            name='cv',
            field=models.TextField(null=True, blank=True),
        ),
    ]
