import express from 'express';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { blogsRouter } from './features/blogs/blogs-router.js';
import { postsRouter } from './features/posts/posts-router.js';
import { usersRouter } from './features/users/users-router.js';
import { commentsRouter } from './features/comments/comments-router.js';
import { authRouter } from './security/auth/auth-router.js';
import { securityRouter } from './security/sessions/sessions-router.js';
import mongoose from 'mongoose';

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/auth', authRouter);
app.use('/security', securityRouter);

app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await mongoose.connection.dropDatabase();
  res.status(204).end();
});

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' });
});
