import Permission from './Permission'
import { User } from './User'

interface Policy {
  id: number
  name: string
  description: string
  updatedon: Date
  updatedby: User
  permissions: Permission[]
}

export interface PolicyStructure {
  id: number
  description: string
  updatedon: string
  updatedby: number
  name: string
  user_name: string
}

export interface PolicyPermissionStructure {
  id: number
  name: string
  description: string
  updatedon: string
  updatedby: number
  resourceid: number
  operation: string
  asset: string
  user_name: string
}

export default Policy
