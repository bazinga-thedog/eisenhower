import { tokens } from '@fluentui/react-components'

const Border = {
  Border: {
    BorderRegular: {
      border: '1px solid ' + tokens.colorNeutralBackground2,
    },
    BorderRadiusRegular: {
      borderRadius: tokens.borderRadiusMedium,
    },
    BorderError: {
      border: tokens.colorPaletteRedBorder2,
    },
  },
}

export default Border
