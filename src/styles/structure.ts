const Structure = {
  Structure: {
    ColumnWrapper: {
      display: 'flex',
      width: '100%',
      flexWrap: 'wrap' as 'wrap',
    },
    FullWidth: {
      flex: '0 0 100%',
    },
    LayoutColumns: {
      flexDirection: 'row' as 'row',
      display: 'flex',
      gap: '10px',
    },
    Column6: {
      flex: '0 0 calc(50% - 5px)',
    },
    Column3: {
      flex: '0 0 calc(25% - 10px)',
    },
    AlignRight: {
      textAlign: 'right' as 'right',
    },
  },
}

export default Structure
