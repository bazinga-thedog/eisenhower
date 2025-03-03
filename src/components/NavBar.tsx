import React from 'react'
import { SearchBox } from '@fluentui/react-components'
import '../assets/style/NavBar.css'

const defaultProps: INavBarOptionalProps = {
  hasLoggedUser: true,
}

const NavBar = (props: INavBarOptionalProps) => {
  const { hasLoggedUser } = props
  return (
    <div className="NavBar">
      <div className="logo ms-font-xl">
        <strong>Awesome App</strong>
      </div>
      {hasLoggedUser ? (
        <div className="searchbox">
          <SearchBox
            placeholder="Search"
            onChange={newValue =>
              console.log('SearchBox onChange fired: ' + newValue)
            }
          />
        </div>
      ) : null}
    </div>
  )
}

NavBar.defaultProps = defaultProps

export default NavBar
