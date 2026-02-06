const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
  ]

  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Title 2',
      author: 'Author 2',
      url: 'Url 2',
      likes: 3,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d1710',
      title: 'Title 3',
      author: 'Author 3',
      url: 'Url 3',
      likes: 2,
      __v: 0,
    },
  ]

  test('of empty list is zero', () => {
    const emptyBlog = []
    const result = listHelper.totalLikes(emptyBlog)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 10)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
  ]

  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Title 2',
      author: 'Author 2',
      url: 'Url 2',
      likes: 8,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d1710',
      title: 'Title 3',
      author: 'Author 3',
      url: 'Url 3',
      likes: 3,
      __v: 0,
    },
  ]

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })

  test('of a bigger list returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, listWithMultipleBlogs[1])
  })
})

describe('most blogs', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Title 2',
      author: 'Robert C. Martin',
      url: 'Url 2',
      likes: 8,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d1710',
      title: 'Title 3',
      author: 'Robert C. Martin',
      url: 'Url 3',
      likes: 3,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d1711',
      title: 'Title 4',
      author: 'Robert C. Martin',
      url: 'Url 4',
      likes: 2,
      __v: 0,
    },
  ]

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has multiple blogs, returns author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })

  test('when there are multiple top bloggers, returns one of them', () => {
    const blogsWithTie = [
      {
        _id: '1',
        title: 'Blog 1',
        author: 'Author A',
        url: 'url1',
        likes: 1,
        __v: 0,
      },
      {
        _id: '2',
        title: 'Blog 2',
        author: 'Author A',
        url: 'url2',
        likes: 1,
        __v: 0,
      },
      {
        _id: '3',
        title: 'Blog 3',
        author: 'Author B',
        url: 'url3',
        likes: 1,
        __v: 0,
      },
      {
        _id: '4',
        title: 'Blog 4',
        author: 'Author B',
        url: 'url4',
        likes: 1,
        __v: 0,
      },
    ]
    const result = listHelper.mostBlogs(blogsWithTie)
    assert.strictEqual(result.blogs, 2)
    assert.strictEqual(
      result.author === 'Author A' || result.author === 'Author B',
      true
    )
  })
})

describe('most likes', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Title 2',
      author: 'Robert C. Martin',
      url: 'Url 2',
      likes: 8,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d1710',
      title: 'Title 3',
      author: 'Robert C. Martin',
      url: 'Url 3',
      likes: 3,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d1711',
      title: 'Title 4',
      author: 'Robert C. Martin',
      url: 'Url 4',
      likes: 2,
      __v: 0,
    },
  ]

  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('when list has multiple blogs, returns author with most likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      likes: 13,
    })
  })

  test('when there are multiple authors with same likes, returns one of them', () => {
    const blogsWithTie = [
      {
        _id: '1',
        title: 'Blog 1',
        author: 'Author A',
        url: 'url1',
        likes: 10,
        __v: 0,
      },
      {
        _id: '2',
        title: 'Blog 2',
        author: 'Author B',
        url: 'url2',
        likes: 10,
        __v: 0,
      },
    ]
    const result = listHelper.mostLikes(blogsWithTie)
    assert.strictEqual(result.likes, 10)
    assert.strictEqual(
      result.author === 'Author A' || result.author === 'Author B',
      true
    )
  })
})
