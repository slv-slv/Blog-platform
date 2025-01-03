import express from 'express';
import { Request, Response } from 'express';
import { SETTINGS } from './settings.js';
import { blogsRouter } from './routers/blogs-router.js';
import { postsRouter } from './routers/posts-router.js';
import { blogsRepo } from './repositories/business-logic/blogs-repo.js';
import { postsRepo } from './repositories/business-logic/posts-repo.js';
import { dbClient, runDb } from './db/db.js';

const app = express();

app.use(express.json());
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' });
});

app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogsRepo.deleteAllBlogs();
  postsRepo.deleteAllPosts();
  res.status(204).json({ message: 'All data has been deleted' });
});

try {
  await runDb(dbClient);
  app.listen(SETTINGS.PORT, () => {
    console.log('Server started in port ' + SETTINGS.PORT);
  });
} catch {
  process.exit(1);
}
