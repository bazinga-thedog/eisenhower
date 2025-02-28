import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
} from '@fluentui/react-components'
import { PagesContext } from '../context/PagesContext'
import { useContext } from 'react'
import { useLocation } from 'react-router-dom'

const PolicyManager = () => {
  const location = useLocation()
  const pages = useContext(PagesContext)
  const currentPage = pages
    ?.map(x => x.children)[0]
    .filter(p => location.pathname.includes(p.location))[0]

  let parentid = currentPage?.parent
  let breadcrumbItems: { name: string; location: string }[] = []
  while (parentid) {
    const parent = pages?.find(page => page.id === parentid)
    if (parent) {
      breadcrumbItems.push({ name: parent.name, location: parent.location })
      parentid = parent.parent
    } else {
      parentid = 0
    }
  }

  return (
    <Breadcrumb aria-label="Breadcrumb default example">
      {breadcrumbItems.map(item => {
        return (
          <>
            <BreadcrumbItem>
              <BreadcrumbButton href={item.location}>
                {item.name}
              </BreadcrumbButton>
            </BreadcrumbItem>
            <BreadcrumbDivider />
          </>
        )
      })}

      <BreadcrumbItem>
        <BreadcrumbButton href={currentPage?.location} current>
          {currentPage?.name}
        </BreadcrumbButton>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}

export default PolicyManager
