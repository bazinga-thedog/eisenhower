import {
  Button,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  SearchBox,
  Subtitle1,
  Tooltip,
  makeStyles,
  mergeClasses,
} from '@fluentui/react-components'
import {
  ArrowReplyRegular,
  InfoFilled,
  ShareRegular,
} from '@fluentui/react-icons'
import Structure from '../styles/structure'
import { t } from 'i18next'
import Spacing from '../styles/spacing'
import Format from '../styles/format'

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
const Section = () => {
  const styles = useStyles()

  return (
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
              <div className={mergeClasses(styles.FullWidth, styles.TextNote)}>
                <Caption1>{t('policies.description')}</Caption1>
              </div>
              <div
                className={mergeClasses(styles.FullWidth, styles.MarginTopBase)}
              >
                <SearchBox
                  placeholder="Search"
                  size="medium"
                  className={styles.searchbig}
                />
              </div>
            </div>
            <div className={mergeClasses(styles.Column6, styles.AlignRight)}>
              <Button appearance="primary">Create policy</Button>
            </div>
          </div>
        }
      />
      <CardPreview>Test</CardPreview>

      <CardFooter>
        <Button icon={<ArrowReplyRegular fontSize={16} />}>Reply</Button>
        <Button icon={<ShareRegular fontSize={16} />}>Share</Button>
      </CardFooter>
    </Card>
  )
}

export default Section
