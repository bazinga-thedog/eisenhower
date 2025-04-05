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
  TableSelectionCell,
  SearchBox,
  SearchBoxChangeEvent,
  InputOnChangeData,
  CheckboxOnChangeData,
} from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { t } from 'i18next'
import auth from '../../hooks/useAuth'
import Policy from '../../types/Policy'
import Breadcrumbs from '../Breadcrumbs'
import Format from '../../styles/format'
import Spacing from '../../styles/spacing'
import PaginationStyle from '../../styles/pagination'
import { DeleteRegular, InfoFilled } from '@fluentui/react-icons'
import Pagination from 'react-js-pagination'
import Role from '../../types/Role'
import { createRole, getRole, updateRole } from '../../services/RoleService'
import { getAllPolicies } from '../../services/PolicyService'
import { useMessage } from '../../context/MessageProvider'

const useStyles = makeStyles({
  ...Structure.Structure,
  ...Format.Format,
  ...Spacing.Spacing,
  ...PaginationStyle.Pagination,
  tweakIcon: { paddingTop: '5px' },
})

let allPolicies: Policy[] = []

const RoleEdit = () => {
  const { id } = useParams()
  const isNew = !parseInt(id || '0')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingLookup, setIsLoadingPolicy] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [policyList, setPolicyList] = useState([] as Policy[])
  const [selectedIds, setSelectedIds] = useState(new Set<number | string>())
  const [selection, setSelection] = useState(false as 'mixed' | boolean)
  const [error, setError] = useState('')
  const [activePage, setActivePage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [lookupCount, setPolicyCount] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    policies: [] as Policy[],
  } as Role)

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
        const role = await getRole(accessToken, id || '0')
        if (!role.id) {
          navigate('/policies', { replace: true })
          return
        }
        setFormData(role)
      } else {
        formData.policies = []
      }
      allPolicies = await getAllPolicies(accessToken)
      setPolicyList(allPolicies.slice(0, PAGE_SIZE))
      setPolicyCount(allPolicies.length)
      setIsLoading(false)
    }

    fetchData().catch(console.error)
  }, [])

  const clearError = () => {
    setError('')
  }

  const removePolicy = (id: number) => {
    clearError()
    setFormData({
      name: formData.name,
      description: formData.description,
      policies: formData.policies.filter(item => item.id !== id),
    } as Role)
  }

  const addNewPolicy = () => {
    clearError()
    setSelectedIds(new Set(formData.policies.map(x => x.id)))
    setPolicyList(allPolicies)
    setActivePage(1)
    setIsLoadingPolicy(false)
    setDialogOpen(true)
  }

  const columns: TableColumnDefinition<Policy>[] = [
    createTableColumn<Policy>({
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
    createTableColumn<Policy>({
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
    createTableColumn<Policy>({
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
              onClick={() => removePolicy(item.id)}
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
      newSelection = [...selectedIds, ...policyList.map(x => x.id)]
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

  const policyColumns: TableColumnDefinition<Policy>[] = [
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
    let newLookupList = allPolicies.filter(
      x =>
        !data.value || x.name.toLowerCase().includes(data.value.toLowerCase()),
    )
    setPolicyCount(newLookupList.length)
    newLookupList = newLookupList.slice(0, PAGE_SIZE)
    setPolicyList(newLookupList)
  }

  const onPoliciesSelected = () => {
    formData.policies = allPolicies.filter(p => selectedIds.has(p.id))
    setSearchText('')
    setActivePage(1)
    setSelectedIds(new Set())
    setSelection(false)
    setDialogOpen(false)
  }

  /*const removePolicy = (id: number) => {
    clearError()
    role.policies = role.policies.filter(item => item.id !== id)
    SetRole(role)
  }*/

  const saveRole = async (e: any) => {
    const role = {
      id: isNew ? 0 : parseInt(id || '0'),
      name: formData.name,
      description: formData.description,
      policies: formData.policies,
    } as Role

    e.preventDefault()
    const result = isNew
      ? await createRole(role, accessToken)
      : await updateRole(role, accessToken)
    if (result.success) {
      showMessage(
        `${t('roles.role')} "${role.name}" ${t('general.success_past')} ${isNew ? t('general.created') : t('general.updated')}`,
        '',
        'success',
        2000,
      )
      navToPage('/roles')
    } else {
      showMessage(t('roles.error_creation'), result.message, 'error', 5000)
      setError(result.message)
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber)
    let newPolicyList = allPolicies.filter(
      x =>
        !searchText ||
        x.name.toLowerCase().includes(searchText.toLowerCase()) ||
        x.description.toLowerCase().includes(searchText.toLowerCase()),
    )
    setPolicyCount(newPolicyList.length)
    newPolicyList = newPolicyList.slice(
      (pageNumber - 1) * PAGE_SIZE,
      (pageNumber - 1) * PAGE_SIZE + PAGE_SIZE,
    )
    setPolicyList(newPolicyList)
  }

  return (
    <div className={mergeClasses(styles.ColumnWrapper, styles.FullWidth)}>
      <div className={styles.FullWidth}>
        <Breadcrumbs current={isNew ? t('general.create') : formData.name} />
      </div>
      <div
        className={mergeClasses(
          styles.FullWidth,
          styles.MarginTopBase,
          styles.MarginLeftBase,
        )}
      >
        <Title3>{isNew ? t('roles.create') : t('roles.edit')}</Title3>
      </div>
      <div className={mergeClasses(styles.Column6, styles.MarginTopBase)}>
        <Card className={styles.CardWithTitleFullHeight}>
          <CardHeader
            header={
              <div className={styles.LayoutColumns}>
                <div className={styles.FullWidth}>
                  <div className={styles.Flex}>
                    <Subtitle1>{t('roles.roles_plural')}</Subtitle1>
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
                    className={mergeClasses(styles.FullWidth, styles.TextNote)}
                  >
                    <Caption1>{t('roles.description')}</Caption1>
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
                        {`${t('roles.description_name')}`}
                      </div>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={e => {
                          handleChange(e, 20)
                        }}
                        placeholder={t('roles.name_ph')}
                        required
                        className={mergeClasses(
                          styles.FormControlsFullWidth,
                          styles.MarginBottomSmall,
                        )}
                      />

                      <div className={styles.MarginTopBase}>
                        <Label htmlFor="description" className={styles.Label}>
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
                        placeholder={t('roles.description_ph')}
                        required
                        className={mergeClasses(
                          styles.FormControlsFullWidth,
                          styles.MarginBottomSmall,
                        )}
                      />
                    </div>
                    <TabList selectedValue={'policies'}>
                      <Tab id="Policies" value="policies">
                        {t('general.policies')}
                      </Tab>
                    </TabList>
                    <div
                      className={mergeClasses(
                        styles.LayoutColumns,
                        styles.MarginBase,
                        styles.ColumnWrapper,
                      )}
                    >
                      {formData.policies.length > 0 ? (
                        <div className={styles.FullWidth}>
                          <DataGrid
                            items={formData.policies}
                            columns={columns}
                            sortable
                            getRowId={item => item.id}
                            focusMode="composite"
                            size="extra-small"
                            resizableColumnsOptions={{
                              autoFitColumns: true,
                            }}
                            resizableColumns={true}
                            columnSizingOptions={{
                              name: { idealWidth: 100 },
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
                          {/* <span>{t('roles.no_policies')}</span> */}
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
                          <Button onClick={addNewPolicy}>
                            {t('roles.add_policy')}
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
                              '/roles' +
                                (id && parseInt(id) > 0 ? '/' + id : ''),
                            )}
                          >
                            {t('general.cancel')}
                          </Button>
                          <Button
                            type="submit"
                            appearance="primary"
                            className={styles.MarginLeftBase}
                            onClick={e => saveRole(e)}
                            disabled={
                              formData.name === '' ||
                              formData.description === '' ||
                              formData.policies.length === 0
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
              {t('general.select_available') + ' ' + t('general.policies')}
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
                      items={policyList}
                      columns={policyColumns}
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
                    {lookupCount > PAGE_SIZE && (
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
                onClick={onPoliciesSelected}
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

export default RoleEdit
