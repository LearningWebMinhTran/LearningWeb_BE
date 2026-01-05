import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';

import routes from './routes/index.js';
import openApiSpec from './lib/openapi.js';

const app = new Hono();
app.onError((err, c) => {
  console.log('\n--- ⚠️ CÓ BIẾN ---') // Xuống dòng cho thoáng

  // Mẹo: depth: null giúp in sạch sành sanh mọi ngóc ngách của object lỗi
  // colors: true giúp terminal có màu cho dễ đọc
  console.dir(err, { depth: null, colors: true })

  console.log('------------------\n')

  return c.json({ error: 'Server Error' }, 500)
})


app.use('*', logger())
app.get('/openapi.json', (c) => c.json(openApiSpec));
app.get('/docs', swaggerUI({ url: '/openapi.json' }));
app.route('/api', routes);

const port = Number(process.env.PORT ?? 3000);
serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server listening on http://localhost:${info.port}`);
  }
);
