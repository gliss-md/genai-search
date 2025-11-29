import {Injectable, signal} from '@angular/core';
import {Conversation, ConversationId, Message} from '../types/conversation.type';
import {replaceAt} from '../utils/array.helper';

const CONVERSATION_SESSION_LOCAL_STORAGE_KEY = 'CONVERSATION_SESSION_LOCAL_STORAGE_KEY';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public allConversations = signal(this.getAllConversations());
  private busyConversationIsList = signal(new Set());

  public getAllConversations(): Conversation[] {
    const localStorageItem = localStorage.getItem(CONVERSATION_SESSION_LOCAL_STORAGE_KEY);
    return localStorageItem ? (JSON.parse(localStorageItem) as Conversation[]) : [];
  }

  public getConversation(conversationId: ConversationId): Conversation | undefined {
    return this.allConversations().find((c) => c.id === conversationId);
  }

  public getConversationFromState(conversationId: ConversationId): Conversation | null {
    return this.allConversations().find((conversation) => conversation.id === conversationId) ?? null;
  }

  public setBusy(conversationId: ConversationId, isBusy: boolean): void {
    const currentBusySet = this.busyConversationIsList();
    const updatedBusySet = new Set(currentBusySet);
    if (isBusy) {
      updatedBusySet.add(conversationId);
    } else {
      updatedBusySet.delete(conversationId);
    }
    this.busyConversationIsList.set(updatedBusySet);
  }

  public isBusy(conversationId: ConversationId): boolean {
    return this.busyConversationIsList().has(conversationId);
  }

  public createOrUpdateConversation(conversation: Conversation): void {
    const allConversations = this.getAllConversations();
    const existingIndex = allConversations.findIndex((c) => c.id === conversation.id);
    const updatedConversationList =
      existingIndex === -1
        ? [...allConversations, conversation]
        : replaceAt(allConversations, existingIndex, conversation);
    localStorage.setItem(
      CONVERSATION_SESSION_LOCAL_STORAGE_KEY,
      JSON.stringify(updatedConversationList),
    );
    this.allConversations.set(updatedConversationList);
  }

  public deleteConversation(conversationId: ConversationId): void {
    const allConversations = this.allConversations();
    const updatedConversationList = allConversations.filter((c) => c.id !== conversationId);
    localStorage.setItem(
      CONVERSATION_SESSION_LOCAL_STORAGE_KEY,
      JSON.stringify(updatedConversationList),
    );
    this.allConversations.set(updatedConversationList);
  }

  public addMessageToConversation(id: ConversationId, message: Message) {
    const conversation = this.getConversation(id);
    if (!conversation) {
      throw new Error(`Conversation with id ${id} not found`);
    }
    const updatedConversation: Conversation = {
      ...conversation,
      messageList: [...conversation.messageList, message],
    };
    this.createOrUpdateConversation(updatedConversation);
  }
}
