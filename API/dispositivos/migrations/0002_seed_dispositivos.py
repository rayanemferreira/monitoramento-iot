from django.db import migrations
from datetime import datetime


def seed_dispositivos(apps, schema_editor):
    Dispositivo = apps.get_model('dispositivos', 'Dispositivo')

    raw_items = [
        {"on": True, "category_id": 2, "category": "sensor_agua", "name": "Temperatura Externa", "status": "info", "value": 29, "visto_por_ultimo": "10-09-2025", "criado_em": "10-09-2025"},
        {"on": True, "category_id": 3, "category": "sensor_umidade", "name": "Humidade", "status": "info", "value": 62, "visto_por_ultimo": "10-09-2025", "criado_em": "10-09-2025"},
        {"on": True, "category_id": 4, "category": "sensor_temperatura", "name": "Nível de água", "status": "info", "value": 6, "visto_por_ultimo": "10-09-2025", "criado_em": "10-09-2025"},
        {"on": True, "category_id": 5, "category": "sensor_nivel_de_agua", "name": "Valor do tanque", "status": "info", "value": 61, "visto_por_ultimo": "10-09-2025", "criado_em": "10-09-2025"},
        {"on": True, "category_id": 1, "category": "Atuador", "name": "geladeira", "status": "info", "value": 29, "visto_por_ultimo": "10-09-2025", "criado_em": "10-09-2025"},
        {"on": True, "category_id": 1, "category": "Atuador", "name": "ar condicionado", "status": "info", "value": 62, "visto_por_ultimo": "10-09-2025", "criado_em": "10-09-2025"},
        {"on": True, "category_id": 1, "category": "Atuador", "name": "lâmpada", "status": "info", "value": 6, "visto_por_ultimo": "10-09-2025", "criado_em": "10-09-2025"},
        {"on": True, "category_id": 1, "category": "Atuador", "name": "tv", "status": "info", "value": 61, "visto_por_ultimo": "10-09-2025", "criado_em": "10-09-2025"},
    ]

    for item in raw_items:
        visto_por_ultimo = datetime.strptime(item["visto_por_ultimo"], "%d-%m-%Y").date()
        criado_em = datetime.strptime(item["criado_em"], "%d-%m-%Y").date()

        dispositivo = Dispositivo.objects.create(
            name=item["name"],
            status=item["status"],
            value=item["value"],
            visto_por_ultimo=visto_por_ultimo,
            on=item["on"],
            category_id=item["category_id"],
            category=item["category"],
        )
        # Ajusta a data de criação após o auto_now_add
        Dispositivo.objects.filter(pk=dispositivo.pk).update(criado_em=criado_em)


def unseed_dispositivos(apps, schema_editor):
    Dispositivo = apps.get_model('dispositivos', 'Dispositivo')
    names = [
        "Temperatura Externa",
        "Humidade",
        "Nível de água",
        "Valor do tanque",
        "geladeira",
        "ar condicionado",
        "lâmpada",
        "tv",
    ]
    Dispositivo.objects.filter(name__in=names).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('dispositivos', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_dispositivos, unseed_dispositivos),
    ]


