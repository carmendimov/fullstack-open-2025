const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Carmen Dimov',
        username: 'cdimov',
        password: 'password',
      },
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByText('log in to application')
    await page.getByText('username')
    await page.getByText('password')
    await page.getByRole('button', { name: 'login' })
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'cdimov', 'password')

      await expect(page.getByText('blogs')).toBeVisible()
      await expect(page.getByText('Carmen Dimov logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'create new blog' })
      ).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'cdimov', 'wrong')
      await expect(page.getByText('invalid username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'cdimov', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      const blog = {
        title: 'new title',
        author: 'new author',
        url: 'new url',
      }

      await createBlog(page, blog)

      await expect(
        page.getByText("a new blog 'new title' by new author added")
      ).toBeVisible()
      await expect(page.getByText('new title new author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const blog = {
        title: 'likable title',
        author: 'likable author',
        url: 'likable url',
      }

      await createBlog(page, blog)

      const blogItem = page
        .getByText('likable title likable author')
        .locator('..')

      await blogItem.getByRole('button', { name: 'show' }).click()

      await expect(blogItem.getByText('likes 0')).toBeVisible()
      await blogItem.getByRole('button', { name: 'like' }).click()
      await expect(blogItem.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({
      page,
    }) => {
      const blog = {
        title: 'deletable title',
        author: 'deletable author',
        url: 'deletable url',
      }

      await createBlog(page, blog)

      const blogItem = page
        .getByText('deletable title deletable author')
        .locator('..')

      await blogItem.getByRole('button', { name: 'show' }).click()

      page.on('dialog', (dialog) => dialog.accept())

      await blogItem.getByRole('button', { name: 'delete' }).click()

      await expect(
        page.getByText('deletable title deletable author')
      ).not.toBeVisible()
      await expect(
        page.getByText("blog 'deletable title' deleted")
      ).toBeVisible()
    })

    test('only the blog creator sees the delete button', async ({
      page,
      request,
    }) => {
      const blog = {
        title: 'title by carmen',
        author: 'author by carmen',
        url: 'url by carmen',
      }

      await createBlog(page, blog)

      await request.post('/api/users', {
        data: {
          name: 'Other User',
          username: 'otheruser',
          password: 'otherpass',
        },
      })

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'otheruser', 'otherpass')

      const blogItem = page
        .getByText('title by carmen author by carmen')
        .locator('..')

      await blogItem.getByRole('button', { name: 'show' }).click()

      await expect(
        blogItem.getByRole('button', { name: 'delete' })
      ).not.toBeVisible()
    })
  })
})
