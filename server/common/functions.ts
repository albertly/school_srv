import mongoose, { Schema, Document } from 'mongoose';
import './env';

export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};

type TInput = {
  db: string;
};

export const closeDb = async () => await mongoose.connection.close();

export default async ({ db }: TInput) => {
  console.log(typeof Schema);
  try {
    await mongoose.connect(db, { useNewUrlParser: true });

    return console.info(`Successfully connected to ${db}`);
  } catch (error) {
    console.error('Error connecting to database: ', error);
    return process.exit(1);
  }

  // mongoose.connection.on('disconnected', connect);
};
