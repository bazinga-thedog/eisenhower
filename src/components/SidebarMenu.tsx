import * as React from 'react'
import {
  AppItem,
  NavCategory,
  NavCategoryItem,
  NavDivider,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
} from '@fluentui/react-nav-preview'

import { makeStyles, tokens } from '@fluentui/react-components'
import {
  Board20Filled,
  Board20Regular,
  BoxMultiple20Filled,
  BoxMultiple20Regular,
  DataArea20Filled,
  DataArea20Regular,
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular,
  HeartPulse20Filled,
  HeartPulse20Regular,
  MegaphoneLoud20Filled,
  MegaphoneLoud20Regular,
  NotePin20Filled,
  NotePin20Regular,
  People20Filled,
  People20Regular,
  PeopleStar20Filled,
  PeopleStar20Regular,
  Person20Filled,
  PersonLightbulb20Filled,
  PersonLightbulb20Regular,
  Person20Regular,
  PersonSearch20Filled,
  PersonSearch20Regular,
  PreviewLink20Filled,
  PreviewLink20Regular,
  bundleIcon,
  PersonCircle32Regular,
} from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: {
    overflow: 'hidden',
    display: 'flex',
    height: 'calc(100vh - 112px)',
  },
  content: {
    flex: '1',
    padding: '16px',
    display: 'grid',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  field: {
    display: 'flex',
    marginTop: '4px',
    marginLeft: '8px',
    flexDirection: 'column',
    gridRowGap: tokens.spacingVerticalS,
  },
})

const Person = bundleIcon(Person20Filled, Person20Regular)
const Dashboard = bundleIcon(Board20Filled, Board20Regular)
const Announcements = bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular)
const EmployeeSpotlight = bundleIcon(
  PersonLightbulb20Filled,
  PersonLightbulb20Regular,
)
const Search = bundleIcon(PersonSearch20Filled, PersonSearch20Regular)
const PerformanceReviews = bundleIcon(PreviewLink20Filled, PreviewLink20Regular)
const JobPostings = bundleIcon(NotePin20Filled, NotePin20Regular)
const Interviews = bundleIcon(People20Filled, People20Regular)
const HealthPlans = bundleIcon(HeartPulse20Filled, HeartPulse20Regular)
const TrainingPrograms = bundleIcon(BoxMultiple20Filled, BoxMultiple20Regular)
const CareerDevelopment = bundleIcon(PeopleStar20Filled, PeopleStar20Regular)
const Analytics = bundleIcon(DataArea20Filled, DataArea20Regular)
const Reports = bundleIcon(
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular,
)

const SidebarMenu = (props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined
  showSidebar: boolean
}) => {
  const styles = useStyles()

  const linkDestination = ''

  return (
    <div className={styles.root}>
      <NavDrawer
        defaultSelectedValue="2"
        defaultSelectedCategoryValue=""
        open={props.showSidebar}
        type="inline"
      >
        <NavDrawerHeader></NavDrawerHeader>

        <NavDrawerBody>
          <AppItem
            icon={<PersonCircle32Regular />}
            as="a"
            href={linkDestination}
          >
            Contoso HR
          </AppItem>
          <NavItem href={linkDestination} icon={<Dashboard />} value="1">
            Dashboard
          </NavItem>
          <NavItem href={linkDestination} icon={<Announcements />} value="2">
            Announcements
          </NavItem>
          <NavItem
            href={linkDestination}
            icon={<EmployeeSpotlight />}
            value="3"
          >
            Employee Spotlight
          </NavItem>
          <NavItem icon={<Search />} href={linkDestination} value="4">
            Profile Search
          </NavItem>
          <NavItem
            icon={<PerformanceReviews />}
            href={linkDestination}
            value="5"
          >
            Performance Reviews
          </NavItem>
          <NavSectionHeader>Employee Management</NavSectionHeader>
          <NavCategory value="6">
            <NavCategoryItem icon={<JobPostings />}>
              Job Postings
            </NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem href={linkDestination} value="7">
                Openings
              </NavSubItem>
              <NavSubItem href={linkDestination} value="8">
                Submissions
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
          <NavItem icon={<Interviews />} value="9">
            Interviews
          </NavItem>

          <NavSectionHeader>Benefits</NavSectionHeader>
          <NavItem icon={<HealthPlans />} value="10">
            Health Plans
          </NavItem>
          <NavCategory value="11">
            <NavCategoryItem icon={<Person />} value="12">
              Retirement
            </NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem href={linkDestination} value="13">
                Plan Information
              </NavSubItem>
              <NavSubItem href={linkDestination} value="14">
                Fund Performance
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>

          <NavSectionHeader>Learning</NavSectionHeader>
          <NavItem icon={<TrainingPrograms />} value="15">
            Training Programs
          </NavItem>
          <NavCategory value="16">
            <NavCategoryItem icon={<CareerDevelopment />}>
              Career Development
            </NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem href={linkDestination} value="17">
                Career Paths
              </NavSubItem>
              <NavSubItem href={linkDestination} value="18">
                Planning
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
          <NavDivider />
          <NavItem target="_blank" icon={<Analytics />} value="19">
            Workforce Data
          </NavItem>
          <NavItem href={linkDestination} icon={<Reports />} value="20">
            Reports
          </NavItem>
        </NavDrawerBody>
      </NavDrawer>
      <div className={styles.content}>{props.children}</div>
    </div>
  )
}
export default SidebarMenu
