import uuid
from datetime import date
from django.db import models


class Dispositivo(models.Model):
    STATUS_INFO = 'info'
    STATUS_WARN = 'warn'
    STATUS_ERROR = 'error'
    STATUS_CHOICES = [
        (STATUS_INFO, 'Info'),
        (STATUS_WARN, 'Warn'),
        (STATUS_ERROR, 'Error'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_INFO)
    value = models.FloatField(default=0)
    visto_por_ultimo = models.DateField(default=date.today)
    criado_em = models.DateField(auto_now_add=True)
    on = models.BooleanField(default=False)
    category_id = models.IntegerField()
    category = models.CharField(max_length=60)

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:
        return f"{self.name} ({self.status})"


