import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConversationHistoryComponent } from './conversation-history.component';
import { SessionService } from '../../../../../domain/session-service/session.service';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('ConversationHistory', () => {
  let component: ConversationHistoryComponent;
  let fixture: ComponentFixture<ConversationHistoryComponent>;
  let mockSessionService: Partial<SessionService>;

  beforeEach(async () => {
    mockSessionService = {
      getConversationFromState: vi.fn().mockReturnValue(undefined),
      isBusy: vi.fn().mockReturnValue(signal(false)())
    };

    await TestBed.configureTestingModule({
      imports: [ConversationHistoryComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationHistoryComponent);
    fixture.componentRef.setInput('conversationId', 'test-conversation-id');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
