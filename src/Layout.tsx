import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import NavBar from './components/NavBar'

const Layout = () => {
  return (
    <div>
      <div className="header">
        <NavBar />
      </div>
      <div className="body">
        <div className="content">
          <Outlet />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

export default Layout
