import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  imageUrl: string | null;
}

export interface CategoryRequest {
  name: string;
  file: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategorySellerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7047/api/Categories';

  // GET all categories
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  // GET category by ID
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  // SEARCH by name
  searchByName(name: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/search/${name}`);
  }

  // POST create
  create(category: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category);
  }

  // PUT update
  update(id: number, category: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, category);
  }

  // DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
