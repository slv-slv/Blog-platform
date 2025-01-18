import express from 'express';
import { Request, Response } from 'express';
import { SETTINGS } from './settings.js';
import { blogsRouter } from './blogs/blogs-router.js';
import { postsRouter } from './posts/posts-router.js';
import { usersRouter } from './users/users-router.js';
import { blogsRepo } from './blogs/blogs-repo.js';
import { postsRepo } from './posts/posts-repo.js';
import { usersRepo } from './users/users-repo.js';
import { dbClient, runDb } from './db/db.js';
import { authRouter } from './authorization/auth-router.js';

const app = express();

app.use(express.json());
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' });
});

app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogsRepo.deleteAllBlogs();
  postsRepo.deleteAllPosts();
  usersRepo.deleteAllUsers();
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
