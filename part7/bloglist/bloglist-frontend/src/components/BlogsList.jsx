import BlogLink from './BlogLink'

const BlogsList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {sortedBlogs.map((blog) => (
        <BlogLink key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogsList
