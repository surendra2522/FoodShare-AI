import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App