import React from 'react'
import Login from '../components/Login'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const LoginPage = () => {
  return (
    <div>
      <div className="header">
        <NavBar hasLoggedUser={false} />
      </div>
      <div className="body">
        <div className="content login">
          <Login />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

export default LoginPage
