export interface profile {
  _id: string;
  userId: string;
  name: string;
  userName: string;
  avatar: string;
  bio?: string;
  phoneNo?: string;
  location?: string;
  followers: Array<string>;
  following: Array<string>;
  followersCount: string;
  followingCount: string;
}

export interface profileResponse {
  profile: profile | null;
  message?: string;
}

export interface profileState {
  profile: profile | null;
  isLoading: boolean;
  error: string | null;
}
