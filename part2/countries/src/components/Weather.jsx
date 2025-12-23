import { useState, useEffect } from 'react'
import weatherService from '../services/weatherapi'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!capital) {
      setWeather(null)
      return
    }

    weatherService.getWeather(capital).then((response) => {
      const current = response.current || {}

      const filtered = {
        icon: current.condition.icon ? `http:${current.condition.icon}` : '',
        text: current.condition.text || '',
        condition: current.condition || { icon: '', text: '' },
        wind_kph: current.wind_kph ?? 0,
        temp_c: current.temp_c ?? 0,
      }
      setWeather(filtered)
    })
  }, [capital])

  if (!capital) return null

  if (!weather)
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <p>Loading weather...</p>
      </div>
    )

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature {weather.temp_c} Celsius</p>
      {weather.icon && <img src={weather.icon} alt={weather.text} />}
      <p>Wind {weather.wind_kph} kph</p>
    </div>
  )
}

export default Weather
