import {Routes} from '@angular/router';
import {NewConversationViewComponent} from '../ui/new-conversation/new-conversation-view.component';
import {ConversationViewComponent} from '../ui/conversation/conversation-view.component';

export const conversationRoutes: Routes = [
  {path: '', component: NewConversationViewComponent},
  {path: ':conversationId', component: ConversationViewComponent},
];
