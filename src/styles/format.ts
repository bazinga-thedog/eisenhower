import { tokens } from '@fluentui/react-components'

const Format = {
  Format: {
    TextNote: {
      color: tokens.colorNeutralForeground3,
    },

    TextPrimary: {
      color: tokens.colorBrandForeground1,
    },
    TextError: {
      color: tokens.colorPaletteRedBorder2,
    },
    LinkPrimary: {
      color: tokens.colorBrandForeground1,
      ':hover': {
        color: tokens.colorBrandForeground2Hover,
      },
      textDecoration: 'none',
    },
    TextSmall: {
      fontSize: tokens.fontSizeBase200,
    },
    Label: {
      fontSize: tokens.fontSizeBase300,
    },
  },
}

export default Format
