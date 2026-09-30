export type ItemCategory = "photo" | "document" | "note" | "secret";

export interface VaultItem {
  id: string;
  title: string;
  category: ItemCategory;
  fileType?: string; // e.g., 'image/png', 'application/pdf', 'txt', 'js'
  size?: number; // bytes
  content?: string; // Text content, secret value, or base64 data URL / preview link
  thumbnailUrl?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    dimensions?: string;
    pageCount?: number;
    url?: string;
    username?: string;
    notes?: string;
  };
}

export interface UserSession {
  authenticated: boolean;
  user: string;
  loginTime?: string;
}
