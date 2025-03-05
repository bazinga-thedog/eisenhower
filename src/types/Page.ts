interface Page {
  id: number
  name: string
  location: string
  order: number
  icon: string
  parent: number
  children: Page[]
}

export interface PageServiceStructure {
  id: number
  name: string
  location: string
  order: number
  icon: string
  parentid: number
}

export default Page
