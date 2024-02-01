import { connect } from 'mongoose';

export const connectDB = async (url: string) => {
  try {
    await connect(url);
    console.log('[database] Connection is set up with MongoDB');
  } catch (error) {
    console.log({ error });
  }
};
