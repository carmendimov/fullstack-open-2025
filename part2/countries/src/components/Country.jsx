import Weather from './Weather'

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <div>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
      </div>
      <h2>Languages</h2>
      <ul>
        {country.languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={country.flag.png || country.flag.svg}
        alt={country.flag.alt}
      ></img>
      <Weather capital={country.capital} />
    </div>
  )
}

export default Country
