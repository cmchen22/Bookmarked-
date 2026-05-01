import { Route, Routes } from 'react-router-dom'

import './App.css'
import { BookDetailPage } from './pages/BookDetailPage'
import { DashboardPage } from './pages/DashboardPage'
import { DiscoveryPage } from './pages/DiscoveryPage'
import { LandingPage } from './pages/LandingPage'
import { SocialMediaPage } from './pages/SocialMediaPage'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'

function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--sans)',
    }}>
      <span style={{ fontSize: '3.5rem' }}>📖</span>
      <h1 style={{ fontFamily: 'var(--heading)', fontSize: '3rem', margin: 0, color: 'var(--heading-color)' }}>404</h1>
      <p style={{ color: 'var(--muted)', margin: 0 }}>That page doesn't exist.</p>
      <a href="/" style={{ marginTop: '0.5rem', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>← Back to home</a>
    </div>
  )
}

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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App