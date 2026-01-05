import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as Secret | undefined;

if (!JWT_SECRET) {
  throw new Error('Vui lòng khai báo biến môi trường JWT_SECRET');
}

export type JwtPayload = {
  sub: string;
};

export function signAccessToken(userId: string) {
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'];
  return jwt.sign({ sub: userId } satisfies JwtPayload, JWT_SECRET, { expiresIn });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
