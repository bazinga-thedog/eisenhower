import NavBar from '../components/NavBar'
import Content from '../components/Content'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const ContentPage = () => {
  return (
    <div>
      <div className="header">
        <NavBar />
      </div>
      <div className="body">
        <div className="content">
          <Content showSidebar={true}>
            <span>Hello!</span>
            <Link to="/test" className="btn btn-primary">
              Test
            </Link>
          </Content>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

export default ContentPage
