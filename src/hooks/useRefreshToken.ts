import useAuth from './useAuth'
import { refresh } from '../services/AuthService'
import Auth from '../types/Auth'

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refreshToken = async () => {
    const authData: Auth = await refresh()

    setAuth({
      user: authData.user,
      permissions: authData.permissions,
      accessToken: authData.accessToken,
    })
  }
  return refreshToken
}

export default useRefreshToken
