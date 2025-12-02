import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {SessionService} from '../../../domain/session-service/session.service';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {ConversationId} from '../../../domain/types/conversation.type';

@Component({
  selector: 'app-session-list',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionListComponent {
  private sessionService = inject(SessionService);
  public conversations = this.sessionService.allConversations;

  public deleteConversation(conversationId: ConversationId): void {
    this.sessionService.deleteConversation(conversationId);
  }
}
