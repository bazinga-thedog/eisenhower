
import {
  //Avatar,
  Button,
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  //CheckboxOnChangeData,
  //createTableColumn,
  //DataGrid,
  //DataGridBody,
  //DataGridCell,
  //DataGridHeader,
  //DataGridHeaderCell,
  //DataGridRow,
  Divider,
  Input,
  Label,
  //Menu,
  //MenuTrigger,
  //MenuPopover,
  //MenuList,
  //MenuItem,
  Subtitle1,
  Title3,
  //TableCellLayout,
  //TableColumnDefinition,
  //TableSelectionCell,
  Tooltip,
  makeStyles,
  mergeClasses,
} from '@fluentui/react-components'

 import {
   InfoFilled,
//   MoreVerticalFilled,
//   Delete16Regular
 } from '@fluentui/react-icons'
 import {  useState, useEffect } from 'react'

import Structure from '../../styles/structure'
import Spacing from '../../styles/spacing'
import Format from '../../styles/format'
import PaginationStyle from '../../styles/pagination'

//import Pagination from 'react-js-pagination'
import Breadcrumbs from '../Breadcrumbs'

// import i18n from '../../i18n'
 import { t } from 'i18next'
import { ServiceAccount } from '../../types/ServiceAccount'
import { useParams, useNavigate } from 'react-router-dom'
import { useMessage } from '../../context/MessageProvider'
import { createServiceAccount, updateServiceAccount, getServiceAccount } from '../../services/ServiceAccountService'
import { DatePicker, DatePickerProps } from "@fluentui/react-datepicker-compat";
import auth from '../../hooks/useAuth'
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

const ServiceAccountEdit = () => {
    const { id } = useParams()
    const isNew = !parseInt(id || '0')
    console.log(id, isNew)
  //const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({} as ServiceAccount)
      const [isLoading, setIsLoading] = useState(true)
      const [error, setError] = useState('')
/*State*/

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
            const serviceaccount = await getServiceAccount(accessToken, id || '0')
            if (!serviceaccount.id) {
              navigate('/serviceaccounts', { replace: true })
              return
            }
            setFormData(serviceaccount as ServiceAccount)
          } else {
            //
          }
          setIsLoading(false)
        }

        fetchData().catch(console.error)
      }, [])
      
const saveServiceAccount = async (e : any) => {
        e.preventDefault()
        const result = isNew
          ? await createServiceAccount(formData, accessToken)
          : await updateServiceAccount(formData, accessToken)
        if (result.success) {
          setFormData({} as ServiceAccount)
          //if (isNew) {
          //  setPassword(result.message)
          //  setIsPasswordShown(true)
          //} else {
            showMessage(
              `${t('serviceaccounts.serviceaccount')} "${formData.name}" ${t('general.success_past')} ${t('general.updated')}`,
              '',
              'success',
              2000,
            )
            navToPage('/ServiceAccounts')
          //}
        } else {
          showMessage(t('serviceaccounts.error_creation'), result.message, 'error', 5000)
          setError(result.message)
        }
      }
const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        length?: number,
      ): void => {
        const { name, value } = e.target
        if (length && value.length <= length) {
          setFormData(prev => ({ ...prev, [name]: value }))
        }
      }
const handleDateChange: DatePickerProps["onSelectDate"] = (date) => {
        setFormData(prev => ({ ...prev, ['expireson']: date }))
      };
/*Methods*/

  return (
  <div className={mergeClasses(styles.ColumnWrapper, styles.LayoutColumns)}>
      <div className={styles.FullWidth}>
        <Breadcrumbs
          current={isNew ? t('general.create') : formData.name}
        />
      </div>
      <div
        className={mergeClasses(
          styles.FullWidth,
          styles.MarginTopBase,
          styles.MarginLeftBase,
        )}
      >
        <Title3>{isNew ? t('users.create') : t('users.edit')}</Title3>
      </div>
      <div className={mergeClasses(styles.Column6)}>
        <Card className={styles.CardWithTitleFullHeight}>
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
                  {/*RightContent*/}
                </div>
              </div>
            }
          />
          <CardPreview className={mergeClasses(styles.tweakCard)}>
          
    {!isLoading && (
          <form method="POST">
            <div
              className={mergeClasses(
                styles.PaddingBottomBase,
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
          <Label htmlFor="name" className={styles.Label} required>
            {t('serviceaccounts.name')}
          </Label>
        </div>
        <div
          className={mergeClasses(
            styles.MarginBottomSmall,
            styles.TextNote,
            styles.TextSmall,
          )}
        >
          {`${t('serviceaccounts.description_name')}`}
        </div>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          maxLength={30}
          onChange={e => {
            handleChange(e, 30)
          }}
          placeholder={t('serviceaccounts.name_ph')}
          required
          className={mergeClasses(
            styles.FormControlsFullWidth,
            styles.MarginBottomSmall,
          )}
        />
      </div>
<div
        className={mergeClasses(
          styles.FullWidth,
          styles.PaddingBase,
        )}
      >
        <div>
          <Label htmlFor="client_id" className={styles.Label} required>
            {t('serviceaccounts.client_id')}
          </Label>
        </div>
        <div
          className={mergeClasses(
            styles.MarginBottomSmall,
            styles.TextNote,
            styles.TextSmall,
          )}
        >
          {`${t('serviceaccounts.description_client_id')}`}
        </div>
        <Input
          type="text"
          id="client_id"
          name="client_id"
          value={formData.client_id}
          maxLength={30}
          onChange={e => {
            handleChange(e, 30)
          }}
          placeholder={t('serviceaccounts.client_id_ph')}
          required
          className={mergeClasses(
            styles.FormControlsFullWidth,
            styles.MarginBottomSmall,
          )}
        />
      </div>
<div
        className={mergeClasses(
          styles.FullWidth,
          styles.PaddingBase,
        )}
      >
        <div>
          <Label htmlFor="expireson" className={styles.Label} required>
            {t('serviceaccounts.expireson')}
          </Label>
        </div>
        <div
          className={mergeClasses(
            styles.MarginBottomSmall,
            styles.TextNote,
            styles.TextSmall,
          )}
        >
          {`${t('serviceaccounts.description_expireson')}`}
        </div>
        <DatePicker 
          id="expireson"
          name="expireson"
          value={formData.expireson} 
          onSelectDate={handleDateChange} 
          placeholder={t('serviceaccount_expireson.expireson_ph')}
          allowTextInput
          required
        />
      </div>
{/*Fields*/}
              <div className={mergeClasses(
                        styles.LayoutColumns,
                        styles.MarginBase,
                        styles.ColumnWrapper,
                      )}
                    >
                <div className={styles.FullWidth}>                      
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
                <div
                  className={mergeClasses(
                    styles.MarginTopBase,
                    styles.ColumnWrapper,
                    styles.FullWidth,
                  )}
                >
                  <div className={styles.Column6}>
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
                        '/serviceaccounts' +
                          (id && parseInt(id) > 0 ? '/' + id : ''),
                      )}
                    >
                      {t('general.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      appearance="primary"
                      className={styles.MarginLeftBase}
                      onClick={e => saveServiceAccount(e)}
                      disabled={
                      formData.name === "" || formData.client_id === "" || formData.expireson === null}
                    >
                      {t('general.save')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
    
{/*Body*/}
          </CardPreview>
        </Card>
      </div>
    </div>
  )
}

export default ServiceAccountEdit

/*Definition*/