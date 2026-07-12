import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  photoURL: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["Supporter", "Creator", "Admin"],
    default: "Supporter",
  },
  credits: {
    type: Number,
    default: function () {
      if (this.role === "Creator") {
        return 20;
      }
      if (this.role === "Admin") {
        return 0;
      }
      return 50; // Supporter default
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
