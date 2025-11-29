import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionListComponent } from './session-list.component';
import { SessionService } from '../../../domain/session-service/session.service';
import { ActivatedRoute } from '@angular/router';
import { vi } from 'vitest';

describe('SessionList', () => {
  let component: SessionListComponent;
  let fixture: ComponentFixture<SessionListComponent>;
  let mockSessionService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockSessionService = {
      getAllConversations: vi.fn().mockReturnValue([])
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
});
