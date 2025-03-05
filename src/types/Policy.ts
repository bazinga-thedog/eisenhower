import { User } from './User'

interface Policy {
  id: number
  name: string
  updatedon: Date
  updatedby: User
}

export interface PolicyStructure {
  id: number
  name: string
  updatedon: string
  updatedby: number
  user_name: string
}

export default Policy
