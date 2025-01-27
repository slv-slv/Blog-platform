import express from 'express';
import { Request, Response } from 'express';
import { blogsRouter } from './features/blogs/blogs-router.js';
import { postsRouter } from './features/posts/posts-router.js';
import { usersRouter } from './features/users/users-router.js';
import { commentsRouter } from './features/comments/comments-router.js';
import { authRouter } from './auth/auth-router.js';
import { mongoCluster } from './infrastructure/db/db.js';
import { SETTINGS } from './settings.js';

export const app = express();

app.use(express.json());

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/auth', authRouter);

app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await mongoCluster.dropDb(SETTINGS.DB_NAME);
  res.status(204).end();
});

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' });
});
