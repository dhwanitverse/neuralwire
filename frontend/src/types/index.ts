export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  // Google OAuth fields
  googleId?: string;
  profilePicture?: string | null;
  authProvider?: 'local' | 'google';
  emailVerified?: boolean;
  createdAt?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  image: string;
  author: string;
  authorAvatar?: string;
  featured: boolean;
  editorsPick?: boolean;
  views?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: User & { token: string };
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

export interface BlogFormData {
  title: string;
  description: string;
  content: string;
  category: string;
  image: string;
  author: string;
  authorAvatar?: string;
  featured?: boolean;
  editorsPick?: boolean;
}
