import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      const message = action.payload
      return message
    },
    clearNotification() {
      return ''
    },
  },
})

export const displayNotification = (message, intervalInSeconds = 5) => {
  return async (dispatch) => {
    dispatch(notificationSlice.actions.setNotification(message))
    setTimeout(() => {
      dispatch(notificationSlice.actions.clearNotification())
    }, intervalInSeconds * 1000)
  }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
