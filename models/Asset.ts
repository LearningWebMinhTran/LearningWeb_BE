import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema(
  {
    name: String,
    url: { type: String, required: true }, // URL từ Cloudinary/S3
    type: { type: String, enum: ['image', 'video', 'pdf'] },
    size: Number,

    // File này được dùng ở bài nào? (Để biết file rác mà xóa)
    used_in_contents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Asset || mongoose.model('Asset', AssetSchema);
