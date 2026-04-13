import { Route, Routes } from 'react-router-dom'

import './App.css'
import { DashboardPage } from './pages/DashboardPage'
import { DiscoveryPage } from './pages/DiscoveryPage'
import { LandingPage } from './pages/LandingPage'
import { SocialMediaPage } from './pages/SocialMediaPage'
<<<<<<< HEAD
import HomePage from './pages/HomePage'
=======
import SignInPage from './pages/SignInPage'
>>>>>>> 0e24db690adc822911f762d6ccee9b7dfcdbe485

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/social" element={<SocialMediaPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/discovery" element={<DiscoveryPage />} />
    </Routes>
  )
}

export default App