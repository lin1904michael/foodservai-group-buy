import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import GlobalHeader from './components/GlobalHeader'
import AuthModal from './components/AuthModal'
import PortalHome from './pages/PortalHome'
import RestaurantDrop from './pages/RestaurantDrop'
import OrderHistory from './pages/OrderHistory'
import Rewards from './pages/Rewards'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <GlobalHeader />
        <Routes>
          <Route path="/" element={<PortalHome />} />
          <Route path="/restaurant/:id" element={<RestaurantDrop />} />
          <Route path="/history" element={<OrderHistory />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="*" element={<PortalHome />} />
        </Routes>
        <AuthModal />
      </BrowserRouter>
    </AppProvider>
  )
}
