import Role from './Role'

export interface User {
  id: string
  name: string
  username: string
  password: string
  email: string
  createdon: Date
  updatedon: Date
  updatedby: User
  roles: Role[]
}
