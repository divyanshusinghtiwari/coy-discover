export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  photos: string[];
  bio: string;
  city: string;
  college?: string | null;
  interests: string[];
  isCurrentUser?: boolean;
}

export type SwipeAction = 'like' | 'pass';

export interface SwipeRequest {
  targetUserId: string;
  action: SwipeAction;
}

export interface SwipeResponse {
  success: boolean;
  action: SwipeAction;
  isMatch: boolean;
  match?: {
    id: string;
    matchedUser: Profile;
    matchedAt: string;
  };
}

export interface MatchItem {
  id: string;
  matchedUser: Profile;
  matchedAt: string;
}
