import { Employee } from "../models/domain";

interface JwtToken {
  token: string;
  expiresAt: number;
}

export function generateJwt(employee: Employee): JwtToken {
  return {
    token: "~~TOKEN~~",
    expiresAt: Date.now(),
  };
}
