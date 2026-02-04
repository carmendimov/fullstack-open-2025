import { useContext, useEffect } from 'react'
import NotificationContext from '../NotificationContext'

const Notification = () => {
  const { notification, notificationDispatch } = useContext(NotificationContext)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [notification, notificationDispatch])

  if (!notification) return null

  return <div style={style}>{notification}</div>
}

export default Notification
