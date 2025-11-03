import asyncio
import json
import random
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from dispositivos.models import Dispositivo


class MedicaoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self._task = asyncio.create_task(self._send_loop())

    async def disconnect(self, close_code):
        try:
            if hasattr(self, '_task'):
                self._task.cancel()
        except Exception:
            pass

    async def _send_loop(self):
        while True:
            await asyncio.sleep(5)
            ids = await self.get_device_ids()
            if not ids:
                continue
            device_id = str(random.choice(ids))
            value = random.randint(10, 100)
            payload = {
                'id_dispositivo': device_id,
                'value': value,
                'tipo': 'medicao'
            }
            await self.send(text_data=json.dumps(payload))

    @database_sync_to_async
    def get_device_ids(self):
        return list(Dispositivo.objects.exclude(category_id=1).values_list('id', flat=True))


