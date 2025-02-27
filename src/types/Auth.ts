import { User } from './User'

interface Auth {
  user: User
  permissions: [string]
  accessToken: string
}

export default Auth
