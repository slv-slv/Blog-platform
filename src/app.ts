import express from 'express';
import { Request, Response } from 'express';
import { blogsRouter } from './features/blogs/blogs-router.js';
import { postsRouter } from './features/posts/posts-router.js';
import { usersRouter } from './features/users/users-router.js';
import { commentsRouter } from './features/comments/comments-router.js';
import { authRouter } from './auth/auth-router.js';
import { blogsRepo } from './features/blogs/blogs-repo.js';
import { postsRepo } from './features/posts/posts-repo.js';
import { usersRepo } from './features/users/users-repo.js';
import { commentsRepo } from './features/comments/comments-repo.js';

export const app = express();

app.use(express.json());

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/auth', authRouter);

app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogsRepo.deleteAllBlogs();
  postsRepo.deleteAllPosts();
  usersRepo.deleteAllUsers();
  commentsRepo.deleteAllComments();
  res.status(204).end();
});

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' });
});
