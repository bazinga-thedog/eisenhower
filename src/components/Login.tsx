import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  Input,
  Label,
  makeStyles,
  mergeClasses,
  Title2,
} from '@fluentui/react-components'

import Auth from '../types/Auth'
import { authenticate } from '../services/AuthService'
import useAuth from '../hooks/useAuth'

import { t } from 'i18next'
import Structure from '../styles/structure'
import Spacing from '../styles/spacing'
import Border from '../styles/border'
import BoxShadow from '../styles/boxshadow'
import Format from '../styles/format'
import Background from '../styles/background'

const useStyles = makeStyles({
  ...Structure.Structure,
  ...Spacing.Spacing,
  ...Border.Border,
  ...BoxShadow.BoxShadow,
  ...Format.Format,
  ...Background.Background,
})

const Login = () => {
  let { setAuth } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState<{
    submit?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    if (errors['submit']) {
      setErrors(prev => ({ ...prev, ['submit']: undefined }))
    }
  }

  const handleSubmit = async (data: typeof formData): Promise<void> => {
    try {
      setIsSubmitting(true)
      setErrors({})

      const authData: Auth = await authenticate(data.username, data.password)

      setAuth({
        user: authData.user,
        permissions: authData.permissions,
        accessToken: authData.accessToken,
      })

      setFormData({
        username: '',
        password: '',
      })

      navigate(from, { replace: true })
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ submit: error.message + ' Please try again.' })
      } else {
        setErrors({ submit: 'An unknown error occurred. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const styles = useStyles()

  return (
    <div
      className={mergeClasses(
        styles.FlexToCenterMiddle,
        styles.HeightFullContent,
      )}
    >
      <form
        className={mergeClasses(
          styles.PaddingBase,
          styles.BorderRegular,
          styles.BorderRadiusRegular,
          styles.BoxShadowRegular,
          styles.FifthScreenWidth,
          styles.BackgroundNeutral,
        )}
        onSubmit={e => {
          e.preventDefault()
          handleSubmit(formData)
        }}
      >
        <Title2>{t('login.title')}</Title2>
        <div className={styles.MarginTopBase}>
          <div
            className={mergeClasses(styles.FullWidth, styles.MarginBottomSmall)}
          >
            <Label htmlFor="username">{t('login.username') + ' *'}</Label>
          </div>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={t('login.username_ph')}
            required
            className={styles.FormControlsFullWidth}
          />
        </div>
        <div className={styles.MarginTopBase}>
          <div
            className={mergeClasses(styles.FullWidth, styles.MarginBottomSmall)}
          >
            <Label htmlFor="password">{t('login.password') + ' *'}</Label>
          </div>
          <Input
            type="password"
            id="password"
            name="password"
            required
            onChange={handleChange}
            placeholder={t('login.password_ph')}
            className={styles.FormControlsFullWidth}
          />
        </div>
        <div
          className={mergeClasses(
            styles.MarginTopLarge,
            styles.FullWidth,
            styles.AlignRight,
          )}
        >
          {errors.submit && (
            <p className={mergeClasses(styles.TextError, styles.AlignLeft)}>
              {errors.submit}
            </p>
          )}
          <Button type="submit" appearance="primary" disabled={isSubmitting}>
            {isSubmitting ? t('login.loading') : t('login.button')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login
