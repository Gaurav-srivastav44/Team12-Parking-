import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  age: Number,
  gender: String,
  state: String,
  category: String,
  income: Number,
  education: String,
  employment: String,
  username: { type: String, unique: true },
  password: String,
});
export default mongoose.model("User", userSchema);
    