import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ChatApiService } from './chat-api';
import { environment } from '../../../../environments/environment';

describe('ChatApiService', () => {
  let service: ChatApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ChatApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a chat session with default user', () => {
    const mockResponse = { session_id: 'test-session-123', user_id: 'user' };

    service.createChatSession().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.session_id).toBe('test-session-123');
      expect(response.user_id).toBe('user');
    });

    const req = httpMock.expectOne(`${baseUrl}/sessions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ user_id: 'user' });
    req.flush(mockResponse);
  });

  it('should create a chat session with custom user', () => {
    const mockResponse = { session_id: 'test-session-456', user_id: 'custom-user' };

    service.createChatSession('custom-user').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.user_id).toBe('custom-user');
    });

    const req = httpMock.expectOne(`${baseUrl}/sessions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ user_id: 'custom-user' });
    req.flush(mockResponse);
  });

  it('should send a message and receive response', () => {
    const mockResponse = { response: 'Hello! How can I help you?' };
    const sessionId = 'test-session-123';
    const userId = 'test-user';
    const message = 'Hello';

    service.sendMessage(sessionId, userId, message).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.response).toBe('Hello! How can I help you?');
    });

    const req = httpMock.expectOne(`${baseUrl}/chat`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      user_id: userId,
      session_id: sessionId,
      message: message
    });
    req.flush(mockResponse);
  });

  it('should handle error when creating chat session', () => {
    const errorMessage = 'Failed to create session';
    let errorReceived = false;

    service.createChatSession().subscribe({
      next: () => {
        throw new Error('Should have failed');
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
        errorReceived = true;
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/sessions`);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });

    expect(errorReceived).toBe(true);
  });

  it('should handle error when sending message', () => {
    const errorMessage = 'Failed to send message';
    let errorReceived = false;

    service.sendMessage('session-123', 'user', 'test').subscribe({
      next: () => {
        throw new Error('Should have failed');
      },
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.error).toBe(errorMessage);
        errorReceived = true;
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/chat`);
    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });

    expect(errorReceived).toBe(true);
  });
});
