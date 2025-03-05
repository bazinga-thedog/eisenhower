import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  makeStyles,
} from '@fluentui/react-components'
import { PagesContext } from '../context/PagesContext'
import { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import auth from '../hooks/useAuth'
import Section from './Section'
import Structure from '../styles/structure'
import Page from '../types/Page'
import { getAllPolicies } from '../services/PolicyService'

const useStyles = makeStyles({ ...Structure.Structure })

let breadcrumbItems: { name: string; location: string }[] = []

const createBreadcrumbs = (
  pages: Page[] | undefined,
  currentPage: Page | undefined,
) => {
  breadcrumbItems = []
  let parentid = currentPage?.parent

  while (parentid) {
    const parent = pages?.find(page => page.id === parentid)
    if (parent) {
      breadcrumbItems.push({ name: parent.name, location: parent.location })
      parentid = parent.parent
    } else {
      parentid = 0
    }
  }
}

const PolicyManager = () => {
  const location = useLocation()

  const pages = useContext(PagesContext)
  const currentPage = pages
    ?.map(x => x.children)[0]
    .filter(p => location.pathname.includes(p.location))[0]
  createBreadcrumbs(pages, currentPage)

  const accessToken = auth().accessToken

  useEffect(() => {
    const fetchData = async () => {
      const policies = await getAllPolicies(accessToken)
      console.log(policies)
    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error)
  })

  const styles = useStyles()

  return (
    <div className={styles.ColumnWrapper}>
      <div className={styles.FullWidth}>
        <Breadcrumb aria-label="Breadcrumb">
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
      </div>
      <div className={styles.FullWidth}>
        <Section />
      </div>
    </div>
  )
}

export default PolicyManager
