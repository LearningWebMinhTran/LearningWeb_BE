import mongoose from 'mongoose';

// --- A. Sub-Schema: Exercise (Bài tập) ---
// Định nghĩa cấu trúc bài tập bên phải màn hình của bạn
const ExerciseSchema = new mongoose.Schema({
  title: { type: String, required: true }, // VD: "Bài 3: Conditional Chain"
  type: { type: String, enum: ['quiz', 'code', 'flow'], default: 'code' },

  // Nội dung đề bài
  instructions: String, // Hướng dẫn ("Nhập document...")

  // Cấu hình cho Code Editor
  initial_code: String, // Code mẫu ban đầu
  solution_code: String, // Code đáp án (để check hoặc gợi ý)

  // Cấu hình cho Flow Diagram (LangChain visual)
  flow_config: {
    steps: [String], // ["Detect Language", "Translate", "Summarize"]
    logic: mongoose.Schema.Types.Mixed, // JSON cấu hình logic
  },

  // Input mẫu (cái khung trắng "Document Text" trong ảnh)
  default_input: String,
});

// --- B. Main Schema: Content (Post & Lesson) ---
const ContentSchema = new mongoose.Schema(
  {
    // 1. Thông tin chung
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    thumbnail: String,
    description: String, // SEO Meta description

    // 2. Phân loại
    type: {
      type: String,
      enum: ['post', 'lesson'],
      required: true,
      default: 'post',
    },

    // Link tới Category (cho cả Post và Lesson)
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    tags: [String], // Tags tìm kiếm nhanh: ["RAG", "VectorDB"]

    // 3. Nội dung chi tiết (Cấu trúc như ảnh bạn gửi)
    objectives: [String], // "Mục tiêu học tập"
    body: String, // Nội dung chính (Markdown/HTML)

    // Phần "Áp dụng cho dự án" (Khung xanh trong ảnh)
    project_application: {
      title: String,
      steps: [String],
      expected_result: String,
    },

    // 4. Dành riêng cho Lesson (Nếu type = 'post' thì mấy field này null)
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },

    // 5. Bài tập thực hành (Nhúng trực tiếp ExerciseSchema vào đây)
    exercises: [ExerciseSchema],

    // 6. Trạng thái
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
);

// Đánh index để tìm kiếm nhanh
ContentSchema.index({ type: 1, status: 1 });

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
