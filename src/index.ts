import { app } from './app.js';
import { SETTINGS } from './settings.js';
import { mongoCluster } from './infrastructure/db/db.js';

const start = async () => {
  try {
    // await initDb();
    await mongoCluster.run();
    app.listen(SETTINGS.PORT, () => {
      console.log('Server started in port ' + SETTINGS.PORT);
    });
  } catch {
    process.exit(1);
  }
};

start();
