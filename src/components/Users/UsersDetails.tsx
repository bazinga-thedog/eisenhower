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
import auth from '../../hooks/useAuth'
import Breadcrumbs from '../Breadcrumbs'
import Format from '../../styles/format'
import Spacing from '../../styles/spacing'
import Permission from '../../types/Permission'
import { Edit16Filled } from '@fluentui/react-icons'
import DeleteButton from '../DeleteButton'
import { useMessage } from '../../context/MessageProvider'
import i18n from '../../i18n'
import { getRolesByUser } from '../../services/RoleService'
import { User } from '../../types/User'
import { deleteUser, getUser } from '../../services/UsersService'
import Role from '../../types/Role'
import { getPermissionsByUser } from '../../services/PermissionService'

const useStyles = makeStyles({
  ...Structure.Structure,
  ...Format.Format,
  ...Spacing.Spacing,
})

const UsersDetails = () => {
  const { id } = useParams()
  const isNew = !parseInt(id || '0')
  const [user, setUser] = useState({} as User)
  const [roles, setRoles] = useState([] as Role[])
  const [permissions, setPermissions] = useState([] as Permission[])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<TabValue>('roles')

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
        const edit_user = await getUser(accessToken, id || '0')
        if (!edit_user.id) {
          navigate('/roles', { replace: true })
          return
        }
        setUser(edit_user)
        const roles = await getRolesByUser(accessToken, Number(id) || 0)
        setRoles(roles)
        const permissions = await getPermissionsByUser(accessToken, id || '0')
        setPermissions(permissions)
        setIsLoading(false)
      } else {
        navigate('/users/edit/0', { replace: true })
      }
    }

    fetchData().catch(console.error)
  }, [])

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
            <Link className={styles.LinkPrimary} to={'/roles/' + item.id}>
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

  const columns_permissions: TableColumnDefinition<Permission>[] = [
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

  const removeUser = () => {
    deleteUser(Number(id), accessToken).then(() => {
      showMessage(
        `${t('users.user')} "${user.name}" ${t('users.delete_success')}.`,
        '',
        'success',
      )
      navigate('/users', { replace: true })
    })
  }

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value)
  }

  const PermissionPanel = memo(() => (
    <div className={styles.MarginBase}>
      <DataGrid
        items={permissions}
        columns={columns_permissions}
        sortable
        getRowId={item => item.id}
        focusMode="composite"
        resizableColumnsOptions={{
          autoFitColumns: false,
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
    <div className={mergeClasses(styles.MarginBase)}>
      <DataGrid
        items={roles}
        columns={columns_roles}
        sortable
        getRowId={item => item.id}
        focusMode="composite"
        resizableColumnsOptions={{
          autoFitColumns: false,
        }}
        resizableColumns={true}
        columnSizingOptions={{
          name: { idealWidth: 150 },
          description: { minWidth: 300 },
        }}
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

  return (
    <div className={mergeClasses(styles.ColumnWrapper, styles.LayoutColumns)}>
      <div className={styles.FullWidth}>
        <Breadcrumbs current={user.name} />
      </div>
      <div className={mergeClasses(styles.Column6, styles.MarginTopBase)}>
        <Card>
          <CardHeader
            header={
              <div className={styles.LayoutColumns}>
                <div className={styles.Column6}>
                  <div className={styles.Flex}>
                    <Subtitle1>{user.name}</Subtitle1>
                  </div>
                  <div
                    className={mergeClasses(styles.FullWidth, styles.TextNote)}
                  >
                    <Caption1></Caption1>
                  </div>
                </div>
                <div
                  className={mergeClasses(styles.Column6, styles.AlignRight)}
                >
                  {userPermissions.some(
                    x =>
                      x.includes('Policy:WRITE:-1') ||
                      x.includes('User:WRITE:' + id),
                  ) ? (
                    <>
                      <DeleteButton
                        props={{ action: user.name }}
                        onDelete={removeUser}
                      ></DeleteButton>
                      <Button
                        icon={<Edit16Filled />}
                        onClick={() => navToPage('/users/edit/' + id)}
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
                  styles.ColumnWrapper,
                  styles.MarginTopLarge,
                )}
              >
                <div className={styles.Column4}>
                  <div className={styles.FullWidth}>
                    <Caption1>{t('general.username')}</Caption1>
                  </div>
                  <div className={styles.FullWidth}>
                    <div
                      className={mergeClasses(
                        styles.AlignSelfVerticalCenter,
                        styles.MarginTopBase,
                      )}
                    >
                      <span className={styles.MarginLeftSmall}>
                        {user.username}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.Column4}>
                  <div className={styles.FullWidth}>
                    <Caption1>{t('general.email')}</Caption1>
                  </div>
                  <div className={styles.FullWidth}>
                    <div
                      className={mergeClasses(
                        styles.AlignSelfVerticalCenter,
                        styles.MarginTopBase,
                      )}
                    >
                      <span className={styles.MarginLeftSmall}>
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.Column4}>
                  <div className={styles.FullWidth}>
                    <Caption1>{t('general.createdon')}</Caption1>
                  </div>
                  <div className={styles.FullWidth}>
                    <div
                      className={mergeClasses(
                        styles.AlignSelfVerticalCenter,
                        styles.MarginTopBase,
                      )}
                    >
                      <span className={styles.MarginLeftSmall}>
                        {user.createdon?.toLocaleString(i18n.language)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.Column4}>
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
                        aria-label={user.updatedby?.name}
                        name={user.updatedby?.name}
                      />
                      <span className={styles.MarginLeftSmall}>
                        {user.updatedby?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.Column4}>
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
                        {user.updatedon?.toLocaleString(i18n.language)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          <CardPreview>
            <div>
              {!isLoading && (
                <>
                  <TabList
                    selectedValue={selectedTab}
                    onTabSelect={onTabSelect}
                  >
                    <Tab id="Roles" value="roles">
                      {t('roles.role_plural')}
                    </Tab>
                    <Tab id="Permissions" value="permissions">
                      {t('general.permissions')}
                    </Tab>
                  </TabList>
                  {selectedTab === 'permissions' && <PermissionPanel />}
                  {selectedTab === 'roles' && <RolesPanel />}
                </>
              )}
            </div>
          </CardPreview>
        </Card>
      </div>
    </div>
  )
}

export default UsersDetails
