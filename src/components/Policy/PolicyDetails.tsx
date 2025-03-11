import { useNavigate, useParams } from 'react-router-dom'
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
  TableCellLayout,
  TableColumnDefinition,
} from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { t } from 'i18next'
import { getPolicy } from '../../services/PolicyService'
import auth from '../../hooks/useAuth'
import Policy from '../../types/Policy'
import Breadcrumbs from '../Breadcrumbs'
import Format from '../../styles/format'
import Spacing from '../../styles/spacing'
import Permission from '../../types/Permission'
import { Edit16Filled } from '@fluentui/react-icons'

const useStyles = makeStyles({
  ...Structure.Structure,
  ...Format.Format,
  ...Spacing.Spacing,
})

const PolicyDetails = () => {
  const { id } = useParams()
  const isNew = !parseInt(id || '0')
  const [policy, setPolicy] = useState({} as Policy)
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  const navToPage = (url: string) => {
    navigate(url)
  }

  const styles = useStyles()

  const accessToken = auth().accessToken
  const userPermissions = auth().permissions

  useEffect(() => {
    const fetchData = async () => {
      if (!isNew) {
        const policy = await getPolicy(accessToken, id || '0')
        setPolicy(policy)
        setIsLoading(false)
      } else {
        navigate('/policies/edit/0', { replace: true })
      }
    }

    fetchData().catch(console.error)
  }, [])

  const columns: TableColumnDefinition<Permission>[] = [
    createTableColumn<Permission>({
      columnId: 'asset',
      compare: (a, b) => {
        return a.asset.localeCompare(b.asset)
      },
      renderHeaderCell: () => {
        return 'Asset###'
      },
      renderCell: item => {
        return <TableCellLayout>{item.asset}</TableCellLayout>
      },
    }),
    createTableColumn<Permission>({
      columnId: 'operation',
      compare: (a, b) => {
        return a.operation.localeCompare(b.operation)
      },
      renderHeaderCell: () => {
        return 'Permission###'
      },
      renderCell: item => {
        return <TableCellLayout>{item.operation}</TableCellLayout>
      },
    }),
    createTableColumn<Permission>({
      columnId: 'resource',
      compare: (a, b) => {
        return a.resourceid[0] - b.resourceid[0]
      },
      renderHeaderCell: () => {
        return 'Resource ###'
      },

      renderCell: item => {
        return item.resourceid[0] == -1 ? '*' : '...todo'
      },
    }),
  ]

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
                      x.includes('Permission:WRITE:-1') ||
                      x.includes('Permission:WRITE:' + id),
                  ) ? (
                    <Button
                      icon={<Edit16Filled />}
                      onClick={() => navToPage('/policies/edit/' + id)}
                    >
                      Edit###
                    </Button>
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
                    <Caption1>{t('policies.updatedby')}</Caption1>
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
                <div className={styles.Column3}>
                  <div className={styles.FullWidth}>
                    <Caption1>{t('policies.updatedon')}</Caption1>
                  </div>
                  <div className={styles.FullWidth}>
                    <div
                      className={mergeClasses(
                        styles.AlignSelfVerticalCenter,
                        styles.MarginTopBase,
                      )}
                    >
                      <span className={styles.MarginLeftSmall}>
                        {policy.updatedon?.toUTCString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.Column3}></div>
              </div>
            }
          />
          <CardPreview>
            <div
              className={mergeClasses(styles.LayoutColumns, styles.MarginBase)}
            >
              <div className={styles.Column3}>
                <div className={mergeClasses(styles.Flex)}>
                  {!isLoading && (
                    <DataGrid
                      items={policy.permissions}
                      columns={columns}
                      sortable
                      getRowId={item => item.id}
                      focusMode="composite"
                      style={{ minWidth: '550px' }}
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
