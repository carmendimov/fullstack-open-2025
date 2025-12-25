require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response, next) => {
  Person.countDocuments({})
    .then((size) => {
      response.send(`
    <p>Phonebook has info for ${size} people</p>
    <p>${new Date()}</p>
    `)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => {
      console.log(error)
      response.status(400).end()
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body) {
    return response.status(404).json({
      error: 'content missing',
    })
  }

  if (!body.name) {
    return response.status(404).json({
      error: 'name is missing',
    })
  }

  if (!body.number) {
    return response.status(404).json({
      error: 'number is missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((person) => {
        response.json(person)
      })
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
