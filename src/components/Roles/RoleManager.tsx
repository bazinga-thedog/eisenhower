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
import Spacing from '../../styles/spacing'
import Format from '../../styles/format'
import {
  Delete16Regular,
  InfoFilled,
  MoreVerticalFilled,
} from '@fluentui/react-icons'
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
import Role from '../../types/Role'
import { deleteRole, getAllRoles } from '../../services/RoleService'

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

let allRoles: Role[] = []

const RoleManager = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [roles, setRoles] = useState([] as Role[])
  const [selectedIds, setSelectedIds] = useState(new Set<number>())
  const [selection, setSelection] = useState(false as 'mixed' | boolean)
  const [activePage, setActivePage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [roleCount, setRoleCount] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const PAGE_SIZE = 10

  const navigate = useNavigate()

  const navToPage = (url: string) => {
    navigate(url)
  }

  const accessToken = auth().accessToken
  const { showMessage } = useMessage()
  const userPermissions = auth().permissions

  useEffect(() => {
    const fetchData = async () => {
      const roles = await getAllRoles(accessToken)
      setRoles(roles.slice(0, PAGE_SIZE))
      allRoles = roles
      setRoleCount(allRoles.length)
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
    let newRoleList = allRoles.filter(
      x =>
        !data.value ||
        x.name.toLowerCase().includes(data.value.toLowerCase()) ||
        x.updatedby.name.toLowerCase().includes(data.value.toLowerCase()),
    )
    setRoleCount(newRoleList.length)
    newRoleList = newRoleList.slice(0, PAGE_SIZE)
    setRoles(newRoleList)
  }

  const styles = useStyles()

  const columns: TableColumnDefinition<Role>[] = [
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
    createTableColumn<Role>({
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
            <Link className={styles.LinkPrimary} to={'/roles/' + item.id}>
              {item.name}
            </Link>
          </TableCellLayout>
        )
      },
    }),
    createTableColumn<Role>({
      columnId: 'updatedby',
      compare: (a, b) => {
        return a.updatedby.name.localeCompare(b.updatedby.name)
      },
      renderHeaderCell: () => {
        return t('general.updatedby')
      },
      renderCell: item => {
        return (
          <TableCellLayout
            className={styles.TextSmall}
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
    createTableColumn<Role>({
      columnId: 'lastUpdated',
      compare: (a, b) => {
        return a.updatedon.getTime() - b.updatedon.getTime()
      },
      renderHeaderCell: () => {
        return t('general.updatedon')
      },

      renderCell: item => {
        return (
          <TableCellLayout className={styles.TextSmall}>
            {item.updatedon?.toLocaleString(i18n.language).replace(',', '')}
          </TableCellLayout>
        )
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
          ? newSelected.size === allRoles.length
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
      newSelection = [...selectedIds, ...roles.map(x => x.id)]
      setSelectedIds(new Set(newSelection))
    }
    setSelection(
      data.checked
        ? newSelection.length === allRoles.length
          ? true
          : 'mixed'
        : false,
    )
  }

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber)
    let newRoleList = allRoles.filter(
      x =>
        !searchText ||
        x.name.toLowerCase().includes(searchText.toLowerCase()) ||
        x.updatedby.name.toLowerCase().includes(searchText.toLowerCase()),
    )
    setRoleCount(newRoleList.length)
    newRoleList = newRoleList.slice(
      (pageNumber - 1) * PAGE_SIZE,
      (pageNumber - 1) * PAGE_SIZE + PAGE_SIZE,
    )
    setRoles(newRoleList)
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
        ' role' +
        (selectedIds.size === 1 ? '' : 's')
    ) {
      selectedIds.forEach(id => {
        deleteRole(id, accessToken)
      })
      showMessage(
        `${t('roles.role_plural')} ${t('roles.delete_success')}`,
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
    <div className={mergeClasses(styles.ColumnWrapper, styles.LayoutColumns)}>
      <div className={styles.FullWidth}>
        <Breadcrumbs current="" />
      </div>
      <div className={mergeClasses(styles.Column6)}>
        <Card className={styles.CardFullHeight}>
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
                      <Subtitle1>{t('roles.role_plural')}</Subtitle1>
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
                        content={t('roles.info_content')}
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
                      <Caption1>{t('roles.description')}</Caption1>
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
                  {userPermissions.some(x => x.includes('Role:WRITE:-1')) ? (
                    <>
                      <Button
                        appearance="primary"
                        onClick={() => navToPage('/roles/edit')}
                      >
                        {t('roles.create')}
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

          <CardPreview className={styles.ScrollableContent}>
            {!isLoading && (
              <div>
                {roles.length > 0 ? (
                  <>
                    <DataGrid
                      columnSizingOptions={{
                        selection: { idealWidth: 30 },
                      }}
                      items={roles}
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

                      <DataGridBody<Role>>
                        {({ item, rowId }) => (
                          <DataGridRow<Role> key={rowId}>
                            {({ renderCell }) => (
                              <DataGridCell>{renderCell(item)}</DataGridCell>
                            )}
                          </DataGridRow>
                        )}
                      </DataGridBody>
                    </DataGrid>

                    {roleCount > PAGE_SIZE && (
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
                            totalItemsCount={roleCount}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                          />
                        </div>
                      </div>
                    )}
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
                      {t('roles.not_found') +
                        (userPermissions.some(x => x.includes('Role:WRITE:-1'))
                          ? ` ${t('roles.create_start')}.`
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
            subText: `${t('general.type')} "DELETE ${selectedIds.size} role${selectedIds.size === 1 ? `` : `s`}" ${t('general.to_confirm_undone')}. `,
          }}
        >
          <TextField
            placeholder={`${t('general.type')} "DELETE ${selectedIds.size} role${selectedIds.size === 1 ? `` : `s`}" ${t('general.to_confirm')}.`}
            value={inputValue}
            onChange={(e, newValue) => setInputValue(newValue || '')}
          />
          <DialogFooter>
            <PrimaryButton
              onClick={confirmDelete}
              text={t('general.delete')}
              disabled={
                inputValue !==
                `DELETE ${selectedIds.size} role${selectedIds.size === 1 ? `` : `s`}`
              }
            />
            <DefaultButton onClick={closeDialog} text={t('general.cancel')} />
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  )
}

export default RoleManager
