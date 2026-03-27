type role = "user" | "admin";

//* types
export interface User {
  id: string;
  email: string;
  isEmailVerified: boolean;
  role: role;
  profile: string;
}
// user response
export interface AuthResponse {
  user: User;
  message: string;
}
// interface type
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  message: string | null;
  link: string | null;
}
