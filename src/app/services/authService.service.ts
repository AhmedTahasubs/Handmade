import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, catchError, tap, throwError } from "rxjs";
import { Router } from "@angular/router";

export interface User {
  userName: string;
  fullName: string;
  email: string;
  errorMessages: string[];
}

interface LoginResponse {
  user: User;
  token: string;
}
interface RegisterResponse {
  user: User;
}

interface LoginRequest {
  userName: string;
  password: string;
}

interface CustomerRegisterRequest {
  userName: string;
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  address: string | null;
  hasWhatsApp: boolean;
}

interface SellerRegisterRequest extends CustomerRegisterRequest {
  nationalId: string;
  bio: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:7047/';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  currentUser = new BehaviorSubject<User | null>(this.getStoredUser());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + "api/AuthUser/login", credentials).pipe(
      tap(response => {
        this.handleLoginSuccess(response.token, response.user);
      }),
      catchError(this.handleError)
    );
  }

  registerCustomer(customerData: CustomerRegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.baseUrl + "api/AuthUser/register/customer",
      customerData
    ).pipe(
      tap(response => {
        this.handleSignupSuccess();
      }),
      catchError(this.handleError)
    );
  }

  registerSeller(sellerData: SellerRegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.baseUrl + "api/AuthUser/register/seller",
      sellerData
    ).pipe(
      tap(response => {
        this.handleSignupSuccess();
        console.log(response)
      }),
      catchError(this.handleError)
    );
  }

  private handleLoginSuccess(token: string, user: User): void {
    if (!token || !user)
      return;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedIn.next(true);
    this.currentUser.next(user);
    this.router.navigate(['/']); // Redirect to home after login/registration
  }
  private handleSignupSuccess(): void {
    this.router.navigate(['/login']); // Redirect to login after successful registration
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
      } else if (error.status === 400) {
        // Try to get error messages from the response if available
        errorMessage = error.error?.user?.errorMessages?.join(', ') || 
                      error.error?.message || 
                      'Validation failed';
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
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    return this.getStoredUser();
  }
}