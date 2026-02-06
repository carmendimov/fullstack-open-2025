const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./user_test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const users = await helper.createInitialUsers()
    await User.insertMany(users)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'fresh username',
      name: 'Fresh Username',
      password: 'secretpassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })

  test('creation fails with too short username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Short Username',
      password: 'validpw',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with too short password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserWithShortPassword = {
      username: 'validname',
      name: 'No Password',
      password: 'pw',
    }

    const result = await api
      .post('/api/users')
      .send(newUserWithShortPassword)
      .expect(400)
    assert(
      result.body.error.includes(
        '`password` needs to be set or be at least 3 characters long'
      )
    )

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with missing password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserWithShortPassword = {
      username: 'missingpassword',
      name: 'No Password',
    }

    const result = await api
      .post('/api/users')
      .send(newUserWithShortPassword)
      .expect(400)
    assert(result.body.error)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
