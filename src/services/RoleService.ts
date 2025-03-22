import { configs_servicebus } from '../configs/configs_servicebus'
import i18n from '../i18n'
import Policy from '../types/Policy'
import Role, { RolePolicyStructure, RoleStructure } from '../types/Role'
import { User } from '../types/User'

export const getAllRoles = async (accessToken: string): Promise<Role[]> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/roles',
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

  const roles: RoleStructure[] = await response.json()

  return roles.map(
    x =>
      ({
        id: x.id,
        name: x.name,
        description: x.description,
        updatedon: new Date(x.updatedon),
        updatedby: { name: x.user_name } as User,
      }) as Role,
  )
}

export const getRolesByPolicy = async (
  policy_id: number,
  accessToken: string,
): Promise<Role[]> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/policies/' + policy_id + '/roles',
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

  const roles: RoleStructure[] = await response.json()

  return roles.map(
    x =>
      ({
        id: x.id,
        name: x.name,
        description: x.description,
        updatedon: new Date(x.updatedon),
        updatedby: { name: x.user_name } as User,
      }) as Role,
  )
}

export const getRolesByUser = async (
  accessToken: string,
  user_id: number,
): Promise<Role[]> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/users/' + user_id + '/roles',
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

  const roles = rows

  return roles
}

export const getRole = async (
  accessToken: string,
  id: string,
): Promise<Role> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/roles/' + id,
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

  const roleWithPolicies: RolePolicyStructure[] = await response.json()
  if (roleWithPolicies.length === 0) {
    return {} as Role
  }

  let role: Role = {
    id: roleWithPolicies[0].id,
    name: roleWithPolicies[0].name,
    description: roleWithPolicies[0].description,
    updatedby: { name: roleWithPolicies[0].user_name } as User,
    updatedon: new Date(roleWithPolicies[0].updatedon),
    policies: [] as Policy[],
  }

  roleWithPolicies.forEach(x => {
    role.policies.push({
      id: x.policy_id,
      name: x.policy_name,
      description: x.policy_description,
    } as Policy)
  })

  return role
}

export const createRole = async (
  role: Role,
  accessToken: string,
): Promise<{ success: boolean; message: string }> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/roles',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify(role),
      credentials: 'include',
    },
  )

  const result = await response.json()
  return { success: response.ok, message: result.message }
}

export const updateRole = async (
  role: Role,
  accessToken: string,
): Promise<{ success: boolean; message: string }> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/roles',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'x-lang': i18n.language,
      },
      body: JSON.stringify(role),
      credentials: 'include',
    },
  )

  const result = await response.json()
  return { success: response.ok, message: result.message }
}

export const deleteRole = async (
  id: number,
  accessToken: string,
): Promise<{ success: boolean; message: string }> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/roles/' + id,
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

const RoleService = () => {}

export default RoleService
