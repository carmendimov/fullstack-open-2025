import { useState } from 'react'

const Blog = ({ blog, updateBlogLikes, deleteBlog, user }) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button onClick={() => setBlogVisible(!blogVisible)}>
        {blogVisible ? 'hide' : 'show'}
      </button>
      {blogVisible && (
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => updateBlogLikes(blog)}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {user.username === blog.user.username && (
            <button onClick={() => deleteBlog(blog)}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}
export default Blog
