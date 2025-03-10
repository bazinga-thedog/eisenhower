import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  makeStyles,
} from '@fluentui/react-components'
import { useLocation } from 'react-router-dom'
import { PagesContext } from '../context/PagesContext'
import { useContext } from 'react'
import Page from '../types/Page'
import Format from '../styles/format'

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

const useStyles = makeStyles({
  ...Format.Format,
})

const Breadcrumbs = (props: { current: string }) => {
  const location = useLocation()
  const styles = useStyles()

  const pages = useContext(PagesContext)
  const currentPage = pages
    ?.map(x => x.children)[0]
    .filter(p => location.pathname.includes(p.location))[0]
  createBreadcrumbs(pages, currentPage)
  return (
    <Breadcrumb aria-label="Breadcrumb">
      {breadcrumbItems.map(item => {
        return (
          <>
            <BreadcrumbItem>
              <BreadcrumbButton
                href={item.location}
                className={styles.LinkPrimary}
              >
                {item.name}
              </BreadcrumbButton>
            </BreadcrumbItem>
            <BreadcrumbDivider />
          </>
        )
      })}
      <BreadcrumbItem>
        <BreadcrumbButton
          href={'/' + currentPage?.location}
          current={!props.current}
          className={props.current ? styles.LinkPrimary : ''}
        >
          {currentPage?.name}
        </BreadcrumbButton>
      </BreadcrumbItem>
      {(props.current || location.pathname.indexOf('/edit/') > -1) && (
        <>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current>{props.current}</BreadcrumbButton>
          </BreadcrumbItem>
        </>
      )}
    </Breadcrumb>
  )
}

export default Breadcrumbs
