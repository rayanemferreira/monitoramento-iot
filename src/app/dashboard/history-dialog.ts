import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

export interface DispositivoHistoryData {
  name: string;
  labels: string[];
  values: number[];
}

@Component({
  selector: 'app-history-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, BaseChartDirective],
  templateUrl: './history-dialog.html',
  styleUrl: './history-dialog.css'
})
export class HistoryDialogComponent {
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    elements: { line: { tension: 0.35 } },
    scales: {
      x: { ticks: { color: '#888' } },
      y: { ticks: { color: '#888' }, suggestedMin: 0, suggestedMax: 1 }
    }
  };

  readonly chartData: ChartConfiguration<'line'>['data'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DispositivoHistoryData,
    private dialogRef: MatDialogRef<HistoryDialogComponent>
  ) {
    this.chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          label: 'Ligado (1=sim / 0=não)',
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46,125,50,0.15)',
          fill: true,
          pointRadius: 2
        }
      ]
    };
  }

  close(): void {
    this.dialogRef.close();
  }
}


