// star-rating.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center">
      <button 
        *ngFor="let star of stars" 
        type="button"
        (click)="rate(star)"
        (mouseenter)="hoverRating = star"
        (mouseleave)="hoverRating = 0"
        class="text-2xl focus:outline-none"
        [class.text-yellow-400]="star <= (hoverRating || currentRating)"
        [class.text-gray-300]="star > (hoverRating || currentRating)"
        [class.dark:text-yellow-300]="star <= (hoverRating || currentRating)"
        [class.dark:text-gray-500]="star > (hoverRating || currentRating)"
      >
        {{ star <= (hoverRating || currentRating) ? '★' : '☆' }}
      </button>
      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
        {{ currentRating }} of 5
      </span>
    </div>
  `,
  styles: []
})
export class StarRatingComponent {
  @Input() currentRating = 0;
  @Output() currentRatingChange  = new EventEmitter<number>();
  
  hoverRating = 0;
  stars = [1, 2, 3, 4, 5];

  rate(star: number): void {
    this.currentRating = star;
    this.currentRatingChange.emit(star);
  }
}