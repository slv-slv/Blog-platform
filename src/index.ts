import express from 'express';
import { SETTINGS } from './settings.js';
import { blogsRouter } from './blogs/blogs-router.js';
import { postsRouter } from './posts/posts-router.js';
import { db } from './db/db.js';

const app = express();

app.use(express.json());
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' });
});

app.delete('/testing/all-data', (req, res) => {
  db.blogs = [];
  db.posts = [];
  res.status(204).end();
});

app.listen(SETTINGS.PORT, () => {
  console.log('...server started in port ' + SETTINGS.PORT);
});
