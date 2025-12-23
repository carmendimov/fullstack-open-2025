import { useState, useEffect } from 'react'
import countryService from './services/restcountries'
import Result from './components/Result'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState(null)

  useEffect(() => {
    console.log('effect run, search is now', search)

    // skip if search is not defined
    if (search) {
      console.log('fetching country data...')
      countryService
        .getAll()
        .then((response) => {
          const filtered = response
            .filter((country) => {
              const countryName = country.name.common.toLowerCase()
              return countryName.includes(search)
            })
            .map((country) => ({
              name: country.name?.common || '',
              flag: country.flags || '',
              capital: country.capital || [],
              area: country.area,
              languages: country.languages
                ? Object.values(country.languages)
                : [],
            }))

          setCountries(filtered)
        })
        .catch((err) => {
          console.error('failed to fetch countries', err)
          setCountries([])
        })
    }
  }, [search])

  const handleChange = (event) => {
    const value = event.target.value
    setValue(value)
    if (!value) {
      // clear search and results when input is empty
      setSearch(null)
      setCountries([])
    } else {
      setSearch(value.toLowerCase())
    }
  }

  return (
    <div>
      <div>
        find countries <input value={value} onChange={handleChange} />
      </div>
      <Result countries={countries} setCountries={setCountries} />
    </div>
  )
}

export default App
