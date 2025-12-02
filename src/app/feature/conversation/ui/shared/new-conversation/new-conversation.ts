import {Component, DestroyRef, inject, signal} from '@angular/core';
import {PromptInput} from '../conversation/children/prompt-input/prompt-input';
import {ConversationService} from '../../../domain/conversation-service/conversation.service';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-new-conversation',
  imports: [PromptInput],
  templateUrl: './new-conversation.html',
  styleUrl: './new-conversation.scss',
})
export class NewConversation {
  public conversationId = signal('no');
  private conversationService = inject(ConversationService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  protected handlePromptSubmit(prompt: string) {
    this.conversationService.createAgentConversation(prompt).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      (conversationId) => {
        this.conversationId.set(conversationId);
        this.router.navigate([`/${conversationId}`]).then();
      }
    );
  }
}
