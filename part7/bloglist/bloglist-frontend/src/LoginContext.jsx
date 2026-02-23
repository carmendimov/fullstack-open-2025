import { useReducer, useContext, createContext } from 'react'

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

const LoginContext = createContext()

export const LoginContextProvider = ({ children }) => {
  const [user, loginDispatch] = useReducer(loginReducer, null)

  return (
    <LoginContext.Provider value={[user, loginDispatch]}>
      {children}
    </LoginContext.Provider>
  )
}

export const useLoginValue = () => {
  const [user] = useContext(LoginContext)
  return user
}

export const useLoginDispatch = () => {
  const valueAndDispatch = useContext(LoginContext)
  const dispatch = valueAndDispatch[1]
  return dispatch
}

export default LoginContext
