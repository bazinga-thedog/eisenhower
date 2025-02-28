import {
  PersonSettings20Filled,
  PersonSettings20Regular,
} from '@fluentui/react-icons'
import { Component } from 'react'

interface DynamicIconProps {
  tag: string
}

class DynamicIcon extends Component<DynamicIconProps> {
  components = {
    PersonSettings20Regular: PersonSettings20Regular,
    PersonSettings20Filled: PersonSettings20Filled,
  }
  render() {
    const TagName =
      this.components[this.props.tag as keyof typeof this.components]
    return <TagName />
  }
}
export default DynamicIcon
