import { User } from './user'

interface Auth {
  user: User
  permissions: [string]
  accessToken: string
}

export default Auth
