import { Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { FarmerProvider } from './context/FarmerContext'
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
import CompanyHome from './company/CompanyHome'
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
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/company" element={<CompanyHome />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="*" element={<NotFound />} />
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
    </FarmerProvider>
  )
}

export default App
