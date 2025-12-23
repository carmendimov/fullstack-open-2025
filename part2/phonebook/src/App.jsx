import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearchField, setNewSearchField] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  })

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const duplicatePerson = persons.find((person) => person.name === newName)

    if (duplicatePerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find(
          (person) => person.id === duplicatePerson.id
        )
        const changedPerson = { ...person, number: newNumber }
        console.log(changedPerson)

        personService
          .update(changedPerson.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === changedPerson.id ? returnedPerson : person
              )
            )
            showNotification(
              `Updated number of ${returnedPerson.name} to ${returnedPerson.number}`,
              'success'
            )
            setNewName('')
            setNewNumber('')
          })
          .catch((error) => {
            showNotification(
              `Information of ${changedPerson.name} has already been removed from server`,
              'error'
            )
            setPersons(persons.filter((p) => p.id !== changedPerson.id))
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }

      personService.create(personObject).then((returnedObject) => {
        showNotification(`Added ${returnedObject.name}`, 'success')
        setPersons(persons.concat(returnedObject))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const personsToShow = newSearchField
    ? persons.filter((person) => {
        const personName = person.name.toLowerCase()
        return personName.includes(newSearchField.toLowerCase())
      })
    : persons

  const handleSearch = (event) => {
    const searchField = event.target.value
    setNewSearchField(searchField)
  }

  const deletePerson = (id, name) => {
    console.log(`delete person with id ${id}`)
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then((deletedPerson) => {
          setPersons(persons.filter((person) => person.id !== deletedPerson.id))
        })
        .catch((error) => {
          showNotification(
            `Information of ${name} has already been removed from server`,
            'error'
          )
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter newSearchField={newSearchField} handleSearch={handleSearch} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={deletePerson} />
    </div>
  )
}

export default App
