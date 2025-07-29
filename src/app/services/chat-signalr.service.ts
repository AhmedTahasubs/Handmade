import { Injectable, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject, from, of, timer } from 'rxjs';
import { catchError, filter, retryWhen, switchMap, takeUntil, tap, delayWhen } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class ChatSignalrService implements OnDestroy {
  private hubConnection: HubConnection | null = null;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private incomingMessageSubject = new Subject<Message>();
  private connectionStatusSubject = new BehaviorSubject<'connected' | 'disconnected' | 'connecting'>('disconnected');
  private destroy$ = new Subject<void>();

  private readonly apiUrl = 'https://localhost:7047/api/chat';
  private readonly hubUrl = 'https://localhost:7047/chat';

  constructor(private http: HttpClient) {}

  get messages$(): Observable<Message[]> {
    return this.messagesSubject.asObservable();
  }

  get incomingMessage$(): Observable<Message> {
    return this.incomingMessageSubject.asObservable();
  }

  get connectionStatus$(): Observable<'connected' | 'disconnected' | 'connecting'> {
    return this.connectionStatusSubject.asObservable();
  }

  /**
   * Fetches the user's chat contacts.
   */
  getChatContacts(): Observable<{ userId: string; fullName: string; profileImage?: string | null }[]> {
    const jwt = localStorage.getItem('jwt');
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwt}` });
    return this.http.get<{ userId: string; fullName: string; profileImage?: string | null }[]>(`${this.apiUrl}/contacts`, { headers });
  }

  connect(): void {
    if (this.hubConnection) return;
    this.connectionStatusSubject.next('connecting');
    const jwt = localStorage.getItem('jwt');
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => jwt || ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      this.incomingMessageSubject.next(message);
    });

    this.hubConnection.onclose(() => {
      this.connectionStatusSubject.next('disconnected');
      this.hubConnection = null;
    });

    this.hubConnection.onreconnecting(() => {
      this.connectionStatusSubject.next('connecting');
    });

    this.hubConnection.onreconnected(() => {
      this.connectionStatusSubject.next('connected');
    });

    this.hubConnection
      .start()
      .then(() => this.connectionStatusSubject.next('connected'))
      .catch(() => this.connectionStatusSubject.next('disconnected'));
  }

  disconnect(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = null;
      this.connectionStatusSubject.next('disconnected');
    }
  }

  sendMessage(toUserId: string, content: string): Promise<void> {
    if (!this.hubConnection) return Promise.reject('Not connected');
    return this.hubConnection.invoke('SendMessage', toUserId, content);
  }

  fetchMessages(otherUserId: string, page: number, pageSize: number): Observable<Message[]> {
    const jwt = localStorage.getItem('jwt');
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwt}` });
    const params = new HttpParams()
      .set('userId', otherUserId)
      .set('page', page.toString())
      .set('pagesize', pageSize.toString());
    return this.http.get<Message[]>(`${this.apiUrl}/messages`, { headers, params });
  }

  markDelivered(messageIds: number[]): Observable<any> {
    if (!messageIds.length) return of(null);
    const jwt = localStorage.getItem('jwt');
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwt}` });
    return this.http.post(`${this.apiUrl}/mark-delivered`, messageIds, { headers });
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
