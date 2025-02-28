import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import useRefreshToken from '../hooks/useRefreshToken'

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { accessToken } = useAuth()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    const checkAccessToken = async () => {
      await verifyRefreshToken()
    }

    if (!accessToken) {
      checkAccessToken()
    } else {
      setIsLoading(false)
    }
  }, [])

  return <>{isLoading ? <p>Persist Loading...</p> : <Outlet />}</>
}

export default PersistLogin
