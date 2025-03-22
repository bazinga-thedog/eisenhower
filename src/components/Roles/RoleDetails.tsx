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
  Subtitle1,
  Tab,
  TableCellLayout,
  TableColumnDefinition,
  TabList,
} from '@fluentui/react-components'
import { useEffect, useState } from 'react'
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
import Role from '../../types/Role'
import { deleteRole, getRole } from '../../services/RoleService'
import Policy from '../../types/Policy'

const useStyles = makeStyles({
  ...Structure.Structure,
  ...Format.Format,
  ...Spacing.Spacing,
})

const RoleDetails = () => {
  const { id } = useParams()
  const isNew = !parseInt(id || '0')
  const [role, setRole] = useState({} as Role)
  const [isLoading, setIsLoading] = useState(true)

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
        const role = await getRole(accessToken, id || '0')
        if (!role.id) {
          navigate('/roles', { replace: true })
          return
        }
        setRole(role)
        setIsLoading(false)
      } else {
        navigate('/roles/edit/0', { replace: true })
      }
    }

    fetchData().catch(console.error)
  }, [])

  const columns: TableColumnDefinition<Policy>[] = [
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
    // createTableColumn<Permission>({
    //   columnId: 'resource',
    //   compare: (a, b) => {
    //     return a.resourceid[0] - b.resourceid[0]
    //   },
    //   renderHeaderCell: () => {
    //     return t('policies.resource')
    //   },

    //   renderCell: item => {
    //     return item.resourceid[0] == -1
    //       ? '*'
    //       : item.resourceid.length +
    //           ' item' +
    //           (item.resourceid.length === 1 ? '' : 's')
    //   },
    // }),
  ]

  const removeRole = () => {
    deleteRole(Number(id), accessToken).then(() => {
      showMessage(
        `${t('roles.role')} "${role.name}" ${t('roles.delete_success')}.`,
        '',
        'success',
      )
      navigate('/roles', { replace: true })
    })
  }

  return (
    <div className={mergeClasses(styles.ColumnWrapper, styles.FullWidth)}>
      <div className={styles.FullWidth}>
        <Breadcrumbs current={role.name} />
      </div>
      <div className={mergeClasses(styles.Column6, styles.MarginTopBase)}>
        <Card>
          <CardHeader
            header={
              <div className={styles.LayoutColumns}>
                <div className={styles.Column6}>
                  <div className={styles.Flex}>
                    <Subtitle1>{role.name}</Subtitle1>
                  </div>
                  <div
                    className={mergeClasses(styles.FullWidth, styles.TextNote)}
                  >
                    <Caption1>{role.description}</Caption1>
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
                        props={{ action: role.name }}
                        onDelete={removeRole}
                      ></DeleteButton>
                      <Button
                        icon={<Edit16Filled />}
                        onClick={() => navToPage('/roles/edit/' + id)}
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
                        aria-label={role.updatedby?.name}
                        name={role.updatedby?.name}
                      />
                      <span className={styles.MarginLeftSmall}>
                        {role.updatedby?.name}
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
                        {role.updatedon?.toLocaleString(i18n.language)}
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
              <TabList selectedValue={'policies'}>
                <Tab id="Policies" value="policies">
                  {t('policies.policy_plural')}
                </Tab>
              </TabList>
              {!isLoading && (
                <div className={mergeClasses(styles.MarginBase)}>
                  <DataGrid
                    items={role.policies}
                    columns={columns}
                    sortable
                    getRowId={item => item.id}
                    focusMode="composite"
                    columnSizingOptions={{
                      name: { idealWidth: 150 },
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
                            <DataGridCell>{renderCell(item)}</DataGridCell>
                          )}
                        </DataGridRow>
                      )}
                    </DataGridBody>
                  </DataGrid>
                </div>
              )}
            </div>
          </CardPreview>
        </Card>
      </div>
    </div>
  )
}

export default RoleDetails
