import { createContext } from 'react'
import Page from '../types/Page'

export const PagesContext = createContext<Page[] | undefined>(undefined)
