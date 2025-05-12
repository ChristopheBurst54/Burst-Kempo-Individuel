import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import Tournament from './pages/Tournament'
import Layout from './components/ui/layout'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes sans layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Routes avec layout */}
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/tournament/:id" element={<Tournament />} />
        </Route>

        {/* Catch-all (redirige vers login) */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  )
}
