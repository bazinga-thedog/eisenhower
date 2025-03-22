import { configs_servicebus } from '../configs/configs_servicebus'
import i18n from '../i18n'
import Permission from '../types/Permission'

export const getPermissionsByUser = async (
  accessToken: string,
  id: string,
): Promise<Permission[]> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/users/' + id + '/permissions',
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

  const permissions = [] as Permission[]

  rows.forEach(
    (x: { asset: string; operation: string; resourceid: number; id: any }) => {
      if (
        permissions.find((y: { asset: string; operation: string }) => {
          return y.asset === x.asset && y.operation === x.operation
        })
      ) {
        permissions
          .find((y: { asset: string; operation: string }) => {
            return y.asset === x.asset && y.operation === x.operation
          })
          ?.resourceid.push(x.resourceid)
      } else {
        permissions.push({
          id: x.id,
          asset: x.asset,
          operation: x.operation,
          resourceid: [x.resourceid],
        } as unknown as Permission)
      }
    },
  )

  return permissions
}

const PermissionService = () => {}

export default PermissionService
