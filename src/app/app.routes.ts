import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import("./feature/weekly-dashboard/weekly-dashboard").then(m => m.WeeklyDashboard)
  },
  {
    path: '',
    loadChildren: () => import('./feature/conversation/domain/routes').then(m => m.conversationRoutes)
  }
];
