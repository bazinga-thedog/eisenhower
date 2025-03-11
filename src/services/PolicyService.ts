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
  const permissions: [PolicyPermissionStructure] = await response.json()

  let policy: Policy = {
    id: permissions[0].id,
    name: permissions[0].name,
    description: permissions[0].description,
    updatedby: { name: permissions[0].user_name } as User,
    updatedon: new Date(permissions[0].updatedon),
    permissions: permissions.map(
      x =>
        ({
          id: x.id,
          resourceid: [x.resourceid],
          operation: x.operation,
          asset: x.asset,
        }) as Permission,
    ),
  }

  return policy
}

const PolicyService = () => {}

export default PolicyService
