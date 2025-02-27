import { createContext, useState } from 'react'
import { User } from '../types/user'
import Auth from '../types/Auth'

const AuthContext = createContext({
  user: {} as User,
  permissions: [''],
  accessToken: '',
  setAuth: (auth: {
    user: User
    permissions: string[]
    accessToken: string
  }) => {},
})

export const AuthProvider = (props: { children: any }) => {
  const [auth, setAuth] = useState({
    user: {} as User,
    permissions: [''],
    accessToken: '',
  })
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem('persist') || 'false'),
  )

  const value = {
    ...auth,
    setAuth,
    persist,
    setPersist,
  }
  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  )
}

export default AuthContext
