import Country from './Country'

const Result = ({ countries, setCountries }) => {
  if (!countries || countries.length === 0) {
    return null
  }
  if (countries.length === 1) {
    return <Country country={countries[0]}></Country>
  }
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  return (
    <div>
      {countries.map((country) => (
        <div key={country.name}>
          {country.name}{' '}
          <button onClick={() => setCountries([country])}>Show</button>
        </div>
      ))}
    </div>
  )
}

export default Result
