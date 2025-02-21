import React, { lazy, Suspense } from 'react'
/*import { useNavigate } from 'react-router-dom'*/
import { Basic } from './Nav'
import { WithPanels } from './TabList'

import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from 'react-router-dom'

import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
} from '@fluentui/react-components'
import {
  Button,
  Image,
  makeStyles,
  tokens,
  typographyStyles,
} from '@fluentui/react-components'
import {
  Carousel,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
  CarouselNavContainer,
  CarouselViewport,
  CarouselAnnouncerFunction,
  CarouselSlider,
} from '@fluentui/react-components'
import { useEffect, useState } from 'react'

import { ToDo } from './types/todo'

const useClasses = makeStyles({
  bannerCard: {
    alignContent: 'center',
    borderRadius: tokens.borderRadiusLarge,
    height: '450px',
    textAlign: 'left',
    position: 'relative',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',

    position: 'absolute',
    left: '10%',
    top: '25%',
    background: tokens.colorNeutralBackground1,
    padding: '18px',
    maxWidth: '270px',
    width: '50%',
  },
  title: {
    ...typographyStyles.title1,
  },
  subtext: {
    ...typographyStyles.body1,
  },
})

const IMAGES = [
  'https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/sea-full-img.jpg',
  'https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/bridge-full-img.jpg',
  'https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/park-full-img.jpg',
  'https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/sea-full-img.jpg',
  'https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/bridge-full-img.jpg',
  'https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/park-full-img.jpg',
]

const BannerCard: React.FC<{
  children: React.ReactNode
  imageSrc: string
  index: number
}> = props => {
  const { children, imageSrc, index } = props
  const classes = useClasses()

  return (
    <CarouselCard
      className={classes.bannerCard}
      aria-label={`${index + 1} of ${IMAGES.length}`}
      id={`test-${index}`}
    >
      <Image fit="cover" src={imageSrc} role="presentation" />

      <div className={classes.cardContainer}>
        <div className={classes.title}>{children}</div>
        <div className={classes.subtext}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam.
        </div>
        <div>
          <Button size="small" shape="square" appearance="primary">
            Call to action
          </Button>
        </div>
      </div>
    </CarouselCard>
  )
}

const getAnnouncement: CarouselAnnouncerFunction = (
  index: number,
  totalSlides: number,
  slideGroupList: number[][],
) => {
  return `Carousel slide ${index + 1} of ${totalSlides}`
}

const MarkdownPreview = lazy(() => import('./ImageAvatar'))

/*const navigate = useNavigate()*/

export default function App() {
  const [data, setData] = useState<ToDo[]>([])

  useEffect(() => {
    fetch('http://localhost:3030/api/task')
      .then(response => response.json())
      .then((data: ToDo[]) => {
        setData(data)
      })
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  return (
    <Router>
      <nav>
        <ul>
          <li></li>
          <li>
            <NavLink
              to="/1"
              className={({ isActive }) => {
                return isActive ? 'active-link' : ''
              }}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about/1"
              className={({ isActive }) => {
                return isActive ? 'active-link' : ''
              }}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => {
                return isActive ? 'active-link' : ''
              }}
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/about/:id"
            element={
              <span>
                <h1 className="text-xl font-bold mb-2">API Data</h1>
                <ul className="list-disc pl-5">
                  {data.map((item, index) => (
                    <li key={index}>
                      {item.id} - {item.description}
                    </li>
                  ))}
                </ul>
              </span>
            }
          />
          <Route
            path="/contact"
            element={
              <span>
                <div className="p-4">
                  <WithPanels>
                    <Button name="Click me" appearance="primary">
                      Hello!
                    </Button>
                    <Basic />
                    <Carousel
                      groupSize={1}
                      circular
                      announcement={getAnnouncement}
                    >
                      <CarouselViewport>
                        <CarouselSlider>
                          {IMAGES.map((imageSrc, index) => (
                            <BannerCard
                              key={`image-${index}`}
                              imageSrc={imageSrc}
                              index={index}
                            >
                              Card {index + 1}
                            </BannerCard>
                          ))}
                        </CarouselSlider>
                      </CarouselViewport>
                      <CarouselNavContainer
                        layout="inline"
                        autoplayTooltip={{
                          content: 'Autoplay',
                          relationship: 'label',
                        }}
                        nextTooltip={{
                          content: 'Go to next',
                          relationship: 'label',
                        }}
                        prevTooltip={{
                          content: 'Go to prev',
                          relationship: 'label',
                        }}
                      >
                        <CarouselNav>
                          {index => (
                            <CarouselNavButton
                              aria-label={`Carousel Nav Button ${index}`}
                            />
                          )}
                        </CarouselNav>
                      </CarouselNavContainer>
                    </Carousel>
                  </WithPanels>

                  <Accordion>
                    <AccordionItem value="1">
                      <AccordionHeader inline>
                        Accordion Header 1
                      </AccordionHeader>
                      <AccordionPanel>
                        <div>Accordion Panel 1</div>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem value="2">
                      <AccordionHeader inline>
                        Accordion Header 2
                      </AccordionHeader>
                      <AccordionPanel>
                        <div>Accordion Panel 2</div>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem value="3">
                      <AccordionHeader inline>
                        Accordion Header 3
                      </AccordionHeader>
                      <AccordionPanel>
                        <div>Accordion Panel 3</div>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </div>
              </span>
            }
          />
          <Route path="/:id" element={<MarkdownPreview />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
