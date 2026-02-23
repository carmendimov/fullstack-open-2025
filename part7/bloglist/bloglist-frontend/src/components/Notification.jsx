import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (notification === null || notification?.message === null) {
    return null
  }

  const notificationClass =
    notification.type === 'error'
      ? 'notification error'
      : 'notification success'

  return <div className={notificationClass}>{notification.message}</div>
}

export default Notification
