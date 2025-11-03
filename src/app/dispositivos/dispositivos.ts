import { ChangeDetectorRef, Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { Dispositivo, DispositivoStatus } from '../models/dispositivo';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DispositivoService } from '../services/dispositivo.service';
import { Medicao, RealtimeService } from '../services/realtime.service';
import { DispositivoFormDialogComponent } from './dispositivo-form.dialog';

@Component({
  selector: 'app-dispositivos',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './dispositivos.html',
  styleUrl: './dispositivos.css'
})
export class DispositivosComponent implements OnInit, OnDestroy {
  private readonly service = inject(DispositivoService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly realtime = inject(RealtimeService);
  private readonly cdr = inject(ChangeDetectorRef);
  private routerEventsSub?: Subscription;
  private realtimeSub?: Subscription;

  dispositivos: Dispositivo[] = [];

  constructor() {}

  ngOnInit(): void {
    this.load();
    this.routerEventsSub = this.router.events.subscribe(evt => {
      if (evt instanceof Object && (evt as any).constructor && (evt as any).constructor.name === 'NavigationEnd') {
        if (this.isBrowser) this.load();
      }
    });

    if (this.isBrowser) {
      this.realtimeSub = this.realtime.connect().subscribe((msg: unknown) => {
        const data = msg as Partial<Medicao>;
        if (!data || !data.id_dispositivo) return;
        const idx = this.dispositivos.findIndex(d => d.id === data.id_dispositivo);
        if (idx !== -1 && typeof data.value === 'number') {
          const updated = { ...this.dispositivos[idx], value: data.value } as Dispositivo;
          this.dispositivos = [
            ...this.dispositivos.slice(0, idx),
            updated,
            ...this.dispositivos.slice(idx + 1)
          ];
          this.cdr.detectChanges();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.routerEventsSub?.unsubscribe();
    this.realtimeSub?.unsubscribe();
  }

  load(): void {
    this.service.getAll().subscribe(list => this.dispositivos = list);
  }

  private reloadPage(): void {
    if (this.isBrowser) {
      location.reload();
    } else {
      this.load();
    }
  }

  add(): void {
     const ref = this.dialog.open(DispositivoFormDialogComponent, { width: '560px', panelClass: 'dark-dialog' });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.service.create(value).subscribe(() => this.reloadPage());
    });
  }

  edit(d: Dispositivo): void {
     const ref = this.dialog.open(DispositivoFormDialogComponent, {
      width: '560px',
      panelClass: 'dark-dialog',
      data: { dispositivo: d }
    });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.service.update(d.id, value).subscribe(() => this.reloadPage());
    });
  }

  remove(d: Dispositivo): void {
    const ok = confirm(`Excluir dispositivo "${d.name}"?`);
    if (!ok) return;
    this.service.delete(d.id).subscribe(() => this.reloadPage());
  }

  statusLabel(status: DispositivoStatus): string {
    switch (status) {
      case 'info': return 'Estável';
      case 'warn': return 'Monitorar';
      case 'error': return 'Em Pane';
      default: return String(status);
    }
  }

  categoryLabel(d: Dispositivo): string {
    switch (d.category_id) {
      case 1: return 'Atuador';
      case 2: return 'Sensor de nível';
      case 3: return 'sensor_umidade';
      case 4: return 'sensor_temperatura';
      case 5: return 'Consumo de energia';
      default: return d.category || '';
    }
  }
}


