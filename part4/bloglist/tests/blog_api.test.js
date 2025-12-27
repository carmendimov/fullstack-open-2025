const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./blog_test_helper')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of blog is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    assert(blog.id !== undefined)
  })
})

test('a blog post can be added', async () => {
  const newBlog = {
    title: 'The Rust Programming Language',
    author: 'Steve Klabnik',
    url: 'https://doc.rust-lang.org/book/',
    likes: 42,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtTEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtTEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtTEnd.map((b) => b.title)
  console.log(titles)

  assert(titles.includes(newBlog.title))

  const saved = blogsAtTEnd.find((b) => b.title === newBlog.title)
  assert.strictEqual(saved.author, newBlog.author)
  assert.strictEqual(saved.url, newBlog.url)
  assert.strictEqual(saved.likes, newBlog.likes)
})

after(async () => {
  await mongoose.connection.close()
})
