import { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import BlogsList from './components/BlogsList'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [notification, setNotification] = useState({
    message: null,
    type: null,
  })

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggerUserJSON = window.localStorage.getItem('loggedUser')
    if (loggerUserJSON) {
      const user = JSON.parse(loggerUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url,
    }

    try {
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      deleteInputs()
      showNotification(
        `a new blog '${blog.title}' by ${blog.author} added`,
        'success'
      )
    } catch (error) {
      showNotification(error.response.data.error, 'error')
    }
  }

  const deleteInputs = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      showNotification(error.response.data.error, 'error')
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  {
    !user && (
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        notification={notification}
        setPassword={setPassword}
        setUsername={setUsername}
      />
    )
  }

  if (user === null) {
    return (
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        notification={notification}
        setPassword={setPassword}
        setUsername={setUsername}
      />
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <p>
        {user.name} logged in<button onClick={logout}>logout</button>
      </p>

      <h3>create new</h3>
      <BlogForm
        title={title}
        author={author}
        url={url}
        onSubmit={addBlog}
        onTitleChange={handleTitleChange}
        onAuthorChange={handleAuthorChange}
        onUrlChange={handleUrlChange}
      />

      <BlogsList blogs={blogs} />
    </div>
  )
}

export default App
