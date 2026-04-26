import { Route, Routes } from 'react-router-dom'

import './App.css'
import { BookDetailPage } from './pages/BookDetailPage'
import { DashboardPage } from './pages/DashboardPage'
import { DiscoveryPage } from './pages/DiscoveryPage'
import { LandingPage } from './pages/LandingPage'
import { SocialMediaPage } from './pages/SocialMediaPage'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/social" element={<SocialMediaPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/discovery" element={<DiscoveryPage />} />
      <Route path="/discovery/:bookId" element={<BookDetailPage />} />
    </Routes>
  )
}

export default App