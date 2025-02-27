import { configs_servicebus } from '../configs/configs_servicebus'
import Auth from '../types/Auth'

export const authenticate = async (
  username: string,
  password: string,
): Promise<Auth> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/auth',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      credentials: 'include',
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to sign in.')
  }

  const authData: Auth = await response.json()
  return authData
}

export const refresh = async (): Promise<Auth> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/refresh',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to sign in.')
  }

  const authData: Auth = await response.json()
  return authData
}

const AuthService = () => {}

export default AuthService
