import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import { MessageProvider } from './context/MessageProvider'

const Layout = () => {
  return (
    <MessageProvider>
      <div className="App">
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
    </MessageProvider>
  )
}

export default Layout
