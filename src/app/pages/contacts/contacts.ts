import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChatSignalrService } from '../../services/chat-signalr.service';

interface ChatContact {
  userId: string;
  fullName: string;
  profileImage?: string | null;
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Contacts</h2>
      <div *ngIf="loading" class="text-gray-500">Loading contacts...</div>
      <div *ngIf="!loading && contacts.length === 0" class="text-gray-500">No contacts found.</div>
      <div class="w-full max-w-md space-y-4">
        <div *ngFor="let contact of contacts" (click)="openChat(contact.userId)"
             class="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <img *ngIf="contact.profileImage" [src]="contact.profileImage" alt="Profile" class="w-12 h-12 rounded-full object-cover mr-4">
          <div *ngIf="!contact.profileImage" class="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xl font-semibold text-gray-700 dark:text-gray-200 mr-4">
            {{ contact.fullName.charAt(0) }}
          </div>
          <span class="text-lg text-gray-900 dark:text-gray-100">{{ contact.fullName }}</span>
        </div>
      </div>
    </div>
  `
})
export class ContactsPageComponent implements OnInit {
  contacts: ChatContact[] = [];
  loading = true;

  constructor(private chatService: ChatSignalrService, private router: Router) {}

  ngOnInit() {
    this.chatService.getChatContacts().subscribe({
      next: contacts => {
        this.contacts = contacts;
        this.loading = false;
      },
      error: () => {
        this.contacts = [];
        this.loading = false;
      }
    });
  }

  openChat(userId: string) {
    this.router.navigate(['/chat', userId]);
  }
} 