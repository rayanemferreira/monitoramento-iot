from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from dispositivos.views import DispositivoViewSet

router = DefaultRouter()
router.register(r'dispositivos', DispositivoViewSet, basename='dispositivo')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]


