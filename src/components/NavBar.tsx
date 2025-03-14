import React from 'react'
import { SearchBox, Tooltip } from '@fluentui/react-components'
import '../assets/style/NavBar.css'
import LanguageSwitcher from './LanguageSwitcher'

const defaultProps: INavBarOptionalProps = {
  hasLoggedUser: true,
}

const NavBar = (props: INavBarOptionalProps) => {
  const { hasLoggedUser } = props
  return (
    <div className="NavBar">
      <Tooltip
        content="Testing"
        positioning="above-start"
        withArrow
        relationship="label"
        appearance="inverted"
      ></Tooltip>
      <div className="logo ms-font-xl">
        <strong>Awesome App</strong>
      </div>
      <div className="searchbox">
        <LanguageSwitcher />
        {hasLoggedUser ? (
          <SearchBox
            placeholder="Search"
            onChange={newValue =>
              console.log('SearchBox onChange fired: ' + newValue)
            }
          />
        ) : null}
      </div>
    </div>
  )
}

NavBar.defaultProps = defaultProps

export default NavBar
