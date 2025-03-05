const Structure = {
  Structure: {
    Flex: {
      display: 'flex',
    },
    FlexToCenterMiddle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    HeightFullContent: {
      height: 'calc(100vh - 112px)',
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
    AlignLeft: {
      textAlign: 'left' as 'left',
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
    FifthScreenWidth: {
      width: 'calc(100vw / 5)',
    },
    FormControlsFullWidth: {
      width: '100%',
    },
  },
}

export default Structure
