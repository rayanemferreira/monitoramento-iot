import { Injectable } from '@angular/core';
import { Dispositivo } from '../models/dispositivo';

const STORAGE_KEY = 'dispositivos';

@Injectable({ providedIn: 'root' })
export class DispositivoService {
  private memory: Dispositivo[] | null = null;

  private get storageAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  getAll(): Dispositivo[] {
    if (this.storageAvailable) {
 
        const seed: Dispositivo[] = [
          { id: '1', name: 'Temperatura Externa', status: 'info', value: 29, visto_por_ultimo: '10-09-2025', criado_em: '10-09-2025', on: true, category_id: 1, category: 'Leitura' },
          { id: '2', name: 'Lâmpada', status: 'info', value: 0, visto_por_ultimo: '10-09-2025', criado_em: '10-09-2025', on: false, category_id: 2, category: 'Controle' }
        ];
         return seed;
      
      
    }
    if (!this.memory) {
      this.memory = [
        { id: '1', name: 'Temperatura Externa', status: 'info', value: 29, visto_por_ultimo: '10-09-2025', criado_em: '10-09-2025', on: true, category_id: 1, category: 'Leitura' },
        { id: '2', name: 'Lâmpada', status: 'info', value: 0, visto_por_ultimo: '10-09-2025', criado_em: '10-09-2025', on: false, category_id: 2, category: 'Controle' }
      ];
    }
    return this.memory;
  }

  getById(id: string): Dispositivo | undefined {
    return this.getAll().find(d => d.id === id);
  }

  create(input: Omit<Dispositivo, 'id' | 'criado_em' | 'visto_por_ultimo'>): Dispositivo {
    const list = this.getAll();
    const now = new Date();
    const next: Dispositivo = {
      ...input,
      id: (globalThis as any).crypto?.randomUUID ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      criado_em: now.toISOString().slice(0, 10),
      visto_por_ultimo: now.toISOString().slice(0, 10)
    };
    list.push(next);
    this.save(list);
    return next;
  }

  update(id: string, changes: Partial<Omit<Dispositivo, 'id'>>): Dispositivo | undefined {
    const list = this.getAll();
    const idx = list.findIndex(d => d.id === id);
    if (idx === -1) return undefined;
    const updated: Dispositivo = { ...list[idx], ...changes };
    list[idx] = updated;
    this.save(list);
    return updated;
  }

  delete(id: string): void {
    const list = this.getAll().filter(d => d.id !== id);
    this.save(list);
  }

  private save(list: Dispositivo[]): void {
    if (this.storageAvailable) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } else {
      this.memory = list;
    }
  }
}


