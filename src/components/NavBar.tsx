import React from 'react'
import { SearchBox } from '@fluentui/react-components'
import '../assets/style/NavBar.css'

const NavBar = () => (
  <div className="NavBar">
    <div className="logo ms-font-xl">
      <strong>Awesome App</strong>
    </div>
    <div className="searchbox">
      <SearchBox
        placeholder="Search"
        onChange={newValue =>
          console.log('SearchBox onChange fired: ' + newValue)
        }
      />
    </div>
  </div>
)

export default NavBar
