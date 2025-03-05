import { tokens } from '@fluentui/react-components'
import LoginBackground from '../assets/images/login-background.svg'

const Background = {
  Background: {
    BackgroundLogin: {
      backgroundImage: `url(${LoginBackground})`,
    },
    BackgroundNeutral: {
      background: tokens.colorNeutralBackground1,
    },
  },
}

export default Background
