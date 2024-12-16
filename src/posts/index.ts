import { Router } from 'express';

export const postsRouter = Router();

postsRouter.get('/', getPosts);
postsRouter.get('/:id', findPost);
postsRouter.post('/', createPost);
postsRouter.put('/:id', updatePost);
postsRouter.delete('/:id', deletePost);
