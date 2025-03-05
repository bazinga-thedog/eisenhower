import { configs_servicebus } from '../configs/configs_servicebus'
import Page, { PageServiceStructure } from '../types/Page'

const build = (
  pages: PageServiceStructure[],
  allPages: PageServiceStructure[],
  parent: number,
): Page[] => {
  let newPages: Page[] = []
  pages.forEach(p => {
    newPages.push({
      id: p.id,
      name: p.name,
      location: p.location,
      order: p.order,
      icon: p.icon,
      parent: parent,
      children: build(
        allPages.filter(x => x.parentid === p.id),
        allPages,
        p.id,
      ),
    } as Page)
  })
  return newPages
}

export const getAllPages = async (accessToken: string): Promise<Page[]> => {
  const response: Response = await fetch(
    configs_servicebus.HOST + '/api/pages',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      credentials: 'include',
    },
  )
  const pages: [PageServiceStructure] = await response.json()

  const pagesList: Page[] = build(
    pages.filter(x => !x.parentid),
    pages.filter(x => x.parentid),
    0,
  )
  return pagesList
}

const PageService = () => {}

export default PageService
