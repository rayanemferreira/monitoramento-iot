import { Component, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { Dispositivo } from '../models/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';
import { DispositivoFormDialogComponent } from './dispositivo-form.dialog';

@Component({
  selector: 'app-dispositivos',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './dispositivos.html',
  styleUrl: './dispositivos.css'
})
export class DispositivosComponent {
  private readonly service = inject(DispositivoService);
  private readonly dialog = inject(MatDialog);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  dispositivos: Dispositivo[] = [];

  constructor() {
    this.load();
  }

  load(): void {
    this.dispositivos = this.service.getAll();
  }

  add(): void {
     const ref = this.dialog.open(DispositivoFormDialogComponent, { width: '560px', panelClass: 'dark-dialog' });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.service.create(value);
      this.load();
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
      this.service.update(d.id, value);
      this.load();
    });
  }

  remove(d: Dispositivo): void {
    const ok = confirm(`Excluir dispositivo "${d.name}"?`);
    if (!ok) return;
    this.service.delete(d.id);
    this.load();
  }
}


