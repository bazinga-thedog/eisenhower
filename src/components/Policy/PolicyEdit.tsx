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
import { InfoFilled } from '@fluentui/react-icons'
import { configs_permission_operation } from '../../configs/configs_permission_operation'

const useStyles = makeStyles({
  ...Structure.Structure,
  ...Format.Format,
  ...Spacing.Spacing,
  tweakIcon: { paddingTop: '5px' },
  tweakCombo: { minWidth: '0', '& input': { width: '100%' } },
})

const PolicyEdit = () => {
  const { id } = useParams()
  const isNew = !parseInt(id || '0')
  const [policy, setPolicy] = useState({} as Policy)
  const [isLoading, setIsLoading] = useState(true)
  const [permissionList, SetPermissionList] = useState([] as Permission[])

  const styles = useStyles()

  const accessToken = auth().accessToken

  const [formData, setFormData] = useState({} as Policy)

  useEffect(() => {
    const fetchData = async () => {
      if (!isNew) {
        const policy = await getPolicy(accessToken, id || '0')
        setPolicy(policy)
        setFormData(policy)
        SetPermissionList(policy.permissions)
      } else {
        policy.permissions = []
      }
      setIsLoading(false)
    }

    fetchData().catch(console.error)
  }, [])

  const addNewPermission = () => {
    permissionList.push({} as Permission)
    SetPermissionList([...permissionList])
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
              placeholder="Select an asset ###"
              className={styles.tweakCombo}
            >
              {configs_permission_assets.map(value => {
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
            <Combobox placeholder="Operation ###" className={styles.tweakCombo}>
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
        return a.resourceid - b.resourceid
      },
      renderHeaderCell: () => {
        return 'Resource###'
      },
      renderCell: item => {
        return (
          <TableCellLayout>
            <div>{'Content ad adas dasd'}</div>
          </TableCellLayout>
        )
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

  return (
    <div className={styles.FullWidth}>
      <div className={styles.ColumnWrapper}>
        <div className={styles.FullWidth}>
          <Breadcrumbs current={isNew ? 'create###' : policy.name} />
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
    </div>
  )
}

export default PolicyEdit
