import {Component, computed, inject, input} from '@angular/core';
import { ConversationId } from '../../../../../domain/types/conversation.type';
import { SessionService } from '../../../../../domain/session-service/session.service';
import { NgClass } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-conversation-history',
  imports: [NgClass, MarkdownComponent],
  templateUrl: './conversation-history.component.html',
  styleUrl: './conversation-history.component.scss',
})
export class ConversationHistoryComponent {
  public conversationId = input.required<ConversationId>();
  private sessionService = inject(SessionService);
  protected messageList = computed(() => this.sessionService.getConversationFromState(this.conversationId())?.messageList ?? []);
  protected displayLoading = computed(() => this.sessionService.isBusy(this.conversationId()));
}
