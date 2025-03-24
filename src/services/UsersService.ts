import { configs_servicebus } from '../configs/configs_servicebus'
import i18n from '../i18n'
import Role from '../types/Role'
import { User } from '../types/User'

export const getAllUsers = async (accessToken: string): Promise<User[]> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/users',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'x-lang': i18n.language,
      },
      credentials: 'include',
    },
  )

  if (!response.ok) {
    return []
  }

  const { success, rows } = await response.json()
  if (!success) return []

  rows.forEach(
    (x: { updatedon: Date }) => (x.updatedon = new Date(x.updatedon)),
  )
  const users = rows as User[]

  return users
}

export const getUser = async (
  accessToken: string,
  id: string,
): Promise<User> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/users/' + id,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'x-lang': i18n.language,
      },
      credentials: 'include',
    },
  )

  if (!response.ok) {
    return {} as User
  }

  const { success, rows } = await response.json()
  if (!success) return {} as User

  rows.forEach(
    (x: { updatedon: Date; createdon: Date }) => (
      (x.updatedon = new Date(x.updatedon)),
      (x.createdon = new Date(x.createdon))
    ),
  )

  const user = rows[0] as User

  return user
}

export const createUser = async (
  user: User,
  roles: Role[],
  accessToken: string,
): Promise<{ success: boolean; message: string }> => {
  user.password = Math.random().toString(36).slice(-10) // Generate random password
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/users',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify({ user: user, roles: roles }),
      credentials: 'include',
    },
  )

  const result = await response.json()
  return {
    success: response.ok,
    message: response.ok ? user.password : result.message,
  }
}

export const updateUser = async (
  user: User,
  roles: Role[],
  accessToken: string,
): Promise<{ success: boolean; message: string }> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/users',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'x-lang': i18n.language,
      },
      body: JSON.stringify({ user: user, roles: roles }),
      credentials: 'include',
    },
  )

  const result = await response.json()
  return { success: response.ok, message: result.message }
}

export const deleteUser = async (
  id: number,
  accessToken: string,
): Promise<{ success: boolean; message: string }> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/users/' + id,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      credentials: 'include',
    },
  )

  const result = await response.json()
  return { success: response.ok, message: result.message }
}

const UsersService = () => {}

export default UsersService
