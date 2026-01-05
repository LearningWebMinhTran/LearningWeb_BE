import { Hono } from 'hono';
import bcrypt from 'bcryptjs';

import dbConnect from '../lib/dbConnect.js';
import User from '../models/User.js';
import { signAccessToken, verifyAccessToken } from '../lib/auth.js';

const auth = new Hono();

auth.use('*', async (_c, next) => {
  await dbConnect();
  await next();
});

auth.post('/register', async (c) => {
  const body = await c.req.json().catch(() => null);
  const name = body?.name;
  const email = body?.email;
  const password = body?.password;

  if (!name || !email || !password) {
    return c.json({ success: false, error: 'Missing name/email/password' }, 400);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return c.json({ success: false, error: 'Email already exists' }, 409);
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
  const email = body?.email;
  const password = body?.password;

  if (!email || !password) {
    return c.json({ success: false, error: 'Missing email/password' }, 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) {
    return c.json({ success: false, error: 'Invalid credentials' }, 401);
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return c.json({ success: false, error: 'Invalid credentials' }, 401);
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
    return c.json({ success: false, error: 'Missing Bearer token' }, 401);
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return c.json({ success: false, error: 'Not found' }, 404);
    }

    return c.json({ success: true, data: user }, 200);
  } catch (_err) {
    return c.json({ success: false, error: 'Invalid token' }, 401);
  }
});

export default auth;
