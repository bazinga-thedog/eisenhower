import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RequireAuth = ({ allowedPermissions }) => {
  const { accessToken, permissions } = useAuth()
  const location = useLocation()

  return permissions?.find(role => allowedPermissions?.includes(role)) ? (
    <Outlet />
  ) : accessToken > 0 ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default RequireAuth
