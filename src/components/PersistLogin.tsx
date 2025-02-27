import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import useRefreshToken from '../hooks/useRefreshToken'

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { accessToken } = useAuth()

  useEffect(() => {
    let isMounted = true

    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.error(err)
      } finally {
        isMounted && setIsLoading(false)
      }
    }

    const checkAccessToken = async () => {
      if (!accessToken) {
        await verifyRefreshToken()
      } else {
        setIsLoading(false)
      }
    }

    checkAccessToken()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`)
    //console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
  }, [isLoading])

  return (
    <>
      {/*!persist ? <Outlet /> : */ isLoading ? <p>Loading...</p> : <Outlet />}
    </>
  )
}

export default PersistLogin
