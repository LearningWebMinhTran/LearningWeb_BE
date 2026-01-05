import mongoose from 'mongoose';

const UserNoteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },

    // Nội dung note
    content: { type: String, required: true }, // Markdown note cá nhân

    // (Nâng cao) Nếu bạn muốn highlight text cụ thể như Medium/Notion
    highlight_context: {
      selected_text: String, // Đoạn text được bôi đen
      position_index: Number, // Vị trí trong bài
    },

    is_public: { type: Boolean, default: false }, // Có muốn share note này cho cộng đồng không?
  },
  { timestamps: true }
);

export default mongoose.models.UserNote || mongoose.model('UserNote', UserNoteSchema);
