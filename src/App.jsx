import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import Register from './pages/Register'
import Login from './pages/Login'
import CompanyLogin from './pages/CompanyLogin'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import FarmersHome from './farmers/FarmersHome'
import CompanyHome from './company/CompanyHome'
import AdminHome from './admin/AdminHome'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/farmers" element={<FarmersHome />} />
        <Route path="/company" element={<CompanyHome />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
