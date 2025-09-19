import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/machine_test";

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const email = "admin@example.com";
    const password = "admin123";

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin already exists");
      return process.exit(0);
    }

    const admin = new Admin({ email, password });
    await admin.save();

    console.log("🎉 Admin created:", email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
