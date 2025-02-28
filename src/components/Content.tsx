import * as React from 'react'
import SidebarMenu from './SidebarMenu'
import { makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  content: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
})

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
    <div className={useStyles().content}>
      <SidebarMenu showSidebar={props.showSidebar}>
        {props.children}
      </SidebarMenu>
    </div>
  )
}

export default Content
