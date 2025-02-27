import * as React from 'react'
import SidebarMenu from './SidebarMenu'

export const Content = (props: {
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
  return (
    <div>
      <SidebarMenu showSidebar={props.showSidebar}>
        {props.children}
      </SidebarMenu>
    </div>
  )
}

export default Content
