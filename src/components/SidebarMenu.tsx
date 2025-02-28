import * as React from 'react'
import {
  AppItem,
  NavCategory,
  NavCategoryItem,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
} from '@fluentui/react-nav-preview'

import { makeStyles, tokens } from '@fluentui/react-components'
import {
  /*NotePin20Regular,
  bundleIcon,*/
  PersonCircle32Regular,
} from '@fluentui/react-icons'
import { useEffect, useState } from 'react'
import { getAllPages } from '../services/PageService'
import auth from '../hooks/useAuth'
import Page from '../types/Page'
import DynamicIcon from './DynamicIcon'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles({
  root: {
    overflow: 'hidden',
    display: 'flex',
    height: 'calc(100vh - 112px)',
  },
  content: {
    flex: '1',
    padding: '16px',
    display: 'grid',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  field: {
    display: 'flex',
    marginTop: '4px',
    marginLeft: '8px',
    flexDirection: 'column',
    gridRowGap: tokens.spacingVerticalS,
  },
})

//const JobPostings = bundleIcon(PersonSettings20Regular, NotePin20Regular)

const SidebarMenu = (props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined
  showSidebar: boolean
}) => {
  const styles = useStyles()

  const linkDestination = ''

  const accessToken = auth().accessToken
  const username = auth().user.name

  const [pages, setPages] = useState([] as Page[])
  const [navIndex, setNavIndex] = useState(0)

  const location = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      const pages = await getAllPages(accessToken)
      const index =
        pages
          .map(x => x.children)[0]
          .filter(p => location.pathname.includes(p.location))[0]?.order ?? 0
      setNavIndex(index)
      setPages(pages)
    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error)
  }, [])

  return (
    <div className={styles.root}>
      <NavDrawer
        selectedValue={navIndex.toString()}
        defaultSelectedCategoryValue=""
        open={props.showSidebar}
        type="inline"
      >
        <NavDrawerHeader></NavDrawerHeader>
        <NavDrawerBody>
          <AppItem
            icon={<PersonCircle32Regular />}
            as="a"
            href={linkDestination}
          >
            {username}
          </AppItem>
          <NavSectionHeader>Administration</NavSectionHeader>
          <NavCategory value="1">
            {pages.map(page => {
              return (
                <div>
                  <NavCategoryItem
                    key={page.order.toString()}
                    icon={<DynamicIcon tag={page.icon} />}
                    value={page.order}
                  >
                    {page.name}
                  </NavCategoryItem>
                  <NavSubItemGroup>
                    {page.children.map(p => {
                      return (
                        <NavSubItem
                          href={p.location}
                          value={p.order.toString()}
                        >
                          {p.name}
                        </NavSubItem>
                      )
                    })}
                  </NavSubItemGroup>
                </div>
              )
            })}
          </NavCategory>
        </NavDrawerBody>
      </NavDrawer>
      <div className={styles.content}>{props.children}</div>
    </div>
  )
}
export default SidebarMenu
