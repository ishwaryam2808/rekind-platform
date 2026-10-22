export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  avatar: string;
  bio?: string;
  badges: string[];
  trustScore: number;
  itemsSharedCount: number;
  itemsReceivedCount: number;
  createdAt: string;
}

export type SharingType = 'donate' | 'lend' | 'exchange' | 'sell';
export type ItemCondition = 'Like New' | 'Gently Used' | 'Good' | 'Fair' | 'Needs TLC';
export type ItemStatus = 'available' | 'reserved' | 'completed';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  type: SharingType;
  condition: ItemCondition;
  price: number;
  currency?: 'INR' | 'USD';
  isFree: boolean;
  lendingDuration?: string;
  exchangePreferences?: string;
  quantity: number;
  location: string;
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerTrustScore: number;
  ownerLocation: string;
  status: ItemStatus;
  views: number;
  tags: string[];
  safetyNotes?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  userRequest?: ItemRequest | null;
}

export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface ItemRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemType: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  ownerId: string;
  requestType: string;
  proposedExchange?: string;
  borrowDuration?: string;
  message: string;
  status: RequestStatus;
  meetupPreference?: string;
  createdAt: string;
}

export type NeedUrgency = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CommunityNeed {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  location: string;
  urgency: NeedUrgency;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  status: 'open' | 'fulfilled';
  offersCount: number;
  createdAt: string;
}

export interface CommunityNeedOffer {
  id: string;
  needId: string;
  offererId: string;
  offererName: string;
  offererAvatar: string;
  linkedItemId?: string | null;
  message: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails: Record<string, { name: string; avatar: string; location?: string }>;
  itemId?: string | null;
  itemTitle?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: Record<string, number>;
  messages: Message[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request_received' | 'request_accepted' | 'request_declined' | 'need_offer' | 'message_received' | 'transfer_completed';
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface TransferRecord {
  id: string;
  itemId: string;
  itemTitle: string;
  category: string;
  sharingType: string;
  fromUserName: string;
  toUserName: string;
  weightKg: number;
  valueSaved: number;
  completedAt: string;
}

export interface ImpactMetrics {
  totalTransfers: number;
  wasteDivertedKg: number;
  economicValueSaved: number;
  co2DivertedKg: number;
  uniqueParticipants: number;
  activeListings: number;
  activeNeeds: number;
}
