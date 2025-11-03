from django.urls import path
from dispositivos.consumers import MedicaoConsumer

websocket_urlpatterns = [
    path('ws/dispositivos/', MedicaoConsumer.as_asgi()),
]


