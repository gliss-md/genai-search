import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConversationComponent } from './conversation.component';
import { ConversationService } from '../../../domain/conversation-service/conversation.service';
import { vi } from 'vitest';

describe('ConversationService', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;
  let mockConversationService: any;

  beforeEach(async () => {
    mockConversationService = {
      pushAgentPrompt: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ConversationComponent],
      providers: [
        { provide: ConversationService, useValue: mockConversationService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationComponent);
    fixture.componentRef.setInput('conversationId', 'test-conversation-id');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
