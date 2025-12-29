const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'sekret',
  },
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  },
  {
    username: 'hellas',
    name: 'Arto Hellas',
    password: 'password',
  },
]

const createInitialUsers = async () => {
  const userPromises = initialUsers.map(async (user) => {
    const passwordHash = await bcrypt.hash(user.password, 10)
    return new User({
      username: user.username,
      name: user.name,
      passwordHash,
    })
  })
  return Promise.all(userPromises)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialUsers,
  usersInDb,
  createInitialUsers,
}
