import { useParams } from 'react-router-dom'
import Structure from '../../styles/structure'
import {
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  Combobox,
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
} from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { t } from 'i18next'
import { getPolicy } from '../../services/PolicyService'
import auth from '../../hooks/useAuth'
import { configs_permission_assets } from '../../configs/configs_permission_assets'
import Policy from '../../types/Policy'
import Breadcrumbs from '../Breadcrumbs'
import Format from '../../styles/format'
import Spacing from '../../styles/spacing'
import Permission from '../../types/Permission'
import { InfoFilled, MoreHorizontalFilled } from '@fluentui/react-icons'
import { configs_permission_operation } from '../../configs/configs_permission_operation'
import Lookup from '../../types/Lookup'
import { getLookup } from '../../services/LookupService'

const useStyles = makeStyles({
  ...Structure.Structure,
  ...Format.Format,
  ...Spacing.Spacing,
  tweakIcon: { paddingTop: '5px' },
  tweakCombo: { minWidth: '0', '& input': { width: '100%' } },
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
  const [selectedRowId, SetSelectedRowId] = useState(0)

  const styles = useStyles()

  const accessToken = auth().accessToken

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  } as Policy)

  useEffect(() => {
    const fetchData = async () => {
      if (!isNew) {
        const policy = await getPolicy(accessToken, id || '0')
        setFormData(policy)
        SetPermissionList(policy.permissions)
      } else {
        formData.permissions = []
      }
      setIsLoading(false)
    }

    fetchData().catch(console.error)
  }, [])

  const getLookupData = async (asset: string) => {
    allLookup = await getLookup(accessToken, asset)
    setLookupList(allLookup)
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
  }

  const showResources = (
    rowId: number,
    asset: string,
    permissions: number[],
  ) => {
    setIsLoadingLookup(true)
    setSelectedIds(new Set(permissions.filter(x => x !== 0)))
    SetSelectedRowId(rowId)
    setLookupResource(asset)
    getLookupData(asset).then(() => setDialogOpen(true))
  }

  const onAssetOptionSelect = (ev: any, data: any, id: number) => {
    SetPermissionList(
      permissionList.map(p =>
        p.id === id ? { ...p, asset: data.optionValue } : p,
      ),
    )
  }

  const onOperationOptionSelect = (ev: any, data: any, id: number) => {
    SetPermissionList(
      permissionList.map(p =>
        p.id === id ? { ...p, operation: data.optionValue } : p,
      ),
    )
  }

  const onResourceChange = (ev: any, data: any, id: number) => {
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
        return 'Asset###'
      },
      renderCell: item => {
        return (
          <TableCellLayout>
            <Combobox
              size="small"
              placeholder="Select an asset ###"
              className={styles.tweakCombo}
              clearable
              value={item.asset}
              onOptionSelect={(ev, data) =>
                onAssetOptionSelect(ev, data, item.id)
              }
            >
              {configs_permission_assets.map(value => {
                console.log()
                return <Option key={value}>{value}</Option>
              })}
            </Combobox>
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
        return 'Operation###'
      },
      renderCell: item => {
        return (
          <TableCellLayout>
            <Combobox
              size="small"
              placeholder="Select operation ###"
              className={styles.tweakCombo}
              value={item.operation}
              onOptionSelect={(ev, data) =>
                onOperationOptionSelect(ev, data, item.id)
              }
            >
              {configs_permission_operation.map(value => {
                return <Option key={value}>{value}</Option>
              })}
            </Combobox>
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
        return 'Resource###'
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
                <Radio value="all" label="All" className={styles.TextSmall} />
                <Radio
                  value="restricted"
                  label="Restricted"
                  className={styles.TextSmall}
                />
              </RadioGroup>
              {item.resourceid[0] > -1 && (
                <Button
                  size="small"
                  iconPosition="after"
                  className={styles.SelfAlign}
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
    if (!data.checked) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(lookupList.map(x => x.id)))
    }
    setSelection(
      data.checked
        ? lookupList.length === allLookup.length
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
        return 'Title###'
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
    setLookupList(
      allLookup.filter(x =>
        x.title.toLowerCase().includes(data.value.toLowerCase()),
      ),
    )
  }

  const onPermissionsSelected = () => {
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

  return (
    <div className={styles.FullWidth}>
      <div className={styles.ColumnWrapper}>
        <div className={styles.FullWidth}>
          <Breadcrumbs current={isNew ? 'create###' : formData.name} />
        </div>
        <div
          className={mergeClasses(
            styles.FullWidth,
            styles.MarginTopBase,
            styles.MarginLeftBase,
            styles.ScrollableContent,
          )}
        >
          <Title3>{isNew ? 'Create policy###' : 'Edit policy###'}</Title3>
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
                          <Subtitle1>Policies</Subtitle1>
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
                            content={'...todo_create_content'}
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
                          <Caption1>{'...todo_create_content'}</Caption1>
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
                    <div>
                      <Divider />
                      <div
                        className={mergeClasses(
                          styles.FullWidth,
                          styles.PaddingBase,
                        )}
                      >
                        <form>
                          <div>
                            <Label htmlFor="name" className={styles.Label}>
                              {'Name###' + ' *'}
                            </Label>
                          </div>
                          <div
                            className={mergeClasses(
                              styles.MarginBottomSmall,
                              styles.TextNote,
                              styles.TextSmall,
                            )}
                          >
                            Text description Lorem Ipsum###
                          </div>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={e => {
                              handleChange(e, 20)
                            }}
                            placeholder={'Insert policy name###'}
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
                              {'Description###' + ' *'}
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
                            placeholder={'Insert policy description###'}
                            required
                            className={mergeClasses(
                              styles.FormControlsFullWidth,
                              styles.MarginBottomSmall,
                            )}
                          />
                        </form>
                      </div>
                      <TabList selectedValue={'permissions'}>
                        <Tab id="Permissions" value="permissions">
                          Permissions ###
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
                            <span>
                              {"Policy doesn't have any permission###"}
                            </span>
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
                              Add new permission
                            </Button>
                          </div>
                          <div
                            className={mergeClasses(
                              styles.Column6,
                              styles.AlignRight,
                            )}
                          >
                            <Button appearance="primary">Save###</Button>
                          </div>
                        </div>
                      </div>
                    </div>
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
            <DialogTitle>{'Select available### ' + lookupResource}</DialogTitle>
            <DialogContent>
              {!isLoadingLookup && (
                <div>
                  <SearchBox
                    placeholder="Search###"
                    size="medium"
                    onChange={onSearchChange}
                  ></SearchBox>
                  <DataGrid
                    columnSizingOptions={{
                      selection: { idealWidth: 30 },
                    }}
                    items={lookupList}
                    columns={lookupColumns}
                    sortable
                    getRowId={item => item.id}
                    focusMode="composite"
                    size="extra-small"
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
                  Close###
                </Button>
              </DialogTrigger>
              <Button
                appearance="primary"
                onClick={onPermissionsSelected}
                disabled={selectedIds.size === 0}
              >
                Done###
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  )
}

export default PolicyEdit
