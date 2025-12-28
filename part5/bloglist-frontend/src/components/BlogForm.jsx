const BlogForm = ({
  title,
  author,
  url,
  onSubmit,
  onTitleChange,
  onAuthorChange,
  onUrlChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>
          title: <input type="text" value={title} onChange={onTitleChange} />
        </label>
      </div>
      <div>
        <label>
          author: <input type="text" value={author} onChange={onAuthorChange} />
        </label>
      </div>
      <div>
        <label>
          url: <input type="text" value={url} onChange={onUrlChange} />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
