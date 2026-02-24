const BlogView = ({ blog, updateBlogLikes }) => {
  if (!blog) {
    return null
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
    </div>
  )
}

export default BlogView
