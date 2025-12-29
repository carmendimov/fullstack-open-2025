import { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import BlogsList from './components/BlogsList'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import { useRef } from 'react'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState({
    message: null,
    type: null,
  })

  const blogFormRef = useRef()

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

  const addBlog = async (newBlog) => {
    try {
      const blog = await blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()

      const blogWithUser = {
        ...blog,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
      }

      setBlogs(blogs.concat(blogWithUser))
      showNotification(
        `a new blog '${blog.title}' by ${blog.author} added`,
        'success'
      )
    } catch (error) {
      showNotification(error.response.data.error, 'error')
    }
  }

  const updateBlogLikes = async (blog) => {
    const updatedBlog = await blogService.update({
      ...blog,
      likes: blog.likes + 1,
    })
    setBlogs(
      blogs.map((b) =>
        b.id !== blog.id ? b : { ...updatedBlog, user: b.user }
      )
    )
  }

  const deleteBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        showNotification(`blog '${blog.title}' deleted`, 'success')
      }
    } catch (error) {
      showNotification(error.response.data.error, 'error')
    }
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

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <h3>create new</h3>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <BlogsList
        blogs={blogs}
        updateBlogLikes={updateBlogLikes}
        deleteBlog={deleteBlog}
        user={user}
      />
    </div>
  )
}

export default App
