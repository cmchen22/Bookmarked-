import { Route, Routes } from 'react-router-dom'

import './App.css'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { SocialMediaPage } from './pages/SocialMediaPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/social" element={<SocialMediaPage />} />
    </Routes>
  )
}

export default App