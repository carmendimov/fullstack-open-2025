const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const blogsByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const author = Object.keys(blogsByAuthor).reduce((topAuthor, current) =>
    blogsByAuthor[current] > blogsByAuthor[topAuthor] ? current : topAuthor
  )

  return {
    author,
    blogs: blogsByAuthor[author],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const author = Object.keys(likesByAuthor).reduce((topAuthor, current) =>
    likesByAuthor[current] > likesByAuthor[topAuthor] ? current : topAuthor
  )

  return {
    author,
    likes: likesByAuthor[author],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
