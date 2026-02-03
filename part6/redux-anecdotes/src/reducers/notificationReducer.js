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

// set notification for 5 seconds
export const displayNotification = (message) => {
  return async (dispatch) => {
    dispatch(notificationSlice.actions.setNotification(message))
    setTimeout(() => {
      dispatch(notificationSlice.actions.clearNotification())
    }, 5000)
  }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
