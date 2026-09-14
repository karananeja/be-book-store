import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { connect } from 'mongoose';
import { User } from '../models/user-model';
import { environment } from '../utils/constants';

config();

const seedAdmin = async () => {
  const email = environment.ADMIN_EMAIL;
  const password = environment.ADMIN_PASSWORD;
  const name = environment.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error(
      '[seed] Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding'
    );
    process.exit(1);
  }

  if (
    !environment.DB_USERNAME ||
    !environment.DB_PASSWORD ||
    !environment.DB_NAME
  ) {
    console.error('[seed] Missing MongoDB credentials in .env');
    process.exit(1);
  }

  const mongoDbURI = `mongodb+srv://${environment.DB_USERNAME}:${environment.DB_PASSWORD}@books-store-cluster.ijpskzs.mongodb.net/${environment.DB_NAME}?retryWrites=true&w=majority`;

  await connect(mongoDbURI);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`[seed] Upgraded existing user to admin: ${email}`);
    } else {
      console.log(`[seed] Admin already exists: ${email}`);
    }
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'admin',
  });

  console.log(`[seed] Admin created: ${email}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error('[seed] Failed', error);
  process.exit(1);
});
