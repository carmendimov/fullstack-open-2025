const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((p) => p.id !== id)
  response.status(204).end()
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

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

  const duplicatePerson = persons.some((person) => person.name === body.name)
  if (duplicatePerson) {
    return response.status(404).json({
      error: 'name must be unique',
    })
  }

  const newId = String(getRandomInt(1000000))
  const newPerson = {
    id: newId,
    name: body.name,
    number: body.number,
  }
  persons = persons.concat(newPerson)
  response.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
