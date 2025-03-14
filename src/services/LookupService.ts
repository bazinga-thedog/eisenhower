import { configs_servicebus } from '../configs/configs_servicebus'
import i18n from '../i18n'
import Lookup from '../types/Lookup'

export const getLookup = async (
  accessToken: string,
  asset: string,
): Promise<Lookup[]> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/lookups/' + asset,
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
  const lookups: [Lookup] = await response.json()

  return lookups
}

const LookupService = () => {}

export default LookupService
