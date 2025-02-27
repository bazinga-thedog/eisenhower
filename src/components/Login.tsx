import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Input, Label } from '@fluentui/react-components'
import Auth from '../types/Auth'
import { authenticate } from '../services/AuthService'
import useAuth from '../hooks/useAuth'

import '../assets/style/Login.css'

const Login = () => {
  let { setAuth } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState<{
    username?: string
    password?: string
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

      const response: Response = await fetch('http://localhost:3030/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to sign in.')
      }

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

  return (
    <div className="login-container">
      <form
        className="login-form"
        onSubmit={e => {
          e.preventDefault()
          handleSubmit(formData)
        }}
      >
        <h2>Login</h2>
        <div className="form-group">
          <Label htmlFor="username">Username *</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <Label htmlFor="password">Password *</Label>
          <Input
            type="password"
            id="password"
            name="password"
            required
            onChange={handleChange}
            placeholder="Enter your password"
            className={errors.password ? 'border-red-500' : ''}
          />
        </div>
        <div className="text-align-right margin-top-base">
          {errors.submit && (
            <p className="text-center text-size-base text-error">
              {errors.submit}
            </p>
          )}
          <Button type="submit" appearance="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login
