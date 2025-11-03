import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export interface Medicao {
  id_dispositivo: string;
  value: number;
}

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket?: WebSocketSubject<unknown>;

  connect(url = 'ws://localhost:8000/ws/dispositivos/'): Observable<unknown> {
    if (!this.socket || this.socket.closed) {
      this.socket = webSocket({
        url,
        deserializer: e => {
          try { return JSON.parse((e as MessageEvent).data as string); } catch { return {}; }
        }
      });
    }
    return this.socket.asObservable();
  }

  close(): void {
    this.socket?.complete();
  }
}


