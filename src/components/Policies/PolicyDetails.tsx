import { Link, useNavigate, useParams } from 'react-router-dom'
import Structure from '../../styles/structure'
import {
  Avatar,
  Button,
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
  makeStyles,
  mergeClasses,
  SelectTabData,
  SelectTabEvent,
  Subtitle1,
  Tab,
  TableCellLayout,
  TableColumnDefinition,
  TabList,
  TabValue,
} from '@fluentui/react-components'
import { memo, useEffect, useState } from 'react'
import { t } from 'i18next'
import { deletePolicy, getPolicy } from '../../services/PolicyService'
import auth from '../../hooks/useAuth'
import Policy from '../../types/Policy'
import Breadcrumbs from '../Breadcrumbs'
import Format from '../../styles/format'
import Spacing from '../../styles/spacing'
import Permission from '../../types/Permission'
import { Edit16Filled } from '@fluentui/react-icons'
import DeleteButton from '../DeleteButton'
import { useMessage } from '../../context/MessageProvider'
import i18n from '../../i18n'
import Role from '../../types/Role'
import { getRolesByPolicy } from '../../services/RoleService'

const useStyles = makeStyles({
  ...Structure.Structure,
  ...Format.Format,
  ...Spacing.Spacing,
})

const PolicyDetails = () => {
  const { id } = useParams()
  const isNew = !parseInt(id || '0')
  const [policy, setPolicy] = useState({} as Policy)
  const [roles, setRoles] = useState([] as Role[])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<TabValue>('permissions')

  const navigate = useNavigate()
  const { showMessage } = useMessage()
  const styles = useStyles()

  const navToPage = (url: string) => {
    navigate(url)
  }

  const accessToken = auth().accessToken
  const userPermissions = auth().permissions

  useEffect(() => {
    const fetchData = async () => {
      if (!isNew) {
        const policy = await getPolicy(accessToken, id || '0')
        if (!policy.id) {
          navigate('/policies', { replace: true })
          return
        }
        setPolicy(policy)
        const roles = await getRolesByPolicy(Number(id) || 0, accessToken)
        setRoles(roles)
        setIsLoading(false)
      } else {
        navigate('/policies/edit/0', { replace: true })
      }
    }

    fetchData().catch(console.error)
  }, [])

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value)
  }

  const columns: TableColumnDefinition<Permission>[] = [
    createTableColumn<Permission>({
      columnId: 'asset',
      compare: (a, b) => {
        return a.asset.localeCompare(b.asset)
      },
      renderHeaderCell: () => {
        return t('policies.asset')
      },
      renderCell: item => {
        return <TableCellLayout>{t(`enums.${item.asset}`)}</TableCellLayout>
      },
    }),
    createTableColumn<Permission>({
      columnId: 'operation',
      compare: (a, b) => {
        return a.operation.localeCompare(b.operation)
      },
      renderHeaderCell: () => {
        return t('policies.permission')
      },
      renderCell: item => {
        return <TableCellLayout>{t(`enums.${item.operation}`)}</TableCellLayout>
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
        return item.resourceid[0] == -1
          ? '*'
          : item.resourceid.length +
              ' item' +
              (item.resourceid.length === 1 ? '' : 's')
      },
    }),
  ]

  const columns_roles: TableColumnDefinition<Role>[] = [
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
            <Link to={'/roles/' + item.id} className={styles.LinkPrimary}>
              {item.name}
            </Link>
          </TableCellLayout>
        )
      },
    }),
    createTableColumn<Role>({
      columnId: 'description',
      compare: (a, b) => {
        return a.description.localeCompare(b.description)
      },
      renderHeaderCell: () => {
        return t('general.description')
      },
      renderCell: item => {
        return <TableCellLayout>{item.description}</TableCellLayout>
      },
    }),
  ]

  const removePolicy = () => {
    deletePolicy(Number(id), accessToken).then(() => {
      showMessage(
        `${t('policies.policy')} "${policy.name}" ${t('policies.delete_success')}.`,
        '',
        'success',
      )
      navigate('/policies', { replace: true })
    })
  }

  const PermissionPanel = memo(() => (
    <div className={styles.MarginTopBase}>
      <DataGrid
        items={policy.permissions}
        columns={columns}
        sortable
        getRowId={item => item.id}
        focusMode="composite"
        style={{ minWidth: '400px' }}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>

        <DataGridBody<Permission>>
          {({ item, rowId }) => (
            <DataGridRow<Permission> key={rowId}>
              {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    </div>
  ))

  const RolesPanel = memo(() => (
    <div className={mergeClasses(styles.MarginTopBase, styles.FullWidth)}>
      <DataGrid
        items={roles}
        columns={columns_roles}
        sortable
        getRowId={item => item.id}
        focusMode="composite"
        resizableColumnsOptions={{
          autoFitColumns: true,
        }}
        resizableColumns={true}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
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
    </div>
  ))

  return (
    <div className={styles.ColumnWrapper}>
      <div className={styles.FullWidth}>
        <Breadcrumbs current={policy.name} />
      </div>
      <div className={styles.FullWidth}>
        <Card>
          <CardHeader
            header={
              <div className={styles.LayoutColumns}>
                <div className={styles.Column6}>
                  <div className={styles.Flex}>
                    <Subtitle1>{policy.name}</Subtitle1>
                  </div>
                  <div
                    className={mergeClasses(styles.FullWidth, styles.TextNote)}
                  >
                    <Caption1>{policy.description}</Caption1>
                  </div>
                </div>
                <div
                  className={mergeClasses(styles.Column6, styles.AlignRight)}
                >
                  {userPermissions.some(
                    x =>
                      x.includes('Policy:WRITE:-1') ||
                      x.includes('Policy:WRITE:' + id),
                  ) ? (
                    <>
                      <DeleteButton
                        props={{ action: policy.name }}
                        onDelete={removePolicy}
                      ></DeleteButton>
                      <Button
                        icon={<Edit16Filled />}
                        onClick={() => navToPage('/policies/edit/' + id)}
                        className={styles.MarginLeftBase}
                      >
                        {t('general.edit')}
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            }
            description={
              <div
                className={mergeClasses(
                  styles.LayoutColumns,
                  styles.MarginTopLarge,
                )}
              >
                <div className={styles.Column3}>
                  <div className={styles.FullWidth}>
                    <Caption1>{t('general.updatedby')}</Caption1>
                  </div>
                  <div className={styles.FullWidth}>
                    <div
                      className={mergeClasses(
                        styles.AlignSelfVerticalCenter,
                        styles.MarginTopBase,
                      )}
                    >
                      <Avatar
                        aria-label={policy.updatedby?.name}
                        name={policy.updatedby?.name}
                      />
                      <span className={styles.MarginLeftSmall}>
                        {policy.updatedby?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.Column6}>
                  <div className={styles.FullWidth}>
                    <Caption1>{t('general.updatedon')}</Caption1>
                  </div>
                  <div className={styles.FullWidth}>
                    <div
                      className={mergeClasses(
                        styles.AlignSelfVerticalCenter,
                        styles.MarginTopBase,
                      )}
                    >
                      <span className={styles.MarginLeftSmall}>
                        {policy.updatedon?.toLocaleString(i18n.language)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.Column3}></div>
              </div>
            }
          />
          <CardPreview>
            <div>
              <div
                className={mergeClasses(
                  styles.ColumnWrapper,
                  styles.MarginBase,
                )}
              >
                <div className={styles.Column3}>
                  {!isLoading && (
                    <>
                      <TabList
                        selectedValue={selectedTab}
                        onTabSelect={onTabSelect}
                      >
                        <Tab id="Permissions" value="permissions">
                          {t('general.permissions')}
                        </Tab>
                        <Tab id="Roles" value="roles">
                          {t('general.roles')}
                        </Tab>
                      </TabList>
                      {selectedTab === 'permissions' && <PermissionPanel />}
                      {selectedTab === 'roles' && <RolesPanel />}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardPreview>
        </Card>
      </div>
    </div>
  )
}

export default PolicyDetails
