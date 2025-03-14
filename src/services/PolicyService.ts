import { configs_servicebus } from '../configs/configs_servicebus'
import Permission from '../types/Permission'
import Policy, {
  PolicyPermissionStructure,
  PolicyStructure,
} from '../types/Policy'
import { User } from '../types/User'

export const getAllPolicies = async (
  accessToken: string,
): Promise<Policy[]> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/policies',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      credentials: 'include',
    },
  )

  if (!response.ok) {
    return []
  }

  const policies: [PolicyStructure] = await response.json()

  return policies.map(
    x =>
      ({
        id: x.id,
        name: x.name,
        updatedon: new Date(x.updatedon),
        updatedby: { name: x.user_name } as User,
      }) as Policy,
  )
}

export const getPolicy = async (
  accessToken: string,
  id: string,
): Promise<Policy> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/policies/' + id,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      credentials: 'include',
    },
  )

  const permissions: PolicyPermissionStructure[] = await response.json()
  if (permissions.length === 0) {
    return {} as Policy
  }

  let policy: Policy = {
    id: permissions[0].id,
    name: permissions[0].name,
    description: permissions[0].description,
    updatedby: { name: permissions[0].user_name } as User,
    updatedon: new Date(permissions[0].updatedon),
    permissions: [] as Permission[],
  }

  permissions.forEach(x => {
    if (
      policy.permissions.find(y => {
        return y.asset === x.asset && y.operation === x.operation
      })
    ) {
      policy.permissions
        .find(y => {
          return y.asset === x.asset && y.operation === x.operation
        })
        ?.resourceid.push(x.resourceid)
    } else {
      policy.permissions.push({
        id: x.id,
        asset: x.asset,
        operation: x.operation,
        resourceid: [x.resourceid],
      } as Permission)
    }
  })

  return policy
}

export const createPolicy = async (
  policy: Policy,
  accessToken: string,
): Promise<{ success: boolean; message: string }> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/policies',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify(policy),
      credentials: 'include',
    },
  )

  const result = await response.json()
  return { success: response.ok, message: result.message }
}

export const updatePolicy = async (
  policy: Policy,
  accessToken: string,
): Promise<{ success: boolean; message: string }> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/policies',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify(policy),
      credentials: 'include',
    },
  )

  const result = await response.json()
  return { success: response.ok, message: result.message }
}

export const deletePolicy = async (
  id: number,
  accessToken: string,
): Promise<{ success: boolean; message: string }> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/policies/' + id,
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

const PolicyService = () => {}

export default PolicyService
