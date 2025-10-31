import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { DispositivosComponent } from './dispositivos/dispositivos';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dispositivos', component: DispositivosComponent }
];
