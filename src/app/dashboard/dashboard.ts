import { ChangeDetectorRef, Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HistoryDialogComponent } from './history-dialog';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Subscription } from 'rxjs';
import { Dispositivo, DispositivoStatus } from '../models/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';
import { Medicao, RealtimeService } from '../services/realtime.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatSlideToggleModule, MatSliderModule, MatDialogModule, MatButtonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class DashboardComponent implements OnInit, OnDestroy {
  lampOn = false;
 
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private readonly service = inject(DispositivoService);
  private readonly realtime = inject(RealtimeService);
  private readonly cdr = inject(ChangeDetectorRef);
  Dispositivos: Dispositivo[] = [];

  private routerEventsSub?: Subscription;
  private realtimeSub?: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.load();
    this.routerEventsSub = this.router.events.subscribe(evt => {
      if (evt instanceof Object && (evt as any).constructor && (evt as any).constructor.name === 'NavigationEnd') {
        this.load();
      }
    });

    if (this.isBrowser) {
      this.realtimeSub = this.realtime.connect().subscribe((msg: unknown) => {
        const data = msg as Partial<Medicao>;
        console.log('data:', data, this.Dispositivos);
        if (!data || !data.id_dispositivo) return;
        const idx = this.Dispositivos.findIndex(d => d.id === data.id_dispositivo);
        if (idx !== -1 && typeof data.value === 'number') {
          const updated = { ...this.Dispositivos[idx], value: data.value } as Dispositivo;
          this.Dispositivos = [
            ...this.Dispositivos.slice(0, idx),
            updated,
            ...this.Dispositivos.slice(idx + 1)
          ];
          this.updateEnergyChart();
          this.cdr.detectChanges();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.routerEventsSub?.unsubscribe();
    this.realtimeSub?.unsubscribe();
  }

  private load(): void {
    this.service.getAll().subscribe(list => {
      this.Dispositivos = list;
      this.updateEnergyChart();
    });
   }
 

  
  readonly gaugeChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    rotation: -90,
    circumference: 180,
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  };
  get gaugeChartData(): ChartConfiguration<'doughnut'>['data'] {
    const v = Math.max(0, Math.min(100, this.getRealTime(2)?.value || 0));
    return {
      labels: ['Valor', 'Restante'],
      datasets: [
        { data: [v, 100 - v], backgroundColor: ['#2e7d32', '#1e1e1e'] }
      ]
    };
  }

  readonly waterChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  };
  buildDoughnutData(value: number): ChartConfiguration<'doughnut'>['data'] {
    const v = Math.max(0, Math.min(100, value || 0));
    return {
      labels: ['Nível', 'Restante'],
      datasets: [
        { data: [v, 100 - v], backgroundColor: ['#2e7d32', '#1e1e1e'] }
      ]
    };
  }

  // Energy-specific donut with thresholds: <=50 green, >50 yellow, >85 red
  buildEnergyDoughnutData(value: number): ChartConfiguration<'doughnut'>['data'] {
    const v = Math.max(0, Math.min(100, value || 0));
    const color = v > 85 ? '#d32f2f' : v > 50 ? '#e9ed02' : '#2e7d32';
    return {
      labels: ['Consumo', 'Restante'],
      datasets: [
        { data: [v, 100 - v], backgroundColor: [color, '#1e1e1e'] }
      ]
    };
  }
  get waterChartData(): ChartConfiguration<'doughnut'>['data'] {
    const v = Math.max(0, Math.min(100, this.getRealTime(3)?.value || 0));
    return {
      labels: ['Nível', 'Restante'],
      datasets: [
        { data: [v, 100 - v], backgroundColor: ['#2e7d32', '#1e1e1e'] }
      ]
    };
  }

  // reverted: removed energy distribution donut/legend

  readonly lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#666' } },
      y: { ticks: { color: '#666' } }
    },
    plugins: {
      legend: { labels: { color: '#333' } }
    },
    elements: { line: { tension: 0.35 } }
  };

  readonly tempChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
    datasets: [
      {
        data: [22, 22.5, 23, 23.5, 24, 24.5],
        label: 'Temperatura (°C)',
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.15)',
        fill: true,
        pointRadius: 2
      }
    ]
  };

  readonly humChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
    datasets: [
      {
        data: [55, 57, 54, 53, 52, 50],
        label: 'Umidade (%)',
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.15)',
        fill: true,
        pointRadius: 2
      }
    ]
  };
  goToDispositivos(): void {
    this.router.navigateByUrl('/dispositivos');
  }

  openHistory(device: Dispositivo): void {
    const series = this.buildMockHistory(24);
    this.dialog.open(HistoryDialogComponent, {
      data: {
        name: device.name,
        labels: series.labels,
        values: series.values
      },
      panelClass: 'dark-dialog',
      width: '1000px',
      maxWidth: '95vw'
    });
  }

  private buildMockHistory(hours: number): { labels: string[]; values: number[] } {
    const labels: string[] = [];
    const values: number[] = [];
    const now = new Date();
    for (let i = hours - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hh = d.getHours().toString().padStart(2, '0');
      labels.push(`${hh}:00`);
      // demo pattern: more ON during daytime (8..20)
      const on = d.getHours() >= 8 && d.getHours() <= 20 ? (d.getHours() % 3 ? 1 : 0) : 0;
      values.push(on);
    }
    return { labels, values };
  }
  onToggle(device: Dispositivo, on: boolean): void {
    this.service.update(device.id, { on }).subscribe({
      next: () => this.load(),
      error: () => this.load()
    });
  }
  getRealTimeDevices(category_id: number): Dispositivo[] {
    const resp = this.Dispositivos.filter(d => d.category_id === category_id);
     return resp;
  }
  getRealTime(category_id: number): Dispositivo | undefined {
    return this.Dispositivos.find(d => d.category_id === category_id);
  }

  getActuators(): Dispositivo[] {
    return this.Dispositivos
      .filter(d => d.category_id === 1)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  }

  energyChartData?: ChartConfiguration<'doughnut'>['data'];
  private updateEnergyChart(): void {
    const v = this.getRealTime(5)?.value ?? 0;
    this.energyChartData = this.buildEnergyDoughnutData(v);
  }

  statusLabel(status: DispositivoStatus): string {
    switch (status) {
      case 'info': return 'Estável';
      case 'warn': return 'Monitorar';
      case 'error': return 'Em Pane';
      default: return String(status);
    }
  }

  private toTitleCase(text: string): string {
    return (text || '')
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  formatTitle(base: string, sensor: Dispositivo): string {
    const name = (sensor?.name || '').trim();
    if (!name) return base;
    // Hide the appended name when the device name is exactly "Temperatura Externa"
    if (name.toLowerCase() === 'temperatura externa') return base;
    return `${base} — ${this.toTitleCase(name)}`;
  }
}


