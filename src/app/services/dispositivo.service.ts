import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispositivo } from '../models/dispositivo';

@Injectable({ providedIn: 'root' })
export class DispositivoService {
  private readonly baseUrl = 'http://localhost:8000/api/dispositivos/';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(this.baseUrl);
  }

  getById(id: string): Observable<Dispositivo> {
    return this.http.get<Dispositivo>(`${this.baseUrl}${id}/`);
  }

  create(input: Omit<Dispositivo, 'id' | 'criado_em' | 'visto_por_ultimo'>): Observable<Dispositivo> {
    const payload: any = { ...input };
    delete payload.id;
    delete payload.criado_em;
    delete payload.visto_por_ultimo;
    return this.http.post<Dispositivo>(this.baseUrl, payload);
  }

  update(id: string, changes: Partial<Omit<Dispositivo, 'id'>>): Observable<Dispositivo> {
    const payload: any = { ...changes };
    delete payload.id;
    return this.http.put<Dispositivo>(`${this.baseUrl}${id}/`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }
}
