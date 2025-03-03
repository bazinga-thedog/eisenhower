import {
  Button,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  SearchBox,
  Subtitle1,
  makeStyles,
  mergeClasses,
  typographyStyles,
} from '@fluentui/react-components'
import { ArrowReplyRegular, ShareRegular } from '@fluentui/react-icons'
import Structure from '../styles/structure'

const useStyles = makeStyles({
  card: {
    margin: 'auto',
    width: '100%',
  },
  cardfull: {
    width: '100%',
  },
  h1: typographyStyles.subtitle1,
  ...Structure.Structure,
})
const Section = () => {
  const styles = useStyles()

  return (
    <Card className={styles.card}>
      <CardHeader
        header={
          <div className={styles.LayoutColumns}>
            <div className={styles.Column6}>
              <Subtitle1>Policies</Subtitle1>
            </div>
            <div className={mergeClasses(styles.Column6, styles.AlignRight)}>
              <Button appearance="primary">Create policy</Button>
            </div>
          </div>
        }
        description={
          <div className={styles.cardfull}>
            <div className={styles.cardfull}>
              <Caption1>
                Configure the necessary policies to assign to specific roles
              </Caption1>
              <div className={styles.cardfull}>
                <SearchBox placeholder="Search" />
              </div>
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
