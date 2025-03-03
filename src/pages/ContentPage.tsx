import Content from '../components/Content'
import { Link } from 'react-router-dom'

const ContentPage = () => {
  return (
    <Content showSidebar={true}>
      <span>Hello!</span>
      <Link to="/test" className="btn btn-primary">
        Test
      </Link>
    </Content>
  )
}

export default ContentPage
