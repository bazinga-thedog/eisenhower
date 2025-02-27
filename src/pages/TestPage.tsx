import NavBar from '../components/NavBar'
import Content from '../components/Content'
import Footer from '../components/Footer'

const TestPage = () => {
  return (
    <div>
      <div className="header">
        <NavBar />
      </div>
      <div className="body">
        <div className="content">
          <Content showSidebar={false}>
            <span>Test!</span>
          </Content>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

export default TestPage
