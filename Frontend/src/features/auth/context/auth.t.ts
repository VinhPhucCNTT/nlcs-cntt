export interface IUser {
  email: string;
  roles: string[];
  /** NameIdentifier claim (user id). */
  userId: string;
}

export interface IAuthContext {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (token: string) => void;
  logout: () => void;
}
