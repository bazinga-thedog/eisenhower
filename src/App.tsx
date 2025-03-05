import React, { Suspense } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import './i18n/index'

import LoginPage from './pages/LoginPage'
import ContentPage from './pages/ContentPage'

import './assets/style/App.css'
import Layout from './Layout'
import RequireAuth from './components/RequireAuth'
import { AuthProvider } from './context/AuthProvider'
import PersistLogin from './components/PersistLogin'
import TestPage from './pages/TestPage'
import PoliciesPage from './pages/PoliciesPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FluentProvider theme={webLightTheme}>
          <Suspense fallback={<div>Suspense Loading...</div>}>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* public routes*/}
                <Route path="login" element={<LoginPage />} />
                {/* private routes */}
                <Route element={<PersistLogin />}>
                  <Route
                    element={
                      <RequireAuth allowedPermissions={['Pages:VIEW:-1']} />
                    }
                  >
                    <Route path="/" element={<ContentPage />} />
                    <Route path="/policies" element={<PoliciesPage />} />
                    <Route path="/policies/:id" element={<PoliciesPage />} />
                    <Route path="/test" element={<TestPage />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </FluentProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
