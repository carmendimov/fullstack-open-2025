const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./blog_test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

let authToken

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  await user.save()

  const loginRes = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })
    .expect(200)
  authToken = loginRes.body.token

  const blogsWithUser = helper.initialBlogs.map((b) => ({
    ...b,
    user: user._id,
  }))
  await Blog.insertMany(blogsWithUser)
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
    .set('Authorization', `Bearer ${authToken}`)
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

test('a blog post added without likes property defaults to 0 likes', async () => {
  const newBlog = {
    title: 'Operating Systems: Internals and Design Principles',
    author: 'William Stallings',
    url: 'http://williamstallings.com/OperatingSystems/',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const saved = blogsAtEnd.find((b) => b.title === newBlog.title)
  assert.strictEqual(saved.likes, 0)
})

test('a blog post added with missing title or url property responds with bad request', async () => {
  const blogMissingTitle = {
    author: 'No Title',
    url: 'http://notitle.example.com',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(blogMissingTitle)
    .expect(400)

  const blogMissingUrl = {
    title: 'No URL',
    author: 'No Url Author',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(blogMissingUrl)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog post can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${authToken}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map((b) => b.title)
  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('blog likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 5 }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${authToken}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const updated = blogsAtEnd.find((b) => b.id === blogToUpdate.id)
  assert.strictEqual(updated.likes, blogToUpdate.likes + 5)
})

test('adding a blog without token returns 401', async () => {
  const newBlog = {
    title: 'Title',
    author: 'Author',
    url: 'http://example.com/',
    likes: 2,
  }

  await api.post('/api/blogs').send(newBlog).expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
