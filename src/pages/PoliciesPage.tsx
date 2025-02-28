import NavBar from '../components/NavBar'
import Content from '../components/Content'
import Footer from '../components/Footer'
import PolicyManager from '../components/PolicyManager'

const PoliciesPage = () => {
  return (
    <div>
      <div className="header">
        <NavBar />
      </div>
      <div className="body">
        <div className="content">
          <Content showSidebar={true}>
            <PolicyManager />
          </Content>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

export default PoliciesPage
