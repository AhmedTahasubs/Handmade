import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category: string;
  seller: string;
  isCustomizable: boolean;
  deliveryTime: string;
}

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ServiceCardComponent {
  @Input() service!: Service;
  @Input() language: 'en' | 'ar' = 'en';
 public Math = Math;

  get stars(): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(this.service?.rating || 0) ? 1 : 0);
  }

  get halfStar(): boolean {
    return (this.service?.rating || 0) % 1 >= 0.5;
  }
}
