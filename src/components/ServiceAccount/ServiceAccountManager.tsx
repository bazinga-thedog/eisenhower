
import {
  Avatar,
  Button,
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  CheckboxOnChangeData,
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Subtitle1,
  TableCellLayout,
  TableColumnDefinition,
  TableSelectionCell,
  Tooltip,
  makeStyles,
  mergeClasses,
} from '@fluentui/react-components'

import {
  InfoFilled,
  MoreVerticalFilled,
  Delete16Regular
} from '@fluentui/react-icons'
import { useEffect, useState } from 'react'

import Structure from '../../styles/structure'
import Spacing from '../../styles/spacing'
import Format from '../../styles/format'
import PaginationStyle from '../../styles/pagination'

import Pagination from 'react-js-pagination'
import Breadcrumbs from '../Breadcrumbs'

import i18n from '../../i18n'
import { t } from 'i18next'

import { ServiceAccount } from '../../types/ServiceAccount'
      import { Link, useNavigate } from 'react-router-dom'
      import auth from '../../hooks/useAuth'
      import { getAllServiceAccounts } from '../../services/ServiceAccountService'
/*Imports*/

const useStyles = makeStyles({
  ...Spacing.Spacing,
  ...Structure.Structure,
  ...Format.Format,
  ...PaginationStyle.Pagination,
  tweakIcon: { paddingTop: '5px' },
  tweakCard: {
    '& > div' : {
      display: 'inline-block!important' }}
})



const ServiceAccountManager = () => {

  const [isLoading, setIsLoading] = useState(true)
  const [serviceaccounts, setServiceAccounts] = useState([] as ServiceAccount[])
      const [selection, setSelection] = useState(false as 'mixed' | boolean)
       const [selectedIds, setSelectedIds] = useState(new Set<number | string>())
       const [serviceaccountCount, setServiceAccountCount] = useState(0)
       const [activePage, setActivePage] = useState(1)
/*State*/

  const styles = useStyles()
      let allServiceAccounts: ServiceAccount[] = []
      const PAGE_SIZE = 10
      const userPermissions = auth().permissions
      const accessToken = auth().accessToken

      const navigate = useNavigate()

      const navToPage = (url: string) => {
        navigate(url)
      }


      const columns: TableColumnDefinition<ServiceAccount>[] = [
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
        createTableColumn<ServiceAccount>({
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
                <Link className={styles.LinkPrimary} to={'/serviceaccounts/' + item.id}>
                  {item.name}
                </Link>
              </TableCellLayout>
            )
          },
        }),
        createTableColumn<ServiceAccount>({
          columnId: 'updatedby',
          compare: (a, b) => {
            return (a.updatedby?.name || '').localeCompare(b.updatedby?.name || '')
          },
          renderHeaderCell: () => {
            return t('general.updatedby')
          },
          renderCell: item => {
            return (
              <TableCellLayout
                className={styles.TextSmall}
                media={
                  <Avatar
                    aria-label={item.updatedby?.name}
                    name={item.updatedby?.name}
                  />
                }
              >
                {item.updatedby?.name}
              </TableCellLayout>
            )
          },
        }),
        createTableColumn<ServiceAccount>({
          columnId: 'lastUpdated',
          compare: (a, b) => {
            return a.updatedon.getTime() - b.updatedon.getTime()
          },
          renderHeaderCell: () => {
            return t('general.updatedon')
          },

          renderCell: item => {
            return (
              <TableCellLayout className={styles.TextSmall}>
                {item.updatedon?.toLocaleString(i18n.language).replace(',', '')}
              </TableCellLayout>
            )
          },
        }),
      ]

      useEffect(() => {
        const fetchData = async () => {
          const serviceaccountList = await getAllServiceAccounts(accessToken)
          setServiceAccounts(serviceaccountList.slice(0, PAGE_SIZE))
          allServiceAccounts = serviceaccountList
          setServiceAccountCount(allServiceAccounts.length)
          setIsLoading(false)
        }

        fetchData().catch(console.error)
      }, [])

      const handlePageChange = (pageNumber: number) => {
        setActivePage(pageNumber)
        let newRoleList = allServiceAccounts /*.filter(
          x =>
            !searchText ||
            x.name.toLowerCase().includes(searchText.toLowerCase()) ||
            x.updatedby?.name.toLowerCase().includes(searchText.toLowerCase()),
        )*/
        setServiceAccountCount(newRoleList.length)
        newRoleList = newRoleList.slice(
          (pageNumber - 1) * PAGE_SIZE,
          (pageNumber - 1) * PAGE_SIZE + PAGE_SIZE,
        )
        setServiceAccounts(newRoleList)
      }

        
      const handleFullCheckChange = (data: CheckboxOnChangeData) => {
        let newSelection = []
        if (!data.checked) {
          setSelectedIds(new Set())
        } else {
          newSelection = [...selectedIds, ...serviceaccounts.map(x => x.id)]
          setSelectedIds(new Set(newSelection))
        }
        setSelection(
          data.checked
            ? newSelection.length === allServiceAccounts.length
              ? true
              : 'mixed'
            : false,
        )
      }
        
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
              ? newSelected.size === allServiceAccounts.length
                ? true
                : 'mixed'
              : false,
          )
          return newSelected
        })
      }
