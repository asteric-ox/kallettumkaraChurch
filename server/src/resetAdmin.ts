import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function resetAdmin() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kallettumkara_church');
  const hash = await bcrypt.hash('admin123', 10);
  const col = mongoose.connection.db!.collection('admins');
  const result = await col.updateOne(
    { username: 'admin' },
    { $set: { password: hash } },
    { upsert: true }
  );
  console.log('Admin reset result:', result);
  await mongoose.disconnect();
  console.log('Done. Login: admin / admin123');
}
resetAdmin().catch(console.error);
