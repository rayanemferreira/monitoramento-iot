# MeuProjetoIoT
como rodar o api



rodar front
npm start


rodar back
cd API

venv1\Scripts\activate

daphne -b 0.0.0.0 -p 8000 iot_api.asgi:application