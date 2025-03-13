import { tokens } from '@fluentui/react-components'

const PaginationStyle = {
  Pagination: {
    PaginationWrapper: {
      '& .pagination': {
        display: 'flex',
        listStyle: 'none',
        padding: '0',
        margin: '0',
        justifyContent: 'flex-end',
        gap: '2px',
        '& li': {
          display: 'inline-block',
        },
        '& a': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '24px',
          height: '24px',
          textDecoration: 'none',
          fontSize: '12px',
          fontWeight: '500',
          color: tokens.colorBrandForeground1,
          border: '1px solid ' + tokens.colorBrandForeground1,
          backgroundColor: tokens.colorNeutralBackground1,
          transition: 'all 0.2s ease-in-out',
        },
        '& a:hover': {
          backgroundColor: tokens.colorBrandForeground2Hover,
          color: tokens.colorNeutralBackground1,
        },

        '& .active': {
          '& a': {
            backgroundColor: tokens.colorBrandForeground1,
            color: tokens.colorNeutralBackground1,
            fontWeight: tokens.lineHeightBase600,
          },
        },
        '& .disabled': {
          '& a': {
            backgroundColor: tokens.colorNeutralBackgroundDisabled,
            color: tokens.colorNeutralForegroundDisabled,
            border: 'solid 1px ' + tokens.colorNeutralForegroundDisabled,
            cursor: 'not-allowed',
          },
        },
      },
    },
  },
}

export default PaginationStyle
