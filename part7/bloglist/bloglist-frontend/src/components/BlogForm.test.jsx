import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import { describe, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  test('if new blog is created, the form calls the event handler it received as props with right details', async () => {
    const addBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={addBlog} />)

    const title = screen.getByLabelText('title:')
    const author = screen.getByLabelText('author:')
    const url = screen.getByLabelText('url:')
    const sendButton = screen.getByText('create')

    await user.type(title, 'typed title name')
    await user.type(author, 'typed author name')
    await user.type(url, 'typed url')

    await user.click(sendButton)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0].title).toBe('typed title name')
    expect(addBlog.mock.calls[0][0].author).toBe('typed author name')
    expect(addBlog.mock.calls[0][0].url).toBe('typed url')
  })
})
