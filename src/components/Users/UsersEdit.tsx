import { useNavigate, useParams } from 'react-router-dom'
import Structure from '../../styles/structure'
import {
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Divider,
  Input,
  Label,
  makeStyles,
  mergeClasses,
  Subtitle1,
  Tab,
  TableCellLayout,
  TableColumnDefinition,
  TabList,
  Title3,
  Tooltip,
  Button,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  //TableSelectionCell,
  SearchBox,
  SearchBoxChangeEvent,
  InputOnChangeData,
  TableSelectionCell,
  CheckboxOnChangeData,
  //CheckboxOnChangeData,
} from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { t } from 'i18next'
import auth from '../../hooks/useAuth'
import Policy from '../../types/Policy'
import Breadcrumbs from '../Breadcrumbs'
import Format from '../../styles/format'
import Spacing from '../../styles/spacing'
import PaginationStyle from '../../styles/pagination'
import {
  CheckmarkCircleRegular,
  CopyRegular,
  DeleteRegular,
  InfoFilled,
} from '@fluentui/react-icons'
import Pagination from 'react-js-pagination'
import Role from '../../types/Role'
import { getAllRoles, getRolesByUser } from '../../services/RoleService'
import { useMessage } from '../../context/MessageProvider'
import { User } from '../../types/User'
import { createUser, getUser, updateUser } from '../../services/UsersService'

const useStyles = makeStyles({
  ...Structure.Structure,
  ...Format.Format,
  ...Spacing.Spacing,
  ...PaginationStyle.Pagination,
  tweakIcon: { paddingTop: '5px' },
})

let allRoles: Role[] = []

