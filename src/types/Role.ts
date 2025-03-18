import Policy from './Policy'
import { User } from './User'

interface Role {
  id: number
  name: string
  description: string
  updatedon: Date
  updatedby: User
  policies: Policy[]
}

export interface RoleStructure {
  id: number
  description: string
  updatedon: string
  updatedby: number
  name: string
  user_name: string
}

export interface RolePolicyStructure {
  id: number
  name: string
  description: string
  updatedon: string
  updatedby: number
  policy_id: number
  policy_name: string
  policy_description: string
  user_name: string
}

export default Role
