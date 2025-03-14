import {
  Avatar,
  Button,
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  CheckboxOnChangeData,
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  InputOnChangeData,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  mergeClasses,
  SearchBox,
  SearchBoxChangeEvent,
  Subtitle1,
  TableCellLayout,
  TableColumnDefinition,
  TableSelectionCell,
  Tooltip,
} from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { t } from 'i18next'
import auth from '../../hooks/useAuth'
import Structure from '../../styles/structure'
import { deletePolicy, getAllPolicies } from '../../services/PolicyService'
import Spacing from '../../styles/spacing'
import Format from '../../styles/format'
import {
  Delete16Regular,
  InfoFilled,
  MoreVerticalFilled,
} from '@fluentui/react-icons'
import Policy from '../../types/Policy'
import Breadcrumbs from '../Breadcrumbs'
import Pagination from 'react-js-pagination'
import PaginationStyle from '../../styles/pagination'
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
  TextField,
} from '@fluentui/react'
import { useMessage } from '../../context/MessageProvider'
import i18n from '../../i18n'

const useStyles = makeStyles({
  card: {
    margin: 'auto',
    width: '100%',
  },
  cardfull: {
    width: '100%',
  },
  ...Spacing.Spacing,
  ...Structure.Structure,
  ...Format.Format,
  ...PaginationStyle.Pagination,
  tweakIcon: { paddingTop: '5px' },
})

let allPolicies: Policy[] = []

