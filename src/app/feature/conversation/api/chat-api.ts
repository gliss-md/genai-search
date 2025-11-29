import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  private httpClient = inject(HttpClient);

  public createChatSession(userId = 'user'): Observable<{ session_id: string; user_id: string }> {
    return this.httpClient
      .post<{ session_id: string; user_id: string }>('http://localhost:8000/sessions', {user_id: userId});
  }

  public sendMessage(sessionId: string, userId: string, message: string): Observable<{ response: string }> {
    return this.httpClient.post<{ response: string }>('http://localhost:8000/chat', {
      user_id: userId,
      session_id: sessionId,
      message: message
    });
  }
}
