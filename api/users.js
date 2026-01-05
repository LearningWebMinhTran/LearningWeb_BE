import dbConnect from "../lib/dbConnect.js";
import User from "../models/User.js";

export default async function handler(req, res) {
  const { method } = req;

  // BẮT BUỘC: Gọi hàm kết nối DB trước khi làm bất cứ thứ gì
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        // Giống save() trong JPA. Tự động map JSON body vào Model
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
