import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'

import NavBar from './components/NavBar'
import Footer from './components/Footer'

import './assets/style/NavBar.css'
import Content from './components/Content'

export default function App() {
  return (
    <FluentProvider theme={webLightTheme} className="App">
      <div className="header">
        <NavBar />
      </div>
      <div className="body">
        <div className="content">
          <Content>
            <Router>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<span>This is the content</span>} />
                </Routes>
              </Suspense>
            </Router>
          </Content>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </FluentProvider>
  )
}
