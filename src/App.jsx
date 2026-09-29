import './App.css'
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import RequireAuth from './routes/RequireAuth'
import RequireCompleteProfile from './routes/RequireCompleteProfile'
import RequireNoPass from './routes/RequireNoPass'
import RequireScanner from './routes/RequireScanner'
import SignForm from './pages/SignForm'
import OtpForm from './pages/OtpForm'
import CreateAccountForm from './pages/CreateAccountForm'
import Dashboard from './pages/Dashboard'
import StorePage from './pages/StorePage.jsx'
import LoadingScreen from './components/LoadingScreen'

// Only gate staff use the scanner, so its camera + QR-decoding code is split into its own
// file instead of being downloaded by every attendee.
const ScannerPage = lazy(() => import('./pages/ScannerPage.jsx'))

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<SignForm />} />
        <Route path="otp" element={<OtpForm />} />
        <Route element={<RequireAuth />}>
          <Route path="create-account" element={<CreateAccountForm />} />
        </Route>
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<RequireCompleteProfile />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<RequireNoPass />}>
            <Route path="/store" element={<StorePage />} />
          </Route>
        </Route>
      </Route>
      <Route element={<RequireScanner />}>
        <Route
          path="/scanner"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <ScannerPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
