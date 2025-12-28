import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })

    deleteInputs()
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

  return (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title:{' '}
          <input type="text" value={title} onChange={handleTitleChange} />
        </label>
      </div>
      <div>
        <label>
          author:{' '}
          <input type="text" value={author} onChange={handleAuthorChange} />
        </label>
      </div>
      <div>
        <label>
          url: <input type="text" value={url} onChange={handleUrlChange} />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
