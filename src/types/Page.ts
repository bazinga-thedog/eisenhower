interface Page {
  id: number
  name: string
  location: string
  order: number
  icon: string
  parent: number
  children: Page[]
}

export interface PageStructure {
  id: number
  name: string
  location: string
  order: number
  icon: string
  parentid: number
}

export default Page
