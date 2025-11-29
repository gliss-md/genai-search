import { Component, input } from '@angular/core';
import {SessionListComponent} from '../components/session-list/session-list.component';
import {ConversationComponent} from '../components/conversation/conversation.component';
import {ConversationId} from '../../domain/types/conversation.type';

@Component({
  selector: 'app-conversation-view',
  imports: [ConversationComponent, SessionListComponent, SessionListComponent, ConversationComponent],
  templateUrl: './conversation-view.component.html',
  styleUrl: './conversation-view.component.scss',
})
export class ConversationViewComponent {
  protected conversationId = input.required<ConversationId>();
}
