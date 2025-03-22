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
    Column8: {
      flex: '0 0 calc(66% - 5px)',
    },
    Column6: {
      flex: '0 0 calc(50% - 5px)',
    },
    Column4: {
      flex: '0 0 calc(33% - 10px)',
    },
    Column3: {
      flex: '0 0 calc(25% - 10px)',
    },
    ScrollableContent: {
      height: 'calc(100vh - 290px)',
      overflowY: 'auto' as 'auto',
    },
    AlignLeft: {
      textAlign: 'left' as 'left',
    },
    AlignCenter: {
      textAlign: 'center' as 'center',
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
    SelfAlign: {
      alignSelf: 'center',
    },
  },
}

export default Structure
