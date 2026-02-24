import { useState } from 'react'

const BlogView = ({ blog, updateBlogLikes, addComment }) => {
  const [comment, setComment] = useState('')

  if (!blog) {
    return null
  }

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    if (comment.trim()) {
      addComment(blog.id, comment)
      setComment('')
    }
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url} target="_blank">
        {blog.url}
      </a>
      <div>
        {blog.likes} likes
        <button onClick={() => updateBlogLikes(blog)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>

      <h3>comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          placeholder="leave a comment..."
        />
        <button type="submit">add comment</button>
      </form>

      {blog.comments && blog.comments.length > 0 ? (
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  )
}

export default BlogView