/*Methods*/

  return (
  <div className={mergeClasses(styles.ColumnWrapper, styles.LayoutColumns)}>
      <div className={styles.FullWidth}>
        <Breadcrumbs current="" />
      </div>
      <div className={mergeClasses(styles.Column6)}>
        <Card className={styles.CardFullHeight}>
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
                      <Subtitle1>{t('serviceaccounts.serviceaccount_plural')}</Subtitle1>
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
                        content={t('serviceaccounts.info_content')}
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
                      <Caption1>{t('serviceaccounts.description')}</Caption1>
                    </div>
{/*Heading*/}
                  </div>
                </div>
                <div
                  className={mergeClasses(styles.Column6, styles.AlignRight)}
                >
                  
    {userPermissions.some(x => x.includes('ServiceAccount:WRITE:-1')) ? (
        <>
          <Button
            appearance="primary"
            onClick={() => navToPage('/serviceaccounts/edit')}
          >
            {t('serviceaccounts.create')}
          </Button>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button
                className={styles.MarginLeftBase}
                icon={<MoreVerticalFilled />}
                appearance="subtle"
                size="small"
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem
                  icon={<Delete16Regular />}
                  disabled={selectedIds.size === 0}
                  /*onClick={openDialog}*/
                >
                  {t('general.delete')}
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </>
      ) : null}
{/*RightContent*/}
                </div>
              </div>
            }
          />
          <CardPreview className={mergeClasses(styles.ScrollableContent, styles.tweakCard)}>
          {!isLoading && (
              <div>
                {serviceaccounts.length > 0 ? (
                  <>
                    <DataGrid
                      items={serviceaccounts}
                      columns={columns}
                      sortable
                      getRowId={item => item.id}
                      focusMode="composite"
                      columnSizingOptions={{
                        selection: { idealWidth: 50 },
                        updatedon: { idealWidth: 100 },
                      }}
                      resizableColumnsOptions={{
                        autoFitColumns: false,
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

                      <DataGridBody<ServiceAccount>>
                        {({ item, rowId }) => (
                          <DataGridRow<ServiceAccount>
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
                    <div
                      className={mergeClasses(
                        styles.MarginTopBase,
                        styles.PaginationWrapper,
                      )}
                    >
                      {serviceaccountCount > PAGE_SIZE && (
                        <div className={styles.MarginBase}>
                          <Pagination
                            activePage={activePage}
                            itemsCountPerPage={PAGE_SIZE}
                            totalItemsCount={serviceaccountCount}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                          />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    className={mergeClasses(
                      styles.FullWidth,
                      styles.AlignCenter,
                      styles.TextNote,
                      styles.TextSmall,
                      styles.MarginBase,
                    )}
                  >
                    <span>
                      {t('serviceaccounts.not_found') +
                        (userPermissions.some(x => x.includes('ServiceAccount:WRITE:-1'))
                          ? `${t('serviceaccounts.create_start')}.`
                          : '')}
                    </span>
                  </div>
                )}
              </div>
            )}
{/*Body*/}
          </CardPreview>
        </Card>
      </div>
    </div>
  )
}

export default ServiceAccountManager

/*Definition*/