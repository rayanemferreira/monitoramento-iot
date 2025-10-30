import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatSlideToggleModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  lampOn = false;

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
}


