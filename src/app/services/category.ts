import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceDto } from '../shared/service.interface';

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
}