import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Định nghĩa cấu trúc dữ liệu
const UserSchema = new mongoose.Schema(

  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true,
      maxlength: [50, 'Tên không quá 50 ký tự'],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    // Password cho đăng nhập (hash bằng bcrypt)
    password: {
      type: String,
      required: true,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

UserSchema.pre('save', async function hashPassword(this: any) {
  if (!this.isModified('password')) return;
  if (!this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});

export type User = mongoose.InferSchemaType<typeof UserSchema>;

// Kiểm tra xem Model đã tồn tại chưa để tránh lỗi "OverwriteModelError" khi compile lại
const UserModel =
  (mongoose.models.User as mongoose.Model<User> | undefined) ||
  mongoose.model<User>('User', UserSchema);

export default UserModel;
