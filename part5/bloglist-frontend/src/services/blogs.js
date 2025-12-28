import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => {
    console.log(response.data)
    return response.data
  })
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (blogObject) => {
  console.log('update', blogObject)

  const url = `${baseUrl}/${blogObject.id}`
  const response = await axios.put(url, blogObject)
  return response.data
}

export default { getAll, create, update, setToken }
