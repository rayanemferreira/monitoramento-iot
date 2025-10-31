import { Component, PLATFORM_ID, inject } from '@angular/core';
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
import { Dispositivo, DispositivoStatus } from '../models/dispositivo';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatSlideToggleModule, MatSliderModule, MatDialogModule, MatButtonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class DashboardComponent {
  lampOn = false;
 
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private dialog = inject(MatDialog);

  Dispositivos: Dispositivo[] = [
    {  id: '1',on: true, category_id:1,category:'Leitura', name: 'Temperatura Externa', status: 'info', value: 29, visto_por_ultimo:'10-09-2025',criado_em:'10-09-2025'},
    {  id: '2',on: true, category_id:1,category:'Leitura', name: 'Humidade', status: 'info', value: 62, visto_por_ultimo:'10-09-2025',criado_em:'10-09-2025'},
    {  id: '3',on: true, category_id:1,category:'Leitura', name: 'Nível de água', status: 'info', value: 6, visto_por_ultimo:'10-09-2025',criado_em:'10-09-2025'},
    {  id: '4',on: true, category_id:1,category:'Leitura', name: 'Valor do tanque', status: 'info', value: 61, visto_por_ultimo:'10-09-2025',criado_em:'10-09-2025'},
    {  id: '5',on: true, category_id:2,category:'Controle', name: 'geladeira', status: 'info', value: 29, visto_por_ultimo:'10-09-2025',criado_em:'10-09-2025'},
    {  id: '6',on: true, category_id:2,category:'Controle', name: 'ar condicionado', status: 'info', value: 62, visto_por_ultimo:'10-09-2025',criado_em:'10-09-2025'},
    {  id: '7',on: true, category_id:2,category:'Controle', name: 'lâmpada', status: 'info', value: 6, visto_por_ultimo:'10-09-2025',criado_em:'10-09-2025'},
    {  id: '8',on: true, category_id:2,category:'Controle', name: 'tv', status: 'info', value: 61, visto_por_ultimo:'10-09-2025',criado_em:'10-09-2025'},

  ];
  

  
  readonly gaugeChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    rotation: -90,
    circumference: 180,
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  };
  get gaugeChartData(): ChartConfiguration<'doughnut'>['data'] {
    const v = Math.max(0, Math.min(100, this.getRealTime('4')?.value || 0));
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
  get waterChartData(): ChartConfiguration<'doughnut'>['data'] {
    const v = Math.max(0, Math.min(100, this.getRealTime('3')?.value || 0));
    return {
      labels: ['Nível', 'Restante'],
      datasets: [
        { data: [v, 100 - v], backgroundColor: ['#2e7d32', '#1e1e1e'] }
      ]
    };
  }

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
        label: 'Humidade (%)',
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.15)',
        fill: true,
        pointRadius: 2
      }
    ]
  };

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

  getRealTime(id: string): Dispositivo | undefined {
    return this.Dispositivos.find(d => d.id === id);
  }
}


