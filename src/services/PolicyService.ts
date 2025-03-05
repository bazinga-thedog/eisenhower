import { configs_servicebus } from '../configs/configs_servicebus'
import Policy, { PolicyStructure } from '../types/Policy'
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

const PolicyService = () => {}

export default PolicyService
