import { Link } from 'react-router-dom'
const padding = {
  padding: 5,
}
const NavigationMenu = ({ user, logout }) => {
  return (
    <div style={{ padding: 10, background: 'lightgray' }}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {user && (
        <span style={padding}>
          {user.name} logged in <button onClick={logout}>logout</button>
        </span>
      )}
    </div>
  )
}

export default NavigationMenu
