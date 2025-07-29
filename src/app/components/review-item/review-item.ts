import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../shared/service.interface';



@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-item.html',
  styleUrl: './review-item.css'
})
export class ReviewItemComponent {
  @Input() review!: Review;
  @Input() language: 'en' | 'ar' = 'en';
  
  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }
  
  isStarFilled(index: number): boolean {
    return index < Math.floor(this.review.rating);
  }
  
  get labels() {
    return {
      verified_purchase: this.language === 'en' ? 'Verified Purchase' : 'عملية شراء موثقة',
      helpful: this.language === 'en' ? 'Helpful' : 'مفيد'
    };
  }
}