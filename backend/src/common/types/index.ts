export interface AuthUser {
  id: string; // string representation of BigInt
  username: string;
  email: string;
  role: string;
  status: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
