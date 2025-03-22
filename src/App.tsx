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
import PoliciesPage from './pages/Policies/PoliciesPage'
import PolicyDetailsPage from './pages/Policies/PolicyDetailsPage'
import PolicyEditPage from './pages/Policies/PolicyEditPage'
import RolesPage from './pages/Roles/RolesPage'
import RoleDetailsPage from './pages/Roles/RoleDetailsPage'
import RoleEditPage from './pages/Roles/RoleEditPage'
import UsersPage from './pages/Users/UsersPage'
import UsersDetailsPage from './pages/Users/UsersDetailsPage'
import UsersEditPage from './pages/Users/UsersEditPage'

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
                      <RequireAuth allowedPermissions={['Pages:READ:-1']} />
                    }
                  >
                    <Route path="/" element={<ContentPage />} />
                    <Route path="/policies" element={<PoliciesPage />} />
                    <Route
                      path="/policies/:id"
                      element={<PolicyDetailsPage />}
                    />
                    <Route
                      path="/policies/edit/:id"
                      element={<PolicyEditPage />}
                    />
                    <Route path="/roles" element={<RolesPage />} />
                    <Route path="/roles/:id" element={<RoleDetailsPage />} />
                    <Route path="/roles/edit/:id" element={<RoleEditPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/users/:id" element={<UsersDetailsPage />} />
                    <Route path="/users/edit/:id" element={<UsersEditPage />} />
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
