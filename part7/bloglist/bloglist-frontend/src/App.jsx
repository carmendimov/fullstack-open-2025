import { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import BlogsList from './components/BlogsList'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import { useRef } from 'react'
import { useNotify } from './NotificationContext'
import { useLoginValue, useLoginDispatch } from './LoginContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const App = () => {
  const queryClient = useQueryClient()
  // const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useLoginValue()
  const loginDispatch = useLoginDispatch()

  const notify = useNotify()

  const blogFormRef = useRef()

  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs))
  // }, [])

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  useEffect(() => {
    const loggerUserJSON = window.localStorage.getItem('loggedUser')
    if (loggerUserJSON) {
      const user = JSON.parse(loggerUserJSON)
      loginDispatch({ type: 'LOGIN', payload: user })
      blogService.setToken(user.token)
    }
  }, [loginDispatch])

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

      // setBlogs(blogs.concat(blogWithUser))
      newBlogMutation.mutate(blogWithUser)
      notify(`a new blog '${blog.title}' by ${blog.author} added`, 'success')
    } catch (error) {
      notify(error.response.data.error, 'error')
    }
  }

  const updateBlogLikes = async (blog) => {
    const updatedBlog = await blogService.update({
      ...blog,
      likes: blog.likes + 1,
    })
    // setBlogs(
    //   blogs.map((b) =>
    //     b.id !== blog.id ? b : { ...updatedBlog, user: b.user },
    //   ),
    // )
    updateBlogMutation.mutate(updatedBlog)
  }

  const deleteBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
        // await blogService.remove(blog.id)
        // setBlogs(blogs.filter((b) => b.id !== blog.id))
        deleteBlogMutation.mutate(blog.id)
        notify(`blog '${blog.title}' deleted`, 'success')
      }
    } catch (error) {
      notify(error.response.data.error, 'error')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      loginDispatch({ type: 'LOGIN', payload: user })
      setUsername('')
      setPassword('')
    } catch (error) {
      notify(error.response.data.error, 'error')
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    loginDispatch({ type: 'LOGOUT' })
  }

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  // console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const blogs = result.data

  {
    !user && (
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
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
        setPassword={setPassword}
        setUsername={setUsername}
      />
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
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
