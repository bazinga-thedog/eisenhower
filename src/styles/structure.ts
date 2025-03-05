const Structure = {
  Structure: {
    Flex: {
      display: 'flex',
    },
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
      flex: 1,
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
    AlignSelfVerticalCenter: {
      alignSelf: 'center',
    },
    AlignSelfVerticalBottom: {
      alignSelf: 'flex-end',
    },
  },
}

export default Structure
