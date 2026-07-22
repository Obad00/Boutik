export interface SuperadminSession {
  id: string;
  name: string;
  email: string;
}

export interface ISuperadminAuthService {
  login(email: string, password: string): Promise<SuperadminSession | null>;
  getToken(): string | null;
  logout(): void;
}
