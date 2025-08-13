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
  errorMessages: any[];
}

export interface UserResponseById {
  id: string;
  userName: string;
  fullName: string;
  createdOn: string;
  address: string;
  bio: string;
  imageurl: string;
}

export interface RegisterAdminRequest {
  userName: string;
  name: string;
  email: string;
  password: string;
}

export interface ImageUploadRequestDto {
  // Define the properties based on your ImageUploadRequestDto in C#
  // For example:
  file: File;
  // Add other properties if needed
}

export interface UpdateOrderItemStatusRequest {
  Status: string; // or whatever type your status is
}
enum userStatus{
  verified= "Verified",
  rejected="Rejected",
  pending="Pending",
  unverified="Unverified"
}
export interface SellerStatusResponse {
  status: userStatus;
}

export interface PendingSeller {
  id: string;
  userName: string;
  fullName: string;
  createdOn: Date;
  email: string;
  isDeleted: boolean;
  lastUpdatedOn: Date|null;
  roles: string[];
  nationalId: string;
  profileImageUrl: string;
  idCardImageUrl: string;
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

  // POST: Upload user image
  uploadUserImage(request: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/uploadUserImage`, request);
  }

  // DELETE: Delete user by ID
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // POST: Edit seller status
  editSellerStatus(id: string, request: UpdateOrderItemStatusRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/EditSellerStatus/${id}`, request);
  }

  // GET: All unverified sellers
  getAllPendingSellers(): Observable<PendingSeller[]> {
    return this.http.get<PendingSeller[]>(`${this.baseUrl}/PendingSellers`);
  }

  // GET: Seller verification status for current user
  getSellerStatus(): Observable<SellerStatusResponse> {
    return this.http.get<SellerStatusResponse>(`${this.baseUrl}/SellerStatus`);
  }
}