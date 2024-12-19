import express from 'express';
import { Request, Response } from 'express';
import { SETTINGS } from './settings.js';
import { blogsRouter } from './blogs/blogs-router.js';
import { postsRouter } from './posts/posts-router.js';
import { deleteAllBlogsDb } from './data-access/blogs-db-access.js';
import { deleteAllPostsDb } from './data-access/posts-db-access.js';

const app = express();

app.use(express.json());
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' });
});

app.delete('/testing/all-data', (req: Request, res: Response) => {
  deleteAllBlogsDb();
  deleteAllPostsDb();
  res.status(204).json({ message: 'All data has been deleted' });
});

app.listen(SETTINGS.PORT, () => {
  console.log('...server started in port ' + SETTINGS.PORT);
});
