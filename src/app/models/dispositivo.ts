export type DispositivoStatus = 'info' | 'warn' | 'error';

export interface Dispositivo {
  id: string;
  name: string;
  status: DispositivoStatus;
  value: number;
  visto_por_ultimo: string;
  criado_em: string;
  on: boolean;
  category_id: number;
  category: string;
}


