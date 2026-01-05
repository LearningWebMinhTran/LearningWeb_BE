import mongoose from "mongoose";

// Định nghĩa cấu trúc dữ liệu
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vui lòng nhập tên"], // Validate: bắt buộc nhập
    maxlength: [50, "Tên không quá 50 ký tự"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Kiểm tra xem Model đã tồn tại chưa để tránh lỗi "OverwriteModelError" khi compile lại
export default mongoose.models.User || mongoose.model("User", UserSchema);
