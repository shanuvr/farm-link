import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import HowItWorksSection from '../components/HowItWorksSection'

export default function Home() {
  return (
    <main className="w-full">
      <div className="min-h-[calc(100dvh-3.75rem)] lg:min-h-[calc(100dvh-3.25rem)] [@media(min-width:1280px)_and_(min-height:760px)]:min-h-[calc(100dvh-3.875rem)] flex flex-col">
        <HeroSection />
        <HowItWorksSection />
      </div>
      <Footer showWave={false} />
    </main>
  )
}
