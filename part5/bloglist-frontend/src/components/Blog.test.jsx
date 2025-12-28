import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { beforeEach, describe, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

let updateBlockLikes

describe('<Blog />', () => {
  beforeEach(() => {
    updateBlockLikes = vi.fn()

    const blog = {
      title: 'Title 1',
      author: 'Author 1',
      likes: 2,
      url: 'Url 1',
      user: {
        username: 'root',
        name: 'Root',
      },
    }

    const user = {
      username: 'root',
      name: 'Root',
    }

    render(<Blog blog={blog} user={user} updateBlogLikes={updateBlockLikes} />)
  })

  test('renders title and author but not its url or likes', () => {
    // screen.debug()

    screen.getByText('Title 1 Author 1')

    const url = screen.queryByText('Url 1')
    expect(url).toBeNull()

    const likes = screen.queryByText('likes')
    expect(likes).toBeNull()
  })

  test('after clicking show, url and number of likes are shown', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('show')
    await user.click(viewButton)

    screen.getByText('Url 1')
    screen.getByText('likes 2')
  })

  test('after clicking likes button twice, props are received twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('show')
    await user.click(viewButton)

    // click like twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlockLikes.mock.calls).toHaveLength(2)
  })
})
