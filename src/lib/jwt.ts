import jwt from 'jsonwebtoken';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET 未設定');
  return secret;
}

export function signToken(payload: object, expiresIn = '7d'): string {
  const secret = getJwtSecret();
  const options = { expiresIn } as jwt.SignOptions;
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string) {
  const secret = getJwtSecret();
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}
