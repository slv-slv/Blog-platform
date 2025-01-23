import { app } from './app.js';
import { SETTINGS } from './settings.js';
import { dbClient, runDb } from './db/db.js';

try {
  await runDb(dbClient);
  app.listen(SETTINGS.PORT, () => {
    console.log('Server started in port ' + SETTINGS.PORT);
  });
} catch {
  process.exit(1);
}
