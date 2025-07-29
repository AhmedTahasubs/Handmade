import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../../components/chat/chat.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, ChatComponent],
  template: `
    <app-chat *ngIf="otherUserId && currentUserId"
      [otherUserId]="otherUserId"
      [currentUserId]="currentUserId"
      class="full-chat-screen">
    </app-chat>
  `
})
export class ChatPageComponent {
  otherUserId: string | null = null;
  currentUserId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.otherUserId = params['userId'];
    });
    // For demo, get current userId from localStorage. Replace with real user service as needed.
    const user = localStorage.getItem('user');
    this.currentUserId = user ? JSON.parse(user).id : null;
  }
} 