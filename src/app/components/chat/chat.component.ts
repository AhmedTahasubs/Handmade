import { Component, Input, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChatSignalrService } from '../../services/chat-signalr.service';
import { Message } from '../../models/message.model';
import { Subscription, merge, of } from 'rxjs';
import { scan, tap, filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Extend Message interface locally without modifying the original
interface MessageWithOptimistic extends Message {
  isOptimistic?: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() otherUserId!: string;
  @Input() currentUserId!: string;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: MessageWithOptimistic[] = [];
  newMessage = '';
  page = 1;
  pageSize = 20;
  loading = false;
  connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected';

  private subs: Subscription[] = [];

  constructor(private chatService: ChatSignalrService) {}

  ngOnInit(): void {
    console.log('🚀 Chat Component Init - Current User:', this.currentUserId, 'Other User:', this.otherUserId);

    // Handle browser/tab close events
    this.setupDisconnectionHandlers();

    this.chatService.connect();
    this.subs.push(
      this.chatService.connectionStatus$.subscribe(status => {
        console.log('📡 Connection Status:', status);
        this.connectionStatus = status;
      })
    );

    this.loadMessages();

    // FIXED: Use receiverId instead of recipientId to match what SignalR sends
    this.subs.push(
      this.chatService.incomingMessage$
        .pipe(
          tap(msg => console.log('📨 RAW MESSAGE RECEIVED:', JSON.stringify(msg, null, 2))),
          tap(msg => console.log('🔍 Filter Check - SenderId:', msg.senderId, 'ReceiverId:', (msg as any).receiverId)),
          tap(msg => console.log('🔍 Should Accept:',
            `(${msg.senderId} === ${this.otherUserId} && ${(msg as any).receiverId} === ${this.currentUserId}) = ${msg.senderId === this.otherUserId && (msg as any).receiverId === this.currentUserId}`,
            `||`,
            `(${msg.senderId} === ${this.currentUserId} && ${(msg as any).receiverId} === ${this.otherUserId}) = ${msg.senderId === this.currentUserId && (msg as any).receiverId === this.otherUserId}`
          )),
          filter(msg => {
            const receiverId = (msg as any).receiverId;
            return (msg.senderId === this.otherUserId && receiverId === this.currentUserId) ||
              (msg.senderId === this.currentUserId && receiverId === this.otherUserId);
          }),
          tap(msg => console.log('✅ MESSAGE PASSED FILTER:', msg)),
          tap(msg => {
            // Only mark delivered for messages we received (not sent)
            const receiverId = (msg as any).receiverId;
            if (receiverId === this.currentUserId) {
              console.log('📋 Marking message as delivered:', msg.id);
              this.markDelivered([msg.id as number]);
            }
          })
        )
        .subscribe(msg => {
          console.log('🎯 PROCESSING MESSAGE:', msg);
          this.handleIncomingMessage(msg);
        })
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 200);
  }

  loadMessages(): void {
    console.log('📂 Loading messages...');
    this.loading = true;
    this.chatService.fetchMessages(this.otherUserId, this.page, this.pageSize).subscribe({
      next: msgs => {
        console.log('📂 Loaded messages:', msgs);
        this.messages = msgs.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
        // Fix: Use receiverId for loaded messages too if they have it
        this.markDelivered(msgs.filter(m => {
          const receiverId = (m as any).receiverId || m.recipientId;
          return !m.delivered && receiverId === this.currentUserId;
        }).map(m => m.id as number));
        setTimeout(() => this.scrollToBottom(), 100);
      },
      complete: () => this.loading = false,
      error: (error) => console.error('❌ Error loading messages:', error)
    });
  }

  sendMessage(): void {
    const content = this.newMessage.trim();
    if (!content) return;

    console.log('📤 Sending message:', content, 'to:', this.otherUserId);

    // SIMPLIFIED: No optimistic updates for now
    this.newMessage = '';

    // Send message via SignalR
    this.chatService.sendMessage(this.otherUserId, content)
      .then(() => {
        console.log('✅ Message sent successfully');
      })
      .catch(error => {
        console.error('❌ Failed to send message:', error);
        // Restore message in input on failure
        this.newMessage = content;
      });
  }

  private handleIncomingMessage(msg: Message): void {
    console.log('🎯 handleIncomingMessage called with:', msg);

    // Simple duplicate check by ID
    const existingMessage = this.messages.find(m => m.id === msg.id);
    if (existingMessage) {
      console.log('🔄 Message already exists, ignoring duplicate:', msg.id);
      return;
    }

    console.log('➕ Adding message to UI:', msg);
    this.messages.push(msg);
    this.messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

    console.log('📋 Current messages array:', this.messages);

    setTimeout(() => this.scrollToBottom(), 100);
  }

  // Helper method to check if message is optimistic (for template)
  isOptimisticMessage(message: MessageWithOptimistic): boolean {
    return message.isOptimistic || false;
  }

  markDelivered(ids: number[]): void {
    if (!ids.length) return;
    console.log('📋 Marking delivered:', ids);
    this.chatService.markDelivered(ids).subscribe({
      next: () => console.log('✅ Marked as delivered'),
      error: (error) => console.error('❌ Error marking delivered:', error)
    });
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      try {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        console.log('📜 Scrolled to bottom');
      } catch (error) {
        console.error('❌ Error scrolling:', error);
      }
    }
  }

  ngOnDestroy(): void {
    console.log('🔌 Chat Component Destroy');
    this.cleanupConnections();
  }

  private setupDisconnectionHandlers(): void {
    // Handle page refresh/close
    window.addEventListener('beforeunload', (event) => {
      console.log('🚪 Page unloading - disconnecting SignalR');
      this.chatService.disconnect();
    });

    // Handle browser back/forward navigation
    window.addEventListener('pagehide', (event) => {
      console.log('🚪 Page hiding - disconnecting SignalR');
      this.chatService.disconnect();
    });

    // Handle visibility change (tab switching, minimizing)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('👁️ Page hidden - user may have left');
        // Optional: You might want to set a timeout here instead of immediate disconnect
        // setTimeout(() => {
        //   if (document.hidden) {
        //     this.chatService.disconnect();
        //   }
        // }, 30000); // Disconnect after 30 seconds of being hidden
      } else {
        console.log('👁️ Page visible - reconnecting if needed');
        if (this.connectionStatus === 'disconnected') {
          this.chatService.connect();
        }
      }
    });

    // Handle online/offline events
    window.addEventListener('online', () => {
      console.log('🌐 Back online - reconnecting');
      if (this.connectionStatus === 'disconnected') {
        this.chatService.connect();
      }
    });

    window.addEventListener('offline', () => {
      console.log('🌐 Gone offline - disconnecting');
      this.chatService.disconnect();
    });
  }

  private cleanupConnections(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.chatService.disconnect();

    // Remove event listeners to prevent memory leaks
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('pagehide', this.handlePageHide);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  // Event handler methods for proper cleanup
  private handleBeforeUnload = (event: BeforeUnloadEvent) => {
    this.chatService.disconnect();
  };

  private handlePageHide = (event: PageTransitionEvent) => {
    this.chatService.disconnect();
  };

  private handleVisibilityChange = () => {
    if (document.hidden) {
      console.log('👁️ Page hidden');
    } else {
      console.log('👁️ Page visible');
      if (this.connectionStatus === 'disconnected') {
        this.chatService.connect();
      }
    }
  };

  private handleOnline = () => {
    if (this.connectionStatus === 'disconnected') {
      this.chatService.connect();
    }
  };

  private handleOffline = () => {
    this.chatService.disconnect();
  };
}
