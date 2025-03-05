import { configs_servicebus } from '../configs/configs_servicebus'
import Policy from '../types/Policy'

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
  const policies: [Policy] = await response.json()

  return policies
}

const PolicyService = () => {}

export default PolicyService
