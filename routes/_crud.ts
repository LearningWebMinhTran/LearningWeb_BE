import { Hono } from 'hono';
import mongoose from 'mongoose';

import dbConnect from '../lib/dbConnect.js';

type AnyMongooseModel = {
  find: (filter: any) => Promise<any>;
  findById: (id: string) => Promise<any>;
  create: (doc: any) => Promise<any>;
  findByIdAndUpdate: (id: string, update: any, options: any) => Promise<any>;
  findByIdAndDelete: (id: string) => Promise<any>;
};

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export function createCrudRouter(model: AnyMongooseModel) {
  const router = new Hono();

  router.use('*', async (_c, next) => {
    await dbConnect();
    await next();
  });

  router.get('/', async (c) => {
    try {
      const docs = await model.find({});
      return c.json({ success: true, data: docs }, 200);
    } catch (error: any) {
      return c.json({ success: false, error: error?.message }, 400);
    }
  });

  router.get('/:id', async (c) => {
    const id = c.req.param('id');
    if (!isValidObjectId(id)) {
      return c.json({ success: false, error: 'Invalid id' }, 400);
    }

    try {
      const doc = await model.findById(id);
      if (!doc) {
        return c.json({ success: false, error: 'Not found' }, 404);
      }

      return c.json({ success: true, data: doc }, 200);
    } catch (error: any) {
      return c.json({ success: false, error: error?.message }, 400);
    }
  });

  router.post('/', async (c) => {
    try {
      const body = await c.req.json();
      const doc = await model.create(body);
      return c.json({ success: true, data: doc }, 201);
    } catch (error: any) {
      return c.json({ success: false, error: error?.message }, 400);
    }
  });

  router.put('/:id', async (c) => {
    const id = c.req.param('id');
    if (!isValidObjectId(id)) {
      return c.json({ success: false, error: 'Invalid id' }, 400);
    }

    try {
      const body = await c.req.json();
      const doc = await model.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return c.json({ success: false, error: 'Not found' }, 404);
      }

      return c.json({ success: true, data: doc }, 200);
    } catch (error: any) {
      return c.json({ success: false, error: error?.message }, 400);
    }
  });

  router.delete('/:id', async (c) => {
    const id = c.req.param('id');
    if (!isValidObjectId(id)) {
      return c.json({ success: false, error: 'Invalid id' }, 400);
    }

    try {
      const doc = await model.findByIdAndDelete(id);
      if (!doc) {
        return c.json({ success: false, error: 'Not found' }, 404);
      }

      return c.json({ success: true, data: doc }, 200);
    } catch (error: any) {
      return c.json({ success: false, error: error?.message }, 400);
    }
  });

  return router;
}
