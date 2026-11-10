import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import HowItWorksSection from '../components/HowItWorksSection'

export default function Home() {
  return (
    <main className="w-full">
      {/* Pulls above-the-fold canvas under the sticky glassmorphic Navbar so the full 100dvh frame shows sky, roof, basket, and steps */}
      <div className="-mt-14 lg:-mt-[48px] [@media(min-width:1280px)_and_(min-height:760px)]:-mt-[58px] min-h-dvh flex flex-col">
        <HeroSection />
        <HowItWorksSection />
      </div>
      <Footer showWave={false} />
    </main>
  )
}
