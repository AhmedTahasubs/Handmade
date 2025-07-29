export interface Message {
  id: number | string; // Allow string for temporary IDs
  senderId: string;
  recipientId: string;
  content: string;
  sentAt: string;
  delivered: boolean;
  isOptimistic?: boolean;
}
