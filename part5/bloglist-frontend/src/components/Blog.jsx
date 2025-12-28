import { useState } from 'react'

const Blog = ({ blog, updateBlogLikes }) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

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
      <button style={hideWhenVisible} onClick={() => setBlogVisible(true)}>
        show
      </button>
      <button style={showWhenVisible} onClick={() => setBlogVisible(false)}>
        hide
      </button>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          <button onClick={() => updateBlogLikes(blog)}>like</button>
        </div>
        <div>{blog.user.name}</div>
      </div>
    </div>
  )
}
export default Blog
