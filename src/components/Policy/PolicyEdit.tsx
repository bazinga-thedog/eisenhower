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
  Option,
  Button,
  RadioGroup,
  Radio,
  CounterBadge,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSelectionCell,
  SearchBox,
  SearchBoxChangeEvent,
  InputOnChangeData,
  CheckboxOnChangeData,
  Dropdown,
} from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { t } from 'i18next'
import {
  createPolicy,
  getPolicy,
  updatePolicy,
} from '../../services/PolicyService'
import auth from '../../hooks/useAuth'
import { configs_permission_assets } from '../../configs/configs_permission_assets'
import Policy from '../../types/Policy'
import Breadcrumbs from '../Breadcrumbs'
import Format from '../../styles/format'
import Spacing from '../../styles/spacing'
import PaginationStyle from '../../styles/pagination'
import Permission from '../../types/Permission'
import {
  DeleteRegular,
  InfoFilled,
  MoreHorizontalFilled,
} from '@fluentui/react-icons'
import { configs_permission_operation } from '../../configs/configs_permission_operation'
import Lookup from '../../types/Lookup'
import { getLookup } from '../../services/LookupService'
import { useMessage } from '../../context/MessageProvider'
import Pagination from 'react-js-pagination'

const useStyles = makeStyles({
  ...Structure.Structure,
  ...Format.Format,
  ...Spacing.Spacing,
  ...PaginationStyle.Pagination,
  tweakIcon: { paddingTop: '5px' },
  tweakCombo: { minWidth: '0', '& input': { width: '100%' } },
  tweakDropdown: { '& .fui-TableCellLayout__content': { width: '100%' } },
})

let allLookup: Lookup[] = []

