import { app } from './app.js';
import { SETTINGS } from './settings.js';
import { mongoCluster } from './infrastructure/db/db.js';

try {
  await mongoCluster.run();
  app.listen(SETTINGS.PORT, () => {
    console.log('Server started in port ' + SETTINGS.PORT);
  });
} catch {
  process.exit(1);
}
