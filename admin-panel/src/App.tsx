import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import ContentSettings from '@/pages/ContentSettings'
import Scheduling from '@/pages/Scheduling'
import Accounts from '@/pages/Accounts'
import Analytics from '@/pages/Analytics'
import Logs from '@/pages/Logs'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/content" element={<ContentSettings />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/logs" element={<Logs />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App 