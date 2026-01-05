import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // VD: "Mastering LangChain"
    slug: { type: String, required: true, unique: true },
    thumbnail: String, // URL ảnh bìa
    description: String, // Mô tả ngắn hiển thị ở trang danh sách
    price: { type: Number, default: 0 }, // 0 = Free
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },

    // Liên kết Categories
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],

    // Quan trọng: Lưu danh sách ID bài học để sắp xếp thứ tự (Chapter 1, Chapter 2...)
    chapters: [
      {
        title: String, // Tên chương. VD: "01. Fundamentals"
        lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }], // Link tới bảng Content
      },
    ],

    is_published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
