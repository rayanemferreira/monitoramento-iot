from rest_framework import serializers
from .models import Dispositivo


class DispositivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispositivo
        fields = [
            'id',
            'name',
            'status',
            'value',
            'visto_por_ultimo',
            'criado_em',
            'on',
            'category_id',
            'category',
        ]