const UserEdit = () => {
  const { id } = useParams()
  const isNew = !parseInt(id || '0')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRoles, setIsLoadingRoles] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [roleList, setRoleList] = useState([] as Role[])
  const [selectedIds, setSelectedIds] = useState(new Set<number | string>())
  const [selection, setSelection] = useState(false as 'mixed' | boolean)
  const [error, setError] = useState('')
  const [activePage, setActivePage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [roleCount, setRoleCount] = useState(0)
  const [formData, setFormData] = useState({
    user: { name: '', username: '', email: '' } as User,
    roles: [] as Role[],
  })
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const PAGE_SIZE = 5

  const styles = useStyles()

  const accessToken = auth().accessToken
  const { showMessage } = useMessage()
  const navigate = useNavigate()

  const navToPage = (url: string) => {
    navigate(url)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!isNew) {
        const user = await getUser(accessToken, id || '0')
        if (!user.id) {
          navigate('/users', { replace: true })
          return
        }
        const roles = await getRolesByUser(accessToken, Number(id) || 0)
        setFormData({ user: user, roles: roles })
      } else {
        formData.roles = []
      }
      allRoles = await getAllRoles(accessToken)
      setRoleList(allRoles.slice(0, PAGE_SIZE))
      setRoleCount(allRoles.length)
      setIsLoading(false)
    }

    fetchData().catch(console.error)
  }, [])

  const clearError = () => {
    setError('')
  }

  const addNewRole = () => {
    clearError()
    setSelectedIds(new Set(formData.roles.map(x => x.id)))
    setRoleList(allRoles)
    setActivePage(1)
    setIsLoadingRoles(false)
    setDialogOpen(true)
  }

  const columns: TableColumnDefinition<Role>[] = [
    createTableColumn<Role>({
      columnId: 'name',
      compare: (a, b) => {
        return a.name?.localeCompare(b.name)
      },
      renderHeaderCell: () => {
        return t('general.name')
      },
      renderCell: item => {
        return <TableCellLayout> {item.name}</TableCellLayout>
      },
    }),
    createTableColumn<Role>({
      columnId: 'description',
      compare: (a, b) => {
        return a.description?.localeCompare(b.description)
      },
      renderHeaderCell: () => {
        return t('general.description')
      },
      renderCell: item => {
        return <TableCellLayout>{item.description}</TableCellLayout>
      },
    }),
    createTableColumn<Role>({
      columnId: 'delete',
      compare: (a, b) => {
        return a.description?.localeCompare(b.description)
      },
      renderHeaderCell: () => {
        return ''
      },
      renderCell: item => {
        return (
          <TableCellLayout>
            <Button
              size="small"
              iconPosition="after"
              onClick={() => removeRole(item.id)}
              icon={<DeleteRegular />}
            ></Button>
          </TableCellLayout>
        )
      },
    }),
  ]

  const handleRowSelect = ({
    rowId,
    selected,
  }: {
    rowId: number | string
    selected: boolean
  }) => {
    setSelectedIds(prevSelected => {
      const newSelected = new Set(prevSelected)
      selected
        ? newSelected.add(rowId.toString())
        : newSelected.delete(rowId.toString())
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
      newSelection = [...selectedIds, ...roleList.map(x => x.id)]
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

  const columns_role: TableColumnDefinition<Role>[] = [
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
      columnId: 'title',
      compare: (a, b) => {
        return a.name.localeCompare(b.name)
      },
      renderHeaderCell: () => {
        return t('general.name')
      },
      renderCell: item => {
        return <TableCellLayout>{item.name}</TableCellLayout>
      },
    }),
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    length?: number,
  ): void => {
    const { name, value } = e.target
    if (length && value.length <= length) {
      setFormData(prev => ({
        ...prev,
        user: { ...prev.user, [name]: value },
      }))
    }
  }

  const onSearchChange: (
    ev: SearchBoxChangeEvent,
    data: InputOnChangeData,
  ) => void = (_, data) => {
    setActivePage(1)
    setSearchText(data.value)
    let newRoleList = allRoles.filter(
      x =>
        !data.value || x.name.toLowerCase().includes(data.value.toLowerCase()),
    )
    setRoleCount(newRoleList.length)
    newRoleList = newRoleList.slice(0, PAGE_SIZE)
    setRoleList(newRoleList)
  }

  const onRolesSelected = () => {
    formData.roles = allRoles.filter(p => selectedIds.has(p.id))
    setSearchText('')
    setActivePage(1)
    setSelectedIds(new Set())
    setSelection(false)
    setDialogOpen(false)
  }

  const removeRole = (id: number) => {
    clearError()
    setFormData(prev => ({
      ...prev,
      roles: formData.roles.filter(item => item.id !== id),
    }))
  }

  const saveUser = async (e: any) => {
    const user = {
      id: isNew ? 0 : parseInt(id || '0'),
      name: formData.user.name,
      username: formData.user.username,
      email: formData.user.email,
    } as unknown as User

    e.preventDefault()
    const result = isNew
      ? await createUser(user, formData.roles, accessToken)
      : await updateUser(user, formData.roles, accessToken)
    if (result.success) {
      setFormData({
        user: { name: '', username: '', email: '' } as User,
        roles: [] as Role[],
      })
      if (isNew) {
        setPassword(result.message)
        setIsPasswordShown(true)
      } else {
        showMessage(
          `${t('users.user')} "${user.name}" ${t('general.success_past')} ${t('general.updated')}`,
          '',
          'success',
          2000,
        )
        navToPage('/users')
      }
    } else {
      showMessage(t('users.error_creation'), result.message, 'error', 5000)
      setError(result.message)
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber)
    let newRoleList = allRoles.filter(
      x =>
        !searchText ||
        x.name.toLowerCase().includes(searchText.toLowerCase()) ||
        x.description.toLowerCase().includes(searchText.toLowerCase()),
    )
    setRoleCount(newRoleList.length)
    newRoleList = newRoleList.slice(
      (pageNumber - 1) * PAGE_SIZE,
      (pageNumber - 1) * PAGE_SIZE + PAGE_SIZE,
    )
    setRoleList(newRoleList)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const closePasswordDialog = () => {
    showMessage(
      `${t('users.user')} "${formData.user.name}" ${t('general.success_past')} ${t('general.created')}`,
      '',
      'success',
      2000,
    )
    navToPage('/users')
  }

  return (
    <div className={mergeClasses(styles.ColumnWrapper, styles.FullWidth)}>
      <div className={styles.FullWidth}>
        <Breadcrumbs
          current={isNew ? t('general.create') : formData.user.name}
        />
      </div>
      <div
        className={mergeClasses(
          styles.FullWidth,
          styles.MarginTopBase,
          styles.MarginLeftBase,
        )}
      >
        <Title3>{isNew ? t('users.create') : t('users.edit')}</Title3>
      </div>
      <div className={mergeClasses(styles.Column6, styles.MarginTopBase)}>
        <Card className={styles.CardWithTitleFullHeight}>
          <CardHeader
            header={
              <div className={styles.LayoutColumns}>
                <div className={styles.FullWidth}>
                  <div className={styles.Flex}>
                    <Subtitle1>{t('users.user_plural')}</Subtitle1>
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
                      content={t('users.info_content')}
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
                    className={mergeClasses(styles.FullWidth, styles.TextNote)}
                  >
                    <Caption1>{t('users.description')}</Caption1>
                  </div>
                </div>
                <div
                  className={mergeClasses(styles.Column6, styles.AlignRight)}
                ></div>
              </div>
            }
          />
          <CardPreview>
            <div>
              {!isLoading && (
                <form method="POST">
                  <div
                    className={mergeClasses(
                      styles.MarginBottomBase,
                      styles.ScrollableContent,
                    )}
                  >
                    <Divider />
                    <div
                      className={mergeClasses(
                        styles.FullWidth,
                        styles.PaddingBase,
                      )}
                    >
                      <div>
                        <Label htmlFor="name" className={styles.Label}>
                          {t('general.name') + ' *'}
                        </Label>
                      </div>
                      <div
                        className={mergeClasses(
                          styles.MarginBottomSmall,
                          styles.TextNote,
                          styles.TextSmall,
                        )}
                      >
                        {`${t('users.description_name')}`}
                      </div>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.user.name}
                        maxLength={20}
                        onChange={e => {
                          handleChange(e, 20)
                        }}
                        placeholder={t('users.name_ph')}
                        required
                        className={mergeClasses(
                          styles.FormControlsFullWidth,
                          styles.MarginBottomSmall,
                        )}
                      />
                    </div>
                    <div
                      className={mergeClasses(
                        styles.FullWidth,
                        styles.PaddingBase,
                      )}
                    >
                      <div>
                        <Label htmlFor="username" className={styles.Label}>
                          {t('general.username') + ' *'}
                        </Label>
                      </div>
                      <div
                        className={mergeClasses(
                          styles.MarginBottomSmall,
                          styles.TextNote,
                          styles.TextSmall,
                        )}
                      >
                        {`${t('users.description_username')}`}
                      </div>
                      <Input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.user.username}
                        onChange={e => {
                          handleChange(e, 30)
                        }}
                        placeholder={t('users.username_ph')}
                        required
                        className={mergeClasses(
                          styles.FormControlsFullWidth,
                          styles.MarginBottomSmall,
                        )}
                      />
                    </div>
                    <div
                      className={mergeClasses(
                        styles.FullWidth,
                        styles.PaddingBase,
                      )}
                    >
                      <div>
                        <Label htmlFor="email" className={styles.Label}>
                          {t('general.email') + ' *'}
                        </Label>
                      </div>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.user.email}
                        maxLength={50}
                        placeholder={t('users.email_ph')}
                        required
                        onChange={e => {
                          handleChange(e, 50)
                        }}
                        className={mergeClasses(
                          styles.FormControlsFullWidth,
                          styles.MarginBottomSmall,
                        )}
                      />
                    </div>
                    <TabList selectedValue={'roles'}>
                      <Tab id="Roles" value="roles">
                        {t('general.roles')}
                      </Tab>
                    </TabList>
                    <div
                      className={mergeClasses(
                        styles.LayoutColumns,
                        styles.MarginBase,
                        styles.ColumnWrapper,
                      )}
                    >
                      {formData.roles.length > 0 ? (
                        <div className={styles.FullWidth}>
                          <DataGrid
                            items={formData.roles}
                            columns={columns}
                            sortable
                            getRowId={item => item.id}
                            focusMode="composite"
                            size="extra-small"
                            resizableColumnsOptions={{
                              autoFitColumns: false,
                            }}
                            resizableColumns={true}
                            columnSizingOptions={{
                              //name: { idealWidth: 100 },
                              description: { minWidth: 300 },
                              delete: { idealWidth: 30 },
                            }}
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
                                <DataGridRow<Policy>
                                  key={rowId}
                                  className={styles.MarginTopBase}
                                >
                                  {({ renderCell }) => (
                                    <DataGridCell>
                                      {renderCell(item)}
                                    </DataGridCell>
                                  )}
                                </DataGridRow>
                              )}
                            </DataGridBody>
                          </DataGrid>
                          {error && (
                            <div
                              className={mergeClasses(
                                styles.TextError,
                                styles.AlignLeft,
                                styles.MarginLeftBase,
                              )}
                            >
                              {error}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={mergeClasses(
                            styles.FullWidth,
                            styles.AlignCenter,
                            styles.TextNote,
                            styles.TextSmall,
                          )}
                        >
                          <span>{t('users.no_roles')}</span>
                        </div>
                      )}
                      <div
                        className={mergeClasses(
                          styles.MarginTopBase,
                          styles.ColumnWrapper,
                          styles.FullWidth,
                        )}
                      >
                        <div className={styles.Column6}>
                          <Button onClick={addNewRole}>
                            {t('users.add_role')}
                          </Button>
                        </div>
                        <div
                          className={mergeClasses(
                            styles.Column6,
                            styles.AlignRight,
                          )}
                        >
                          <Button
                            onClick={navToPage.bind(
                              null,
                              '/users' +
                                (id && parseInt(id) > 0 ? '/' + id : ''),
                            )}
                          >
                            {t('general.cancel')}
                          </Button>
                          <Button
                            type="submit"
                            appearance="primary"
                            className={styles.MarginLeftBase}
                            onClick={e => saveUser(e)}
                            disabled={
                              formData.user.name === '' ||
                              formData.user.username === '' ||
                              formData.user.email === '' ||
                              formData.roles.length === 0
                            }
                          >
                            {t('general.save')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </CardPreview>
        </Card>
      </div>
      <Dialog open={dialogOpen}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              {t('general.select_available') + ' ' + t('general.roles')}
            </DialogTitle>
            <DialogContent>
              {!isLoadingRoles && (
                <div>
                  <div className={styles.AlignLeft}>
                    <SearchBox
                      className={mergeClasses(styles.FormControlsFullWidth)}
                      placeholder={t('general.search')}
                      onChange={onSearchChange}
                    ></SearchBox>
                  </div>
                  <div className={styles.MarginTopBase}>
                    <DataGrid
                      columnSizingOptions={{
                        selection: { idealWidth: 30 },
                      }}
                      items={roleList}
                      columns={columns_role}
                      sortable
                      getRowId={item => item.id as number}
                      focusMode="composite"
                      resizableColumnsOptions={{ autoFitColumns: true }}
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
                          <DataGridRow<Policy>
                            key={rowId}
                            onClick={(e: any) => {
                              handleRowSelect({
                                rowId: parseInt(rowId.toString()),
                                selected: !selectedIds.has(rowId),
                              })
                            }}
                          >
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
                        <Pagination
                          activePage={activePage}
                          itemsCountPerPage={PAGE_SIZE}
                          totalItemsCount={roleCount}
                          pageRangeDisplayed={5}
                          onChange={handlePageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button
                  appearance="secondary"
                  onClick={() => {
                    setDialogOpen(false)
                  }}
                >
                  {t('general.close')}
                </Button>
              </DialogTrigger>
              <Button
                appearance="primary"
                onClick={onRolesSelected}
                disabled={selectedIds.size === 0}
              >
                {t('general.done')}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Dialog open={isPasswordShown}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('users.user_created')}</DialogTitle>
            <DialogContent>
              <p>{t('users.pass_copy_warning')}</p>
              <div
                className={mergeClasses(
                  styles.Flex,
                  styles.AlignFlexChildCenter,
                  styles.FullWidth,
                  styles.TextPrimary,
                  styles.TextBold,
                )}
              >
                <p>{password}</p>
                <Button
                  icon={copied ? <CheckmarkCircleRegular /> : <CopyRegular />}
                  appearance="subtle"
                  onClick={handleCopy}
                />
                {copied && (
                  <p
                    className={styles.TextSuccess}
                  >{`${t('general.copied')!}`}</p>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="primary" onClick={closePasswordDialog}>
                {t('general.close')}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  )
}

export default UserEdit
