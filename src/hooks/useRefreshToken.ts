import useAuth from './useAuth'

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    await fetch('http://localhost:3030/api/refresh', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        return response.json()
      })
      .then(authData => {
        setAuth({
          user: authData.user,
          permissions: authData.permissions,
          accessToken: authData.accessToken,
        })
      })
      .catch(err => {
        throw new Error(err.error || 'Failed to sign in.')
      })
  }
  return refresh
}

export default useRefreshToken
