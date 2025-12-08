import {Routes} from '@angular/router';
import {NewConversationViewComponent} from './feature/conversation/ui/new-conversation/new-conversation-view.component';
import {ConversationViewComponent} from './feature/conversation/ui/conversation/conversation-view.component';

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
