import { Hono } from 'hono';
import bcrypt from 'bcryptjs';

import dbConnect from '../lib/dbConnect.js';
import User from '../models/User.js';
import { signAccessToken, verifyAccessToken } from '../lib/auth.js';

const auth = new Hono();

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

auth.use('*', async (_c, next) => {
  await dbConnect();
  await next();
});

auth.post('/register', async (c) => {
  const body = await c.req.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!name || !email || !password) {
    return c.json({ success: false, message: 'Missing name/email/password' }, 400);
  }

  if (name.length > 50) {
    return c.json({ success: false, message: 'Name is too long' }, 400);
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return c.json({ success: false, message: 'Invalid email format' }, 400);
  }

  if (password.length < 8) {
    return c.json({ success: false, message: 'Password must be at least 8 characters' }, 400);
  }

  const existing = await User.findOne({ email: new RegExp(`^${escapeRegExp(email)}$`, 'i') });
  if (existing) {
    return c.json({ success: false, message: 'Email already exists' }, 409);
  }

  const user = await User.create({ name, email, password });
  const token = signAccessToken(String(user._id));

  return c.json(
    {
      success: true,
      data: {
        token,
        user,
      },
    },
    201
  );
});

auth.post('/login', async (c) => {
  const body = await c.req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!email || !password) {
    return c.json({ success: false, message: 'Missing email/password' }, 400);
  }

  const user = await User.findOne({ email: new RegExp(`^${escapeRegExp(email)}$`, 'i') }).select('+password');
  if (!user || !user.password) {
    return c.json({ success: false, message: 'Invalid credentials' }, 401);
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return c.json({ success: false, message: 'Invalid credentials' }, 401);
  }

  const token = signAccessToken(String(user._id));

  // Ensure password never goes out
  user.password = undefined;

  return c.json({ success: true, data: { token, user } }, 200);
});

auth.get('/me', async (c) => {
  const authHeader = c.req.header('authorization') ?? '';
  const match = authHeader.match(/^Bearer\s+(?<token>.+)$/i);
  const token = match?.groups?.token;

  if (!token) {
    return c.json({ success: false, message: 'Missing Bearer token' }, 401);
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return c.json({ success: false, message: 'Not found' }, 404);
    }

    return c.json({ success: true, data: user }, 200);
  } catch (_err) {
    return c.json({ success: false, message: 'Invalid token' }, 401);
  }
});

export default auth;
