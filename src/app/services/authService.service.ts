import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, catchError, tap, throwError } from "rxjs";
import { Router } from "@angular/router";

interface LoginResponse {
  token: string;
  // Add other properties if your API returns more data
}

interface LoginRequest {
  userName: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:7047/';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl+"api/AuthUser/login", credentials).pipe(
      tap(response => {
        this.handleLoginSuccess(response.token);
      }),
      catchError(this.handleError)
    );
  }

  private handleLoginSuccess(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
    this.router.navigate(['/']); // Redirect to home after login
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server';
      } else {
        errorMessage = error.error?.message || error.message;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}