import express from 'express';
import { SETTINGS } from './settings.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' });
});

app.listen(SETTINGS.PORT, () => {
  console.log('...server started in port ' + SETTINGS.PORT);
});
