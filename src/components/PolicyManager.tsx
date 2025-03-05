import {
  Avatar,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
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
import { PagesContext } from '../context/PagesContext'
import { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { t } from 'i18next'
import auth from '../hooks/useAuth'
import Structure from '../styles/structure'
import Page from '../types/Page'
import { getAllPolicies } from '../services/PolicyService'
import Spacing from '../styles/spacing'
import Format from '../styles/format'
import { InfoFilled } from '@fluentui/react-icons'
import Policy from '../types/Policy'

const useStyles = makeStyles({
  card: {
    margin: 'auto',
    width: '100%',
  },
  cardfull: {
    width: '100%',
  },
  searchbig: {
    width: '537px',
    maxWidth: '537px',
  },
  ...Spacing.Spacing,
  ...Structure.Structure,
  ...Format.Format,
  tweakIcon: { paddingTop: '5px' },
})

let breadcrumbItems: { name: string; location: string }[] = []

const createBreadcrumbs = (
  pages: Page[] | undefined,
  currentPage: Page | undefined,
) => {
  breadcrumbItems = []
  let parentid = currentPage?.parent

  while (parentid) {
    const parent = pages?.find(page => page.id === parentid)
    if (parent) {
      breadcrumbItems.push({ name: parent.name, location: parent.location })
      parentid = parent.parent
    } else {
      parentid = 0
    }
  }
}

let allPolicies: Policy[] = []

const PolicyManager = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [policies, setPolicies] = useState([] as Policy[])

  const location = useLocation()

  const pages = useContext(PagesContext)
  const currentPage = pages
    ?.map(x => x.children)[0]
    .filter(p => location.pathname.includes(p.location))[0]
  createBreadcrumbs(pages, currentPage)

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
        <Breadcrumb aria-label="Breadcrumb">
          {breadcrumbItems.map(item => {
            return (
              <>
                <BreadcrumbItem>
                  <BreadcrumbButton href={item.location}>
                    {item.name}
                  </BreadcrumbButton>
                </BreadcrumbItem>
                <BreadcrumbDivider />
              </>
            )
          })}

          <BreadcrumbItem>
            <BreadcrumbButton href={currentPage?.location} current>
              {currentPage?.name}
            </BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className={styles.FullWidth}>
        <Card className={styles.card}>
          <CardHeader
            header={
              <div className={styles.LayoutColumns}>
                <div className={styles.Column6}>
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
                    className={mergeClasses(styles.FullWidth, styles.TextNote)}
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
                      placeholder="Search"
                      size="medium"
                      className={styles.searchbig}
                      onChange={onSearchChange}
                    />
                  </div>
                </div>
                <div
                  className={mergeClasses(styles.Column6, styles.AlignRight)}
                >
                  <Button appearance="primary">{t('policies.create')}</Button>
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
