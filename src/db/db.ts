import { BlogType } from '../types/blog-types.js';
import { PostType } from '../types/posts-types.js';

export const db: { blogs: BlogType[]; posts: PostType[] } = {
  blogs: [
    {
      id: '1',
      name: 'Timur Shemsedinov',
      description: 'Metarhia community',
      websiteUrl: 'https://metarhia.com/',
    },
    {
      id: '2',
      name: 'Kirill Mokevnin',
      description: 'Hexlet',
      websiteUrl: 'https://hexlet.io/',
    },
    {
      id: '3',
      name: 'Dimych',
      description: 'IT-Incubator',
      websiteUrl: 'https://it-incubator.io/',
    },
  ],
  posts: [
    {
      id: '1',
      title: 'Understanding TypeScript',
      shortDescription: 'A comprehensive guide to TypeScript',
      content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript...',
      blogId: '1',
      blogName: 'Timur Shemsedinov',
    },
    {
      id: '2',
      title: 'JavaScript ES6 Features',
      shortDescription: 'Exploring new features in ES6',
      content: 'ES6 introduced many new features such as arrow functions, classes, and template literals...',
      blogId: '2',
      blogName: 'Kirill Mokevnin',
    },
    {
      id: '3',
      title: 'React Hooks in Depth',
      shortDescription: 'Understanding React Hooks',
      content: 'React Hooks allow you to use state and other React features without writing a class...',
      blogId: '3',
      blogName: 'Dimych',
    },
    {
      id: '4',
      title: 'Building RESTful APIs with Node.js',
      shortDescription: 'A guide to building RESTful APIs',
      content:
        'Node.js is a powerful tool for building RESTful APIs. In this post, we will explore how to create a simple API...',
      blogId: '1',
      blogName: 'Timur Shemsedinov',
    },
    {
      id: '5',
      title: 'Introduction to GraphQL',
      shortDescription: 'Getting started with GraphQL',
      content:
        'GraphQL is a query language for APIs and a runtime for executing those queries by using a type system...',
      blogId: '2',
      blogName: 'Kirill Mokevnin',
    },
    {
      id: '6',
      title: 'CSS Grid Layout',
      shortDescription: 'Mastering CSS Grid',
      content:
        'CSS Grid Layout is a two-dimensional layout system for the web. It lets you layout items in rows and columns...',
      blogId: '3',
      blogName: 'Dimych',
    },
    {
      id: '7',
      title: 'Understanding Async/Await in JavaScript',
      shortDescription: 'A deep dive into async/await',
      content:
        'Async/await is a syntactic sugar built on top of promises, making asynchronous code easier to write and read...',
      blogId: '1',
      blogName: 'Timur Shemsedinov',
    },
    {
      id: '8',
      title: 'Docker for Beginners',
      shortDescription: 'Getting started with Docker',
      content:
        'Docker is a tool designed to make it easier to create, deploy, and run applications by using containers...',
      blogId: '2',
      blogName: 'Kirill Mokevnin',
    },
    {
      id: '9',
      title: 'Introduction to Kubernetes',
      shortDescription: 'Getting started with Kubernetes',
      content:
        'Kubernetes is an open-source system for automating the deployment, scaling, and management of containerized applications...',
      blogId: '3',
      blogName: 'Dimych',
    },
  ],
};
