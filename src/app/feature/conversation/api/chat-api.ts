import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  public createChatSession(userId = 'user'): Observable<{ session_id: string; user_id: string }> {
    return this.httpClient
      .post<{ session_id: string; user_id: string }>(`${this.baseUrl}/sessions`, {user_id: userId});
  }

  public sendMessage(sessionId: string, userId: string, message: string): Observable<{ response: string }> {
    return this.httpClient.post<{ response: string }>(`${this.baseUrl}/chat`, {
      user_id: userId,
      session_id: sessionId,
      message: message
    });
  }
}
