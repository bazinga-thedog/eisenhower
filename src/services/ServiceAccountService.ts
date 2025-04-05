
import { configs_servicebus } from "../configs/configs_servicebus"
import i18n from "../i18n"
import { User } from '../types/User'
import { ServiceAccount } from "../types/ServiceAccount"
/*Imports*/


export const getAllServiceAccounts = async (accessToken: string): Promise<ServiceAccount[]> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/serviceaccount',
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
      (x: { createdon: Date }) => (x.createdon = new Date(x.createdon)),
(x: { updatedon: Date }) => (x.updatedon = new Date(x.updatedon)),
(x: { expireson: Date }) => (x.expireson = new Date(x.expireson))
  )

  let serviceaccount = [] as ServiceAccount[]
  rows.forEach((x: any) => {
    serviceaccount.push({
      id: x.id,name: x.name,client_id: x.client_id,client_secret: x.client_secret,createdon: new Date(x.createdon),updatedon: new Date(x.updatedon),expireson: new Date(x.expireson)
        , updatedby: { name : x.updatedby_name, id : x.updatedby_id } as User
    } as ServiceAccount)
  })

  return serviceaccount
}


export const getServiceAccount = async (accessToken: string, id: string): Promise<ServiceAccount> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/serviceaccount/' + id,
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
    return {} as ServiceAccount
  }

  const { success, rows } = await response.json()
  if (!success) return {} as ServiceAccount

  rows.forEach((x:any) => (
      x.createdon = new Date(x.createdon),
x.updatedon = new Date(x.updatedon),
x.expireson = new Date(x.expireson)
  ))

  const serviceaccount = rows[0] as ServiceAccount

  return serviceaccount
}


export const createServiceAccount = async (serviceaccount: ServiceAccount, accessToken: string): Promise<{ success: boolean; message: string }> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/serviceaccount',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify(serviceaccount),
      credentials: 'include',
    },
  )

  const result = await response.json()
    return {
      success: response.ok,
      message: response.ok ? result.message : result.message,
    }
}


export const updateServiceAccount = async (serviceaccount: ServiceAccount, accessToken: string): Promise<{ success: boolean; message: string }> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/serviceaccount',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'x-lang': i18n.language,
      },
      body: JSON.stringify(serviceaccount),
      credentials: 'include',
    },
  )

  const result = await response.json()
  return { success: response.ok, message: result.message }
}

/*Methods*/


    const ServiceAccountService = () => {}

    export default ServiceAccountService
/*Definition*/