import React from 'react'
import Login from '../components/Login'
import { makeStyles } from '@fluentui/react-components'
import Background from '../styles/background'

const useStyles = makeStyles({
  ...Background.Background,
})

const LoginPage = () => {
  const styles = useStyles()
  return (
    <div className={styles.BackgroundLogin}>
      <Login />
    </div>
  )
}

export default LoginPage
