import {Component} from '@angular/core';
import {SessionListComponent} from '../components/session-list/session-list.component';
import {NewConversation} from '../components/new-conversation/new-conversation';

@Component({
  selector: 'app-new-conversation-view',
  imports: [SessionListComponent, NewConversation, SessionListComponent, NewConversation],
  templateUrl: './new-conversation-view.component.html',
  styleUrl: './new-conversation-view.component.scss',
})
export class NewConversationViewComponent {
}
