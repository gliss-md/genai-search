import { Component, input } from '@angular/core';
import {ConversationId} from '../../domain/types/conversation.type';
import {ConversationComponent} from '../shared/conversation/conversation.component';
import {SessionListComponent} from '../shared/session-list/session-list.component';

@Component({
  selector: 'app-conversation-view',
  imports: [ConversationComponent, SessionListComponent],
  templateUrl: './conversation-view.component.html',
  styleUrl: './conversation-view.component.scss',
})
export class ConversationViewComponent {
  protected conversationId = input.required<ConversationId>();
}
