import { app } from './app.js';
import { SETTINGS } from './settings.js';
import { dbName, mongoUri } from './infrastructure/db/db.js';
import mongoose from 'mongoose';

const start = async () => {
  try {
    await mongoose.connect(mongoUri, { dbName });
    app.listen(SETTINGS.PORT, () => {
      console.log('Server started in port ' + SETTINGS.PORT);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
