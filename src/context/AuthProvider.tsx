import { createContext, useState } from 'react'
import { User } from '../types/User'

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

  const value = {
    ...auth,
    setAuth,
  }
  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  )
}

export default AuthContext
