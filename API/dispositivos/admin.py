from django.contrib import admin
from .models import Dispositivo


@admin.register(Dispositivo)
class DispositivoAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'status', 'on', 'category', 'category_id', 'visto_por_ultimo', 'criado_em')
    list_filter = ('status', 'on', 'category')
    search_fields = ('name', 'category')


