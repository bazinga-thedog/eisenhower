import React from 'react'
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
} from '@fluentui/react-components'
import { Globe16Regular } from '@fluentui/react-icons'
import i18n from '../i18n/index'

// Language options with flags
const languages = [
  { code: 'en', name: 'English', flag: '\ud83c\uddfa\ud83c\uddf8' },
  { code: 'pt-PT', name: 'Português', flag: '\ud83c\uddfa\ud83c\uddf8' },
]

const LanguageSwitcher: React.FC = () => {
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    window.location.reload()
  }

  // Get current language
  const currentLang =
    languages.find(lang => lang.code === i18n.language) || languages[0]

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button icon={<Globe16Regular />} appearance="subtle">
          {currentLang.flag} {currentLang.name}
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {languages.map(lang => (
            <MenuItem key={lang.code} onClick={() => changeLanguage(lang.code)}>
              {lang.flag} {lang.name}
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

export default LanguageSwitcher
