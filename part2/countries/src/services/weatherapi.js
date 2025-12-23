import axios from 'axios'

const baseUrl = 'http://api.weatherapi.com/v1'

const getWeather = (capital) => {
  const request = axios.get(`${baseUrl}/current.json`, {
    params: {
      key: import.meta.env.VITE_WEATHER_API_KEY,
      q: capital,
    },
  })
  return request.then((response) => response.data)
}

export default { getWeather }
