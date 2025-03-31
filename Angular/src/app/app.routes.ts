// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { DataImporterComponent } from './data-importer/data-importer.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { IndexComponent } from './index/index.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'data-importer', component: DataImporterComponent },
  { path: 'help-page', component: HelpPageComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'home' }, 
];
