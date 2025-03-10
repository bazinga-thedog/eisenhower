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
  InputOnChangeData,
  makeStyles,
  mergeClasses,
  SearchBox,
  SearchBoxChangeEvent,
  Subtitle1,
  TableCellLayout,
  TableColumnDefinition,
  Tooltip,
} from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { t } from 'i18next'
import auth from '../../hooks/useAuth'
import Structure from '../../styles/structure'
import { getAllPolicies } from '../../services/PolicyService'
import Spacing from '../../styles/spacing'
import Format from '../../styles/format'
import { InfoFilled } from '@fluentui/react-icons'
import Policy from '../../types/Policy'
import Breadcrumbs from '../Breadcrumbs'

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
  tweakIcon: { paddingTop: '5px' },
})

let allPolicies: Policy[] = []

const PolicyManager = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [policies, setPolicies] = useState([] as Policy[])
  const navigate = useNavigate()

  const navToPage = (url: string) => {
    navigate(url)
  }

  const accessToken = auth().accessToken

  useEffect(() => {
    const fetchData = async () => {
      const policies = await getAllPolicies(accessToken)
      setPolicies(policies)
      allPolicies = policies
      setIsLoading(false)
    }

    fetchData().catch(console.error)
  }, [])

  const onSearchChange: (
    ev: SearchBoxChangeEvent,
    data: InputOnChangeData,
  ) => void = (_, data) => {
    setPolicies(
      allPolicies.filter(
        x =>
          x.name.toLowerCase().includes(data.value.toLowerCase()) ||
          x.updatedby.name.toLowerCase().includes(data.value.toLowerCase()),
      ),
    )
  }

  const styles = useStyles()

  const columns: TableColumnDefinition<Policy>[] = [
    createTableColumn<Policy>({
      columnId: 'name',
      compare: (a, b) => {
        return a.name.localeCompare(b.name)
      },
      renderHeaderCell: () => {
        return 'Policy Name'
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
      columnId: 'updatedby',
      compare: (a, b) => {
        return a.updatedby.name.localeCompare(b.updatedby.name)
      },
      renderHeaderCell: () => {
        return 'Updated by'
      },
      renderCell: item => {
        return (
          <TableCellLayout
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
    createTableColumn<Policy>({
      columnId: 'lastUpdated',
      compare: (a, b) => {
        return a.updatedon.getTime() - b.updatedon.getTime()
      },
      renderHeaderCell: () => {
        return 'Last updated'
      },

      renderCell: item => {
        return item.updatedon?.toDateString()
      },
    }),
  ]

  return (
    <div className={styles.ColumnWrapper}>
      <div className={styles.FullWidth}>
        <Breadcrumbs current="" />
      </div>
      <div className={styles.FullWidth}>
        <Card className={styles.card}>
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
                    <div
                      className={mergeClasses(
                        styles.FullWidth,
                        styles.MarginTopBase,
                      )}
                    >
                      <SearchBox
                        placeholder="Search###"
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
                  <Button
                    appearance="primary"
                    onClick={() => navToPage('/policies/edit')}
                  >
                    {t('policies.create')}
                  </Button>
                </div>
              </div>
            }
          />

          <CardPreview>
            {!isLoading && (
              <DataGrid
                items={policies}
                columns={columns}
                sortable
                selectionMode="multiselect"
                getRowId={item => item.id}
                focusMode="composite"
                style={{ minWidth: '550px' }}
              >
                <DataGridHeader>
                  <DataGridRow
                    selectionCell={{
                      checkboxIndicator: { 'aria-label': 'Select all rows' },
                    }}
                  >
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
                      selectionCell={{
                        checkboxIndicator: { 'aria-label': 'Select row' },
                      }}
                    >
                      {({ renderCell }) => (
                        <DataGridCell>{renderCell(item)}</DataGridCell>
                      )}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>
            )}
          </CardPreview>
        </Card>
      </div>
    </div>
  )
}

export default PolicyManager
