import * as React from 'react'
import {
  AppItem,
  NavCategory,
  NavCategoryItem,
  NavDivider,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
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
import { useLocation, useNavigate } from 'react-router-dom'
import { PagesContext } from '../context/PagesContext'

const useStyles = makeStyles({
  root: {
    overflow: 'hidden',
    display: 'flex',
    height: 'calc(100vh - 112px)',
  },
  content: {
    flex: '1',
    padding: '16px',
    display: 'flex',
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
  navbackground: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
})

const SidebarMenu = (props: {
  children: React.ReactNode
  showSidebar: boolean
}) => {
  const navigate = useNavigate()

  const navToPage = (url: string) => {
    navigate(url)
  }

  const styles = useStyles()

  const accessToken = auth().accessToken
  const username = auth().user.name

  const [pages, setPages] = useState([] as Page[])
  const [navIndex, setNavIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [openItem, setopenItem] = useState<string[] | undefined>([])

  const location = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      const pages = await getAllPages(accessToken)
      const currentPage = pages
        .map(x => x.children)[0]
        .filter(p => location.pathname.includes(p.location))[0]
      if (currentPage) {
        setNavIndex(currentPage.order)
        setopenItem(
          currentPage.parent > 0 ? [currentPage.parent.toString()] : undefined,
        )
      } else {
        //Assure that if we are at the home page, all the menu is expandable/collapsable
        setopenItem(undefined)
      }

      setPages(pages)
      setIsLoading(false)
    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error)
  }, [])

  if (!isLoading) {
    return (
      <div className={styles.root}>
        <NavDrawer
          selectedValue={navIndex.toString()}
          open={props.showSidebar}
          type="inline"
          openCategories={openItem}
          color=""
          className={styles.navbackground}
        >
          <NavDrawerHeader>
            <AppItem
              icon={<PersonCircle32Regular />}
              onClick={() => navToPage('/')}
              key="user"
              className={styles.navbackground}
            >
              {username}
            </AppItem>
          </NavDrawerHeader>
          <NavDivider />
          <NavDrawerBody>
            <NavCategory value="1">
              {pages.map(page => {
                return (
                  <div>
                    <NavCategoryItem
                      key={page.parent + '_' + page.order}
                      icon={<DynamicIcon tag={page.icon} />}
                      value={page.order}
                      className={styles.navbackground}
                    >
                      {page.name}
                    </NavCategoryItem>
                    <NavSubItemGroup>
                      {page.children.map(p => {
                        return (
                          <NavSubItem
                            onClick={() => navToPage('/' + p.location)}
                            value={p.order.toString()}
                            key={p.parent + '_' + p.order}
                            className={styles.navbackground}
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
        <div className={styles.content}>
          <PagesContext.Provider value={pages}>
            {props.children}
          </PagesContext.Provider>
        </div>
      </div>
    )
  } else {
    return <div>Side Menu Loading...</div>
  }
}
export default SidebarMenu
