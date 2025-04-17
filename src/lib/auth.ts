// lib/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ApiResponse } from './response';

const SECRET = process.env.JWT_SECRET || 'my-secret';

export function signToken(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export const verifyToken = async (): Promise<{ id: string; email: string; isAdmin: boolean } | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string; email: string; isAdmin: boolean };
    return decoded;
  } catch (e) {
    return null;
  }
};
