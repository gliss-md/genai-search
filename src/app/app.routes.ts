import { Routes } from '@angular/router';
import {NewConversationViewComponent} from './feature/conversation/ui/new-conversation/new-conversation-view.component';
import {ConversationViewComponent} from './feature/conversation/ui/conversation/conversation-view.component';

export const routes: Routes = [
  { path: '', component: NewConversationViewComponent },
  { path: ':conversationId', component: ConversationViewComponent },
];