const PolicyManager = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [policies, setPolicies] = useState([] as Policy[])
  const [selectedIds, setSelectedIds] = useState(new Set<number>())
  const [selection, setSelection] = useState(false as 'mixed' | boolean)
  const [activePage, setActivePage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [policyCount, setPolicyCount] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const PAGE_SIZE = 3

  const navigate = useNavigate()

  const navToPage = (url: string) => {
    navigate(url)
  }

  const accessToken = auth().accessToken
  const { showMessage } = useMessage()
  const userPermissions = auth().permissions

  useEffect(() => {
    const fetchData = async () => {
      const policies = await getAllPolicies(accessToken)
      setPolicies(policies.slice(0, PAGE_SIZE))
      allPolicies = policies
      setPolicyCount(allPolicies.length)
      setIsLoading(false)
    }

    fetchData().catch(console.error)
  }, [])

  const onSearchChange: (
    ev: SearchBoxChangeEvent,
    data: InputOnChangeData,
  ) => void = (_, data) => {
    setActivePage(1)
    setSearchText(data.value)
    let newPolicyList = allPolicies.filter(
      x =>
        !data.value ||
        x.name.toLowerCase().includes(data.value.toLowerCase()) ||
        x.updatedby.name.toLowerCase().includes(data.value.toLowerCase()),
    )
    setPolicyCount(newPolicyList.length)
    newPolicyList = newPolicyList.slice(0, PAGE_SIZE)
    setPolicies(newPolicyList)
  }

  const styles = useStyles()

  const columns: TableColumnDefinition<Policy>[] = [
    createTableColumn({
      columnId: 'selection',
      renderHeaderCell: () => (
        <TableSelectionCell
          onChange={e => {
            handleFullCheckChange(e.target as HTMLInputElement)
          }}
          checked={selection}
        />
      ),
      renderCell: row => (
        <TableSelectionCell
          checked={selectedIds.has(row.id)}
          onChange={e =>
            handleRowSelect({
              rowId: row.id,
              selected: (e.target as HTMLInputElement).checked,
            })
          }
        />
      ),
    }),
    createTableColumn<Policy>({
      columnId: 'name',
      compare: (a, b) => {
        return a.name.localeCompare(b.name)
      },
      renderHeaderCell: () => {
        return t('general.name')
      },
      renderCell: item => {
        return (
          <TableCellLayout>
            <Link className={styles.LinkPrimary} to={'/policies/' + item.id}>
              {item.name}
            </Link>
          </TableCellLayout>
        )
      },
    }),
    createTableColumn<Policy>({
      columnId: 'updatedby',
      compare: (a, b) => {
        return a.updatedby.name.localeCompare(b.updatedby.name)
      },
      renderHeaderCell: () => {
        return t('policies.updatedby')
      },
      renderCell: item => {
        return (
          <TableCellLayout
            media={
              <Avatar
                aria-label={item.updatedby.name}
                name={item.updatedby.name}
              />
            }
          >
            {item.updatedby.name}
          </TableCellLayout>
        )
      },
    }),
    createTableColumn<Policy>({
      columnId: 'lastUpdated',
      compare: (a, b) => {
        return a.updatedon.getTime() - b.updatedon.getTime()
      },
      renderHeaderCell: () => {
        return t('policies.updatedon')
      },

      renderCell: item => {
        return item.updatedon?.toLocaleString(i18n.language).replace(',', '')
      },
    }),
  ]

  const handleRowSelect = ({
    rowId,
    selected,
  }: {
    rowId: number
    selected: boolean
  }) => {
    setSelectedIds(prevSelected => {
      const newSelected = new Set(prevSelected)
      selected ? newSelected.add(rowId) : newSelected.delete(rowId)
      setSelection(
        newSelected.size > 0
          ? newSelected.size === allPolicies.length
            ? true
            : 'mixed'
          : false,
      )
      return newSelected
    })
  }

  const handleFullCheckChange = (data: CheckboxOnChangeData) => {
    let newSelection = []
    if (!data.checked) {
      setSelectedIds(new Set())
    } else {
      newSelection = [...selectedIds, ...policies.map(x => x.id)]
      setSelectedIds(new Set(newSelection))
    }
    setSelection(
      data.checked
        ? newSelection.length === allPolicies.length
          ? true
          : 'mixed'
        : false,
    )
  }

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber)
    let newPolicyList = allPolicies.filter(
      x =>
        !searchText ||
        x.name.toLowerCase().includes(searchText.toLowerCase()) ||
        x.updatedby.name.toLowerCase().includes(searchText.toLowerCase()),
    )
    setPolicyCount(newPolicyList.length)
    newPolicyList = newPolicyList.slice(
      (pageNumber - 1) * PAGE_SIZE,
      (pageNumber - 1) * PAGE_SIZE + PAGE_SIZE,
    )
    setPolicies(newPolicyList)
  }

  const openDialog = () => {
    setInputValue('') // Reset input field
    setIsDialogOpen(true)
  }
  const closeDialog = () => setIsDialogOpen(false)
  const confirmDelete = () => {
    if (
      inputValue ===
      'DELETE ' +
        selectedIds.size +
        ' polic' +
        (selectedIds.size === 1 ? 'y' : 'ies')
    ) {
      selectedIds.forEach(id => {
        deletePolicy(id, accessToken)
      })
      showMessage(
        `${t('policies.policy_plural')} ${t('policies.delete_success')}`,
        '',
        'success',
      )
      closeDialog()
      setTimeout(() => {
        window.location.href = window.location.href
      }, 1000)
    }
  }

  return (
    <div className={styles.ColumnWrapper}>
      <div className={styles.FullWidth}>
        <Breadcrumbs current="" />
      </div>
      <div className={styles.FullWidth}>
        <Card className={styles.card}>
          <CardHeader
            header={
              <div
                className={mergeClasses(
                  styles.LayoutColumns,
                  styles.ColumnWrapper,
                )}
              >
                <div className={styles.Column6}>
                  <div>
                    <div className={styles.Flex}>
                      <Subtitle1>{t('policies.policy_plural')}</Subtitle1>
                      <span
                        className={mergeClasses(
                          styles.MarginLeftBase,
                          styles.TextNote,
                          styles.AlignSelfVerticalCenter,
                        )}
                      >
                        |
                      </span>
                      <Tooltip
                        content={t('policies.info_content')}
                        positioning="above-start"
                        withArrow
                        relationship="label"
                        appearance="inverted"
                      >
                        <span
                          className={mergeClasses(
                            styles.MarginLeftBase,
                            styles.AlignSelfVerticalCenter,
                            styles.TextPrimary,
                            styles.tweakIcon,
                          )}
                        >
                          <InfoFilled />
                        </span>
                      </Tooltip>
                      <span
                        className={mergeClasses(
                          styles.MarginLeftSmall,
                          styles.TextPrimary,
                          styles.AlignSelfVerticalCenter,
                        )}
                      >
                        {t('general.info')}
                      </span>
                    </div>
                    <div
                      className={mergeClasses(
                        styles.FullWidth,
                        styles.TextNote,
                      )}
                    >
                      <Caption1>{t('policies.description')}</Caption1>
                    </div>
                    <div
                      className={mergeClasses(
                        styles.FullWidth,
                        styles.MarginTopBase,
                      )}
                    >
                      <SearchBox
                        placeholder={t('general.search')}
                        size="medium"
                        className={styles.FormControlsFullWidth}
                        onChange={onSearchChange}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={mergeClasses(styles.Column6, styles.AlignRight)}
                >
                  {userPermissions.some(x => x.includes('Policy:WRITE:-1')) ? (
                    <>
                      <Button
                        appearance="primary"
                        onClick={() => navToPage('/policies/edit')}
                      >
                        {t('policies.create')}
                      </Button>
                      <Menu>
                        <MenuTrigger disableButtonEnhancement>
                          <Button
                            className={styles.MarginLeftBase}
                            icon={<MoreVerticalFilled />}
                            appearance="subtle"
                            size="small"
                          />
                        </MenuTrigger>
                        <MenuPopover>
                          <MenuList>
                            <MenuItem
                              icon={<Delete16Regular />}
                              disabled={selectedIds.size === 0}
                              onClick={openDialog}
                            >
                              {t('general.delete')}
                            </MenuItem>
                          </MenuList>
                        </MenuPopover>
                      </Menu>
                    </>
                  ) : null}
                </div>
              </div>
            }
          />

          <CardPreview>
            {!isLoading && (
              <div>
                {policies.length > 0 ? (
                  <>
                    <DataGrid
                      columnSizingOptions={{
                        selection: { idealWidth: 30 },
                      }}
                      items={policies}
                      columns={columns}
                      sortable
                      getRowId={item => item.id}
                      focusMode="composite"
                      resizableColumnsOptions={{ autoFitColumns: false }}
                      resizableColumns={true}
                    >
                      <DataGridHeader>
                        <DataGridRow>
                          {({ renderHeaderCell }) => (
                            <DataGridHeaderCell>
                              {renderHeaderCell()}
                            </DataGridHeaderCell>
                          )}
                        </DataGridRow>
                      </DataGridHeader>

                      <DataGridBody<Policy>>
                        {({ item, rowId }) => (
                          <DataGridRow<Policy> key={rowId}>
                            {({ renderCell }) => (
                              <DataGridCell>{renderCell(item)}</DataGridCell>
                            )}
                          </DataGridRow>
                        )}
                      </DataGridBody>
                    </DataGrid>
                    <div
                      className={mergeClasses(
                        styles.MarginTopBase,
                        styles.PaginationWrapper,
                      )}
                    >
                      <div className={styles.MarginBase}>
                        <Pagination
                          activePage={activePage}
                          itemsCountPerPage={PAGE_SIZE}
                          totalItemsCount={policyCount}
                          pageRangeDisplayed={5}
                          onChange={handlePageChange}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className={mergeClasses(
                      styles.FullWidth,
                      styles.AlignCenter,
                      styles.TextNote,
                      styles.TextSmall,
                      styles.MarginBase,
                    )}
                  >
                    <span>
                      {t('policies.not_found') +
                        (userPermissions.some(x =>
                          x.includes('Policy:WRITE:-1'),
                        )
                          ? ` ${t('policies.create_start')}.`
                          : '')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardPreview>
        </Card>
        <Dialog
          hidden={!isDialogOpen}
          onDismiss={closeDialog}
          dialogContentProps={{
            title: t('general.are_you_sure'),
            subText: `${t('general.type')} "DELETE ${selectedIds.size} polic${selectedIds.size === 1 ? `y` : `ies`}" ${t('general.to_confirm_undone')}. `,
          }}
        >
          <TextField
            placeholder={`${t('general.type')} "DELETE ${selectedIds.size} polic${selectedIds.size === 1 ? `y` : `ies`}" ${t('general.to_confirm')}.`}
            value={inputValue}
            onChange={(e, newValue) => setInputValue(newValue || '')}
          />
          <DialogFooter>
            <PrimaryButton
              onClick={confirmDelete}
              text={t('general.delete')}
              disabled={
                inputValue !==
                `DELETE ${selectedIds.size} polic${selectedIds.size === 1 ? `y` : `ies`}`
              }
            />
            <DefaultButton onClick={closeDialog} text={t('general.cancel')} />
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  )
}

export default PolicyManager
