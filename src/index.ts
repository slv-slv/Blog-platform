import express from 'express';
import { Request, Response } from 'express';
import { SETTINGS } from './settings.js';
import { blogsRouter } from './features/blogs/blogs-router.js';
import { postsRouter } from './features/posts/posts-router.js';
import { usersRouter } from './features/users/users-router.js';
import { blogsRepo } from './features/blogs/blogs-repo.js';
import { postsRepo } from './features/posts/posts-repo.js';
import { usersRepo } from './features/users/users-repo.js';
import { dbClient, runDb } from './db/db.js';
import { authRouter } from './auth/auth-router.js';
import { commentsRepo } from './features/comments/comments-repo.js';
import { commentsRouter } from './features/comments/comments-router.js';

const app = express();

app.use(express.json());
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' });
});

app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogsRepo.deleteAllBlogs();
  postsRepo.deleteAllPosts();
  usersRepo.deleteAllUsers();
  commentsRepo.deleteAllComments();
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
