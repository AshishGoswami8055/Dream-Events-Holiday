import bcrypt from "bcryptjs";
import connectDB from "../lib/db";
import AdminUser from "../models/AdminUser";

const NEW_EMAIL = "dreamevents.holidays@gmail.com";
const NEW_PASSWORD = "DreamEvents2026@#";

async function updateAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required. Set it in .env.local.");
    process.exit(1);
  }

  await connectDB();
  console.log("Connected to MongoDB");

  const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);

  const existingNew = await AdminUser.findOne({ email: NEW_EMAIL });
  const existingOld = await AdminUser.findOne({ email: "admin@dreamevents.com" });

  if (existingNew) {
    await AdminUser.findByIdAndUpdate(existingNew._id, {
      password: hashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });
    console.log(`Updated password for: ${NEW_EMAIL}`);
  } else if (existingOld) {
    await AdminUser.findByIdAndUpdate(existingOld._id, {
      email: NEW_EMAIL,
      password: hashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });
    console.log(`Updated admin from admin@dreamevents.com to ${NEW_EMAIL}`);
  } else {
    const anyAdmin = await AdminUser.findOne();
    if (anyAdmin) {
      await AdminUser.findByIdAndUpdate(anyAdmin._id, {
        email: NEW_EMAIL,
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiry: undefined,
      });
      console.log(`Updated existing admin account to ${NEW_EMAIL}`);
    } else {
      await AdminUser.create({
        name: process.env.ADMIN_NAME || "Admin",
        email: NEW_EMAIL,
        password: hashedPassword,
        role: "superadmin",
      });
      console.log(`Created admin: ${NEW_EMAIL}`);
    }
  }

  if (existingOld && existingNew && existingOld._id.toString() !== existingNew._id.toString()) {
    await AdminUser.findByIdAndDelete(existingOld._id);
    console.log("Removed duplicate old admin account");
  }

  console.log("Admin credentials updated successfully.");
  process.exit(0);
}

updateAdmin().catch((err) => {
  console.error("Failed to update admin:", err);
  process.exit(1);
});
