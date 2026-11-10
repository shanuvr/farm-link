import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { CompanyProvider } from './context/CompanyContext'
import { FarmerProvider } from './context/FarmerContext'
import CompanyLayout from './layouts/CompanyLayout'
import FarmerLayout from './layouts/farmerlayout'
import Home from './pages/Home'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import Register from './pages/Register'
import Login from './pages/Login'
import CompanyLogin from './pages/CompanyLogin'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import FarmersHome from './farmers/FarmersHome'
import FarmerListings from './farmers/FarmerListings'
import AddListing from './farmers/AddListing'
import FarmerOffers from './farmers/FarmerOffers'
import FarmerOrders from './farmers/FarmerOrders'
import FarmerProfile from './farmers/FarmerProfile'
import CompanyBrowse from './company/CompanyBrowse'
import CompanyFarmers from './company/CompanyFarmers'
import CompanyHome from './company/CompanyHome'
import CompanyOffers from './company/CompanyOffers'
import CompanyOrders from './company/CompanyOrders'
import CompanyReports from './company/CompanyReports'
import CompanySettings from './company/CompanySettings'
import AdminHome from './admin/AdminHome'
import NotFound from './pages/NotFound'

function PublicLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <FarmerProvider>
      <CompanyProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/company" element={<CompanyLogin />} />
          <Route path="/company/login" element={<Navigate to="/company" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<CompanyLayout />}>
          <Route path="/company/dashboard" element={<CompanyHome />} />
          <Route path="/company/browse" element={<CompanyBrowse />} />
          <Route path="/company/offers" element={<CompanyOffers />} />
          <Route path="/company/orders" element={<CompanyOrders />} />
          <Route path="/company/farmers" element={<CompanyFarmers />} />
          <Route path="/company/reports" element={<CompanyReports />} />
          <Route path="/company/settings" element={<CompanySettings />} />
        </Route>

        <Route path="/farmers" element={<FarmerLayout />}>
          <Route index element={<FarmersHome />} />
          <Route path="listings" element={<FarmerListings />} />
          <Route path="add" element={<AddListing />} />
          <Route path="offers" element={<FarmerOffers />} />
          <Route path="orders" element={<FarmerOrders />} />
          <Route path="profile" element={<FarmerProfile />} />
        </Route>
        </Routes>
      </CompanyProvider>
    </FarmerProvider>
  )
}

export default App
