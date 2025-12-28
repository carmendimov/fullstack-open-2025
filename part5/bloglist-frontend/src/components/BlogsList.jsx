import Blog from './Blog'

const BlogsList = ({ blogs, updateBlogLikes }) => {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateBlogLikes={updateBlogLikes} />
      ))}
    </div>
  )
}

export default BlogsList
