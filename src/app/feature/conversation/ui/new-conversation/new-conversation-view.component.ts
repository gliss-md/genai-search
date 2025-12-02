import {Component} from '@angular/core';
import {NewConversation} from '../shared/new-conversation/new-conversation';
import {SessionListComponent} from '../shared/session-list/session-list.component';


@Component({
  selector: 'app-new-conversation-view',
  imports: [SessionListComponent, NewConversation],
  templateUrl: './new-conversation-view.component.html',
  styleUrl: './new-conversation-view.component.scss',
})
export class NewConversationViewComponent {
}
