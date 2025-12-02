import {DestroyRef, inject, Injectable} from '@angular/core';
import {map, Observable, tap} from 'rxjs';
import {asConversationId, Conversation, ConversationId} from '../types/conversation.type';
import {SessionService} from '../session-service/session.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ChatApiService} from '../../api/chat-api';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private sessionService = inject(SessionService);
  private chatApiService = inject(ChatApiService);
  public destroyRef = inject(DestroyRef);

  public createAgentConversation(prompt: string): Observable<ConversationId> {
    return this.createAgentSession(prompt).pipe(
      map((conversation) => conversation.id)
    )
  }

  private createAgentSession(prompt: string): Observable<Conversation> {
    return this.chatApiService.createChatSession().pipe(
      map((response): Conversation => ({
        id: asConversationId(response.session_id),
        title: prompt + ' for Agent',
        messageList: [{
          createdBy: 'user',
          text: prompt,
        }],
      })),
      tap((conversation) => this.sessionService.createOrUpdateConversation(conversation)),
      tap((conversation) => this.pushAgentPrompt(conversation.id, prompt)),
      tap((conversation) => this.sessionService.setBusy(conversation.id, false)),
    );
  }

  public pushAgentPrompt(conversationId: ConversationId, prompt: string): void {
    this.sessionService.addMessageToConversation(conversationId, {
      createdBy: 'user',
      text: prompt,
    });
    this.sessionService.setBusy(conversationId, true);
    this.chatApiService.sendMessage(conversationId, 'user', prompt).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((response) => {
        this.sessionService.addMessageToConversation(conversationId, {
          createdBy: 'ai',
          text: (response as {response: string})?.response ?? 'GOT NO RESPONSE',
        });
      }),
      tap(() => this.sessionService.setBusy(conversationId, false))
    ).subscribe()
  }
}
