import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Vui lòng khai báo biến môi trường MONGODB_URI');
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache;
};

/**
 * Global variable để lưu cache kết nối.
 * Việc này ngăn chặn việc tạo kết nối mới mỗi khi Vercel Function được gọi lại (Hot Reload).
 */
let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Nếu đã có kết nối rồi thì dùng lại ngay
  if (cached.conn) {
    return cached.conn;
  }

  // Nếu chưa có, tạo kết nối mới
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Tắt buffering để lỗi ném ra ngay nếu DB chết
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
