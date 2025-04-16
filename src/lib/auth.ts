// lib/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'my-secret';



export function signToken(payload: object, expiresIn = '7d') {
    return jwt.sign(payload, SECRET, { expiresIn })
}


export const verifyToken = async () => {
    // 等待 cookies() 返回的 Promise 解析
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('未登录');
    }

    try {
        // 验证 JWT Token
        const decoded = jwt.verify(token, SECRET);
        return decoded;
    } catch (e) {
        // 捕获并抛出 Token 失效的错误
        throw new Error('Token 失效');
    }
};