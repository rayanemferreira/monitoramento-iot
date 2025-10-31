from rest_framework import viewsets
from .models import Dispositivo
from .serializers import DispositivoSerializer


class DispositivoViewSet(viewsets.ModelViewSet):
    queryset = Dispositivo.objects.all()
    serializer_class = DispositivoSerializer


