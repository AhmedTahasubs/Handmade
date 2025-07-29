import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// تعريف DTO لاستجابة الفئة من واجهة برمجة التطبيقات الخاصة بك
export interface CategoryDto {
  id: number; // تم التغيير من string إلى number بناءً على C# DTO الخاص بك
  name: string;
  imageUrl: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7047/api/Categories'; // نقطة نهاية API الخاصة بك

  getCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(this.apiUrl);
  }

  getCategory(id: number): Observable<CategoryDto> {
    return this.http.get<CategoryDto>(`${this.apiUrl}/${id}`);
  }

  createCategory(name: string, file?: File): Observable<CategoryDto> {
    const formData = new FormData();
    formData.append('name', name);
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<CategoryDto>(this.apiUrl, formData);
  }

  updateCategory(id: number, name: string, file?: File): Observable<CategoryDto> {
    const formData = new FormData();
    formData.append('name', name);
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<CategoryDto>(`${this.apiUrl}/${id}`, formData);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}