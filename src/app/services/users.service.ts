import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDisplay {
  id: number;
  userName: string;
  fullName: string;
  createdOn: string;
  email: string;
  isDeleted: boolean;
  lastUpdatedOn: string;
}
export interface UserResponse {
  userName: string;
  fullName: string;
  email: string;
 errorMessages: any[]
}
export interface UserResponseById{
    id: string,
    userName:string,
    fullName:string,
    createdOn:string,
    address:string,
    bio:string,
    imageurl:string,
}

export interface RegisterAdminRequest {
  userName: string;
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7047/api/User';
  private readonly authBaseUrl = 'https://localhost:7047/api/AuthUser';

  // GET all users
  getAll(): Observable<UserDisplay[]> {
    return this.http.get<UserDisplay[]>(this.baseUrl);
  }

  // GET user by ID
    getById(id: string): Observable<UserResponseById> {
        return this.http.get<UserResponseById>(`${this.baseUrl}/${id}`);
    }

  // POST: Register new admin
  registerAdmin(adminData: RegisterAdminRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.authBaseUrl}/register`, adminData);
  }
}
