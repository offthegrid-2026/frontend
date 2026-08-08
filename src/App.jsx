import './App.css'
import { Routes, Route } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import RequireAuth from './routes/RequireAuth'
import RequireCompleteProfile from './routes/RequireCompleteProfile'
import SignForm from './pages/SignForm'
import OtpForm from './pages/OtpForm'
import CreateAccountForm from './pages/CreateAccountForm'
import Dashboard from './pages/Dashboard'
import StorePage from "./pages/StorePage.jsx";

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
        </Route>
      </Route>
    </Routes>
  )
}

export default App
