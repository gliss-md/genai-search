import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionListComponent } from './session-list.component';
import { SessionService } from '../../../domain/session-service/session.service';
import { ActivatedRoute } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { asConversationId, Conversation } from '../../../domain/types/conversation.type';

interface MockSessionService {
  allConversations: WritableSignal<Conversation[]>;
  deleteConversation: Mock;
}

interface MockActivatedRoute {
  snapshot: {
    params: Record<string, unknown>;
  };
}

describe('SessionList', () => {
  let component: SessionListComponent;
  let fixture: ComponentFixture<SessionListComponent>;
  let mockSessionService: MockSessionService;
  let mockActivatedRoute: MockActivatedRoute;
  let conversationsSignal: WritableSignal<Conversation[]>;

  beforeEach(async () => {
    // Create a signal for conversations
    conversationsSignal = signal([
      { id: asConversationId('conv-1'), title: 'Conversation 1', messageList: [] },
      { id: asConversationId('conv-2'), title: 'Conversation 2', messageList: [] }
    ]);

    mockSessionService = {
      allConversations: conversationsSignal,
      deleteConversation: vi.fn()
    };

    mockActivatedRoute = {
      snapshot: { params: {} }
    };

    await TestBed.configureTestingModule({
      imports: [SessionListComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose conversations from SessionService', () => {
    expect(component.conversations()).toEqual([
      { id: asConversationId('conv-1'), title: 'Conversation 1', messageList: [] },
      { id: asConversationId('conv-2'), title: 'Conversation 2', messageList: [] }
    ]);
  });

  it('should reflect changes in conversations signal', () => {
    expect(component.conversations().length).toBe(2);

    conversationsSignal.set([
      { id: asConversationId('conv-1'), title: 'Conversation 1', messageList: [] },
      { id: asConversationId('conv-2'), title: 'Conversation 2', messageList: [] },
      { id: asConversationId('conv-3'), title: 'Conversation 3', messageList: [] }
    ]);

    expect(component.conversations().length).toBe(3);
  });

  describe('deleteConversation', () => {
    it('should call sessionService.deleteConversation with correct id', () => {
      component.deleteConversation(asConversationId('conv-1'));

      expect(mockSessionService.deleteConversation).toHaveBeenCalledWith(asConversationId('conv-1'));
    });

    it('should call deleteConversation only once', () => {
      component.deleteConversation(asConversationId('conv-2'));

      expect(mockSessionService.deleteConversation).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple delete calls', () => {
      component.deleteConversation(asConversationId('conv-1'));
      component.deleteConversation(asConversationId('conv-2'));
      component.deleteConversation(asConversationId('conv-3'));

      expect(mockSessionService.deleteConversation).toHaveBeenCalledTimes(3);
      expect(mockSessionService.deleteConversation).toHaveBeenNthCalledWith(1, asConversationId('conv-1'));
      expect(mockSessionService.deleteConversation).toHaveBeenNthCalledWith(2, asConversationId('conv-2'));
      expect(mockSessionService.deleteConversation).toHaveBeenNthCalledWith(3, asConversationId('conv-3'));
    });
  });

  describe('Template rendering', () => {
    it('should render conversation titles', () => {
      const compiled = fixture.nativeElement;
      const links = compiled.querySelectorAll('.conversation-link');

      // First link is "Start new", then the conversations
      expect(links.length).toBeGreaterThanOrEqual(2);
    });

    it('should render "Start new" link', () => {
      const compiled = fixture.nativeElement;
      const newConversationDiv = compiled.querySelector('.new');

      expect(newConversationDiv).toBeTruthy();
      expect(newConversationDiv.textContent.trim()).toContain('Start new');
    });

    it('should render delete icons for conversations', () => {
      const compiled = fixture.nativeElement;
      const deleteIcons = compiled.querySelectorAll('.delete-icon');

      expect(deleteIcons.length).toBe(2);
    });

    it('should update UI when conversations change', () => {
      let compiled = fixture.nativeElement;
      let deleteIcons = compiled.querySelectorAll('.delete-icon');
      expect(deleteIcons.length).toBe(2);

      // Add a new conversation
      conversationsSignal.set([
        { id: asConversationId('conv-1'), title: 'Conversation 1', messageList: [] },
        { id: asConversationId('conv-2'), title: 'Conversation 2', messageList: [] },
        { id: asConversationId('conv-3'), title: 'New Conversation', messageList: [] }
      ]);
      fixture.detectChanges();

      compiled = fixture.nativeElement;
      deleteIcons = compiled.querySelectorAll('.delete-icon');
      expect(deleteIcons.length).toBe(3);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty conversations list', () => {
      conversationsSignal.set([]);
      fixture.detectChanges();

      expect(component.conversations().length).toBe(0);

      const compiled = fixture.nativeElement;
      const deleteIcons = compiled.querySelectorAll('.delete-icon');
      expect(deleteIcons.length).toBe(0);
    });

    it('should handle single conversation', () => {
      conversationsSignal.set([
        { id: asConversationId('only-one'), title: 'Only Conversation', messageList: [] }
      ]);
      fixture.detectChanges();

      expect(component.conversations().length).toBe(1);
    });

    it('should handle conversation with special characters in title', () => {
      conversationsSignal.set([
        { id: asConversationId('special'), title: 'Test & <Special> "Characters"', messageList: [] }
      ]);
      fixture.detectChanges();

      expect(component.conversations()[0].title).toBe('Test & <Special> "Characters"');
    });
  });

  describe('Integration', () => {
    it('should work with SessionService to delete and update list', () => {
      expect(component.conversations().length).toBe(2);

      // Simulate deletion
      component.deleteConversation(asConversationId('conv-1'));
      expect(mockSessionService.deleteConversation).toHaveBeenCalledWith(asConversationId('conv-1'));

      // Simulate service updating the conversations signal
      conversationsSignal.set([
        { id: asConversationId('conv-2'), title: 'Conversation 2', messageList: [] }
      ]);
      fixture.detectChanges();

      expect(component.conversations().length).toBe(1);
      expect(component.conversations()[0].id).toBe(asConversationId('conv-2'));
    });
  });
});