const PolicyEdit = () => {
  const { id } = useParams()
  const isNew = !parseInt(id || '0')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingLookup, setIsLoadingLookup] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [lookupResource, setLookupResource] = useState('')
  const [permissionList, SetPermissionList] = useState([] as Permission[])
  const [lookupList, setLookupList] = useState([] as Lookup[])
  const [selectedIds, setSelectedIds] = useState(new Set<number>())
  const [selection, setSelection] = useState(false as 'mixed' | boolean)
  const [selectedRowId, setSelectedRowId] = useState(0)
  const [error, setError] = useState('')
  const [activePage, setActivePage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [lookupCount, setLookupCount] = useState(0)

  const PAGE_SIZE = 5

  const styles = useStyles()

  const accessToken = auth().accessToken
  const { showMessage } = useMessage()
  const navigate = useNavigate()

  const navToPage = (url: string) => {
    navigate(url)
  }

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  } as Policy)

  useEffect(() => {
    const fetchData = async () => {
      if (!isNew) {
        const policy = await getPolicy(accessToken, id || '0')
        if (!policy.id) {
          navigate('/policies', { replace: true })
          return
        }
        setFormData(policy)
        SetPermissionList(policy.permissions)
      } else {
        formData.permissions = []
      }
      setIsLoading(false)
    }

    fetchData().catch(console.error)
  }, [])

  const clearError = () => {
    setError('')
  }

  const getLookupData = async (asset: string) => {
    allLookup = await getLookup(accessToken, asset)
    setLookupList(allLookup.slice(0, PAGE_SIZE))
    setLookupCount(allLookup.length)
    setIsLoadingLookup(false)
  }

  const addNewPermission = () => {
    permissionList.push({
      id:
        -1 *
        (permissionList.reduce(
          (max, item) => (Math.abs(item.id) > max ? Math.abs(item.id) : max),
          0,
        ) +
          1),
      asset: '',
      operation: '',
      resourceid: [-1],
    } as Permission)
    SetPermissionList([...permissionList])
    clearError()
  }

  const showResources = (
    rowId: number,
    asset: string,
    permissions: number[],
  ) => {
    clearError()
    setIsLoadingLookup(true)
    setSelectedIds(new Set(permissions.filter(x => x !== 0)))
    setSelectedRowId(rowId)
    setLookupResource(asset)
    setActivePage(1)
    getLookupData(asset).then(() => setDialogOpen(true))
  }

  const onAssetOptionSelect = (ev: any, data: any, id: number) => {
    clearError()
    SetPermissionList(
      permissionList.map(p =>
        p.id === id ? { ...p, asset: data.optionValue, resourceid: [-1] } : p,
      ),
    )
  }

  const onOperationOptionSelect = (ev: any, data: any, id: number) => {
    clearError()
    SetPermissionList(
      permissionList.map(p =>
        p.id === id ? { ...p, operation: data.optionValue } : p,
      ),
    )
  }

  const onResourceChange = (ev: any, data: any, id: number) => {
    clearError()
    SetPermissionList(
      permissionList.map(p =>
        p.id === id
          ? { ...p, resourceid: data.value === 'all' ? [-1] : [0] }
          : p,
      ),
    )
  }

  const columns: TableColumnDefinition<Permission>[] = [
    createTableColumn<Permission>({
      columnId: 'asset',
      compare: (a, b) => {
        return a.asset?.localeCompare(b.asset)
      },
      renderHeaderCell: () => {
        return t('policies.asset')
      },
      renderCell: item => {
        return (
          <TableCellLayout
            className={mergeClasses(
              styles.FormControlsFullWidth,
              styles.tweakDropdown,
            )}
          >
            <Dropdown
              size="small"
              placeholder={t('policies.asset_select')}
              className={mergeClasses(
                styles.tweakCombo,
                styles.FormControlsFullWidth,
              )}
              clearable
              value={item.asset ? t('enums.' + item.asset) : ''}
              onOptionSelect={(ev, data) =>
                onAssetOptionSelect(ev, data, item.id)
              }
            >
              {configs_permission_assets.map(value => {
                return (
                  <Option text={t(`${'enums.' + value}`)} value={value}>
                    {t(`${'enums.' + value}`)}
                  </Option>
                )
              })}
            </Dropdown>
          </TableCellLayout>
        )
      },
    }),
    createTableColumn<Permission>({
      columnId: 'operation',
      compare: (a, b) => {
        return a.operation?.localeCompare(b.asset)
      },
      renderHeaderCell: () => {
        return t('policies.operation')
      },
      renderCell: item => {
        return (
          <TableCellLayout
            className={mergeClasses(
              styles.FormControlsFullWidth,
              styles.tweakDropdown,
            )}
          >
            <Dropdown
              size="small"
              placeholder={t('policies.operation_select')}
              className={mergeClasses(
                styles.tweakCombo,
                styles.FormControlsFullWidth,
              )}
              value={item.operation ? t('enums.' + item.operation) : ''}
              onOptionSelect={(ev, data) =>
                onOperationOptionSelect(ev, data, item.id)
              }
            >
              {configs_permission_operation.map(value => {
                return (
                  <Option text={t(`${'enums.' + value}`)} value={value}>
                    {t(`${'enums.' + value}`)}
                  </Option>
                )
              })}
            </Dropdown>
          </TableCellLayout>
        )
      },
    }),
    createTableColumn<Permission>({
      columnId: 'resource',
      compare: (a, b) => {
        return a.resourceid[0] - b.resourceid[0]
      },
      renderHeaderCell: () => {
        return t('policies.resource')
      },
      renderCell: item => {
        return (
          <TableCellLayout>
            <div className={styles.Flex}>
              <RadioGroup
                layout="horizontal"
                value={item.resourceid[0] == -1 ? 'all' : 'restricted'}
                onChange={(ev, data) => onResourceChange(ev, data, item.id)}
              >
                <Radio
                  value="all"
                  label={t('general.all')}
                  className={styles.TextSmall}
                />
                <Radio
                  value="restricted"
                  label={t('general.restricted')}
                  className={styles.TextSmall}
                />
              </RadioGroup>
              {item.resourceid[0] > -1 && (
                <Button
                  size="small"
                  iconPosition="after"
                  className={mergeClasses(styles.SelfAlign)}
                  icon={<MoreHorizontalFilled />}
                  onClick={() =>
                    showResources(item.id, item.asset, item.resourceid)
                  }
                  disabled={item.asset === ''}
                >
                  {item.resourceid[0] > 0 && (
                    <CounterBadge
                      size="small"
                      appearance="filled"
                      color="brand"
                      count={item.resourceid.length}
                    />
                  )}
                </Button>
              )}
              <Button
                size="small"
                iconPosition="after"
                className={mergeClasses(
                  styles.SelfAlign,
                  styles.MarginLeftSmall,
                )}
                onClick={() => removePermission(item.id)}
                icon={<DeleteRegular />}
              ></Button>
            </div>
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
          ? newSelected.size === allLookup.length
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
      newSelection = [...selectedIds, ...lookupList.map(x => x.id)]
      setSelectedIds(new Set(newSelection))
    }
    setSelection(
      data.checked
        ? newSelection.length === allLookup.length
          ? true
          : 'mixed'
        : false,
    )
  }

  const lookupColumns: TableColumnDefinition<Lookup>[] = [
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
    createTableColumn<Lookup>({
      columnId: 'title',
      compare: (a, b) => {
        return a.title.localeCompare(b.title)
      },
      renderHeaderCell: () => {
        return t('general.title')
      },
      renderCell: item => {
        return <TableCellLayout>{item.title}</TableCellLayout>
      },
    }),
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    length?: number,
  ): void => {
    const { name, value } = e.target
    if (length && value.length <= length) {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    // Clear error when user starts typing
    /*if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    if (errors['submit']) {
      setErrors(prev => ({ ...prev, ['submit']: undefined }))
    }*/
  }

  const onSearchChange: (
    ev: SearchBoxChangeEvent,
    data: InputOnChangeData,
  ) => void = (_, data) => {
    setActivePage(1)
    setSearchText(data.value)
    let newLookupList = allLookup.filter(
      x =>
        !data.value || x.title.toLowerCase().includes(data.value.toLowerCase()),
    )
    setLookupCount(newLookupList.length)
    newLookupList = newLookupList.slice(0, PAGE_SIZE)
    setLookupList(newLookupList)
  }

  const onPermissionsSelected = () => {
    setSearchText('')
    setSelectedIds(new Set())
    setSelection(false)

    const selectedPermission = permissionList.find(p => p.id === selectedRowId)
    if (selectedPermission) {
      selectedPermission.resourceid.splice(
        0,
        selectedPermission.resourceid.length,
      )
      selectedIds.forEach(x => selectedPermission.resourceid.push(x))
    }

    setDialogOpen(false)
  }

  const removePermission = (id: number) => {
    clearError()
    SetPermissionList(permissionList.filter(item => item.id !== id))
  }

  const savePolicy = async (e: any) => {
    const policy = {
      id: isNew ? 0 : parseInt(id || '0'),
      name: formData.name,
      description: formData.description,
      permissions: permissionList,
    } as Policy

    e.preventDefault()
    const result = isNew
      ? await createPolicy(policy, accessToken)
      : await updatePolicy(policy, accessToken)
    if (result.success) {
      showMessage(
        `${t('policies.policy')} "${policy.name}" ${t('general.success_past')} ${isNew ? t('general.created') : t('general.updated')}`,
        '',
        'success',
        2000,
      )
      navToPage('/policies')
    } else {
      showMessage(t('policies.error_creation'), result.message, 'error', 5000)
      setError(result.message)
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber)
    let newLookupList = allLookup.filter(
      x =>
        !searchText || x.title.toLowerCase().includes(searchText.toLowerCase()),
    )
    setLookupCount(newLookupList.length)
    newLookupList = newLookupList.slice(
      (pageNumber - 1) * PAGE_SIZE,
      (pageNumber - 1) * PAGE_SIZE + PAGE_SIZE,
    )
    setLookupList(newLookupList)
  }

  return (
    <div className={styles.FullWidth}>
      <div className={styles.ColumnWrapper}>
        <div className={styles.FullWidth}>
          <Breadcrumbs current={isNew ? t('general.create') : formData.name} />
        </div>
        <div
          className={mergeClasses(
            styles.FullWidth,
            styles.MarginTopBase,
            styles.MarginLeftBase,
            styles.ScrollableContent,
          )}
        >
          <Title3>{isNew ? t('policies.create') : t('policies.edit')}</Title3>
          <div
            className={mergeClasses(
              styles.LayoutColumns,
              styles.MarginTopLarge,
            )}
          >
            <div className={styles.Column6}>
              <Card>
                <CardHeader
                  header={
                    <div className={styles.LayoutColumns}>
                      <div className={styles.FullWidth}>
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
                      </div>
                      <div
                        className={mergeClasses(
                          styles.Column6,
                          styles.AlignRight,
                        )}
                      ></div>
                    </div>
                  }
                />
                <CardPreview>
                  {!isLoading && (
                    <form method="POST">
                      <div>
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
                            {`${t('policies.description_name')}`}
                          </div>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={e => {
                              handleChange(e, 20)
                            }}
                            placeholder={t('policies.name_ph')}
                            required
                            className={mergeClasses(
                              styles.FormControlsFullWidth,
                              styles.MarginBottomSmall,
                            )}
                          />

                          <div className={styles.MarginTopBase}>
                            <Label
                              htmlFor="description"
                              className={styles.Label}
                            >
                              {t('general.description') + ' *'}
                            </Label>
                          </div>
                          <Input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={e => {
                              handleChange(e, 90)
                            }}
                            placeholder={t('policies.description_ph')}
                            required
                            className={mergeClasses(
                              styles.FormControlsFullWidth,
                              styles.MarginBottomSmall,
                            )}
                          />
                        </div>
                        <TabList selectedValue={'permissions'}>
                          <Tab id="Permissions" value="permissions">
                            {t('general.permissions')}
                          </Tab>
                        </TabList>
                        <div
                          className={mergeClasses(
                            styles.LayoutColumns,
                            styles.MarginBase,
                            styles.ColumnWrapper,
                          )}
                        >
                          {permissionList.length > 0 ? (
                            <div>
                              <DataGrid
                                items={permissionList}
                                columns={columns}
                                sortable
                                getRowId={item => item.id}
                                focusMode="composite"
                                size="extra-small"
                                columnSizingOptions={{
                                  resource: { idealWidth: 200 },
                                }}
                                resizableColumnsOptions={{
                                  autoFitColumns: true,
                                }}
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

                                <DataGridBody<Permission>>
                                  {({ item, rowId }) => (
                                    <DataGridRow<Permission> key={rowId}>
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
                              <span>{t('policies.no_permissions')}</span>
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
                              <Button onClick={addNewPermission}>
                                {t('policies.add_permission')}
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
                                  '/policies' +
                                    (id && parseInt(id) > 0 ? '/' + id : ''),
                                )}
                              >
                                {t('general.cancel')}
                              </Button>
                              <Button
                                type="submit"
                                appearance="primary"
                                className={styles.MarginLeftBase}
                                onClick={e => savePolicy(e)}
                                disabled={
                                  formData.name === '' ||
                                  formData.description === '' ||
                                  permissionList.length === 0 ||
                                  permissionList.some(
                                    x =>
                                      x.asset === '' ||
                                      x.operation === '' ||
                                      (x.resourceid.length === 1 &&
                                        x.resourceid[0] === 0),
                                  )
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
                </CardPreview>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={dialogOpen}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              {t('general.select_available') + ' ' + lookupResource}
            </DialogTitle>
            <DialogContent>
              {!isLoadingLookup && (
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
                      items={lookupList}
                      columns={lookupColumns}
                      sortable
                      getRowId={item => item.id}
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
                      <DataGridBody<Lookup>>
                        {({ item, rowId }) => (
                          <DataGridRow<Lookup> key={rowId}>
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
                      <Pagination
                        activePage={activePage}
                        itemsCountPerPage={PAGE_SIZE}
                        totalItemsCount={lookupCount}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                      />
                    </div>
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
                onClick={onPermissionsSelected}
                disabled={selectedIds.size === 0}
              >
                {t('general.done')}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  )
}

export default PolicyEdit
