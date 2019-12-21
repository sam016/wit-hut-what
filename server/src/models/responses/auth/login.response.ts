
export interface TokenInfo {
  token: string;
  exp: number;
}

export class LoginResponse implements TokenInfo {
  token: string;
  exp: number;
}
