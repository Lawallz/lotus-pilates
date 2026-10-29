import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import BenefitsStrip from './components/BenefitsStrip.jsx'
import WhatIsPilates from './components/WhatIsPilates.jsx'
import StoryTabs from './components/StoryTabs.jsx'
import Partners from './components/Partners.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Pricing from './components/Pricing.jsx'
import Gallery from './components/Gallery.jsx'
import Testimonials from './components/Testimonials.jsx'
import LeadForm from './components/LeadForm.jsx'
import FAQ from './components/FAQ.jsx'
import Location from './components/Location.jsx'
import Footer from './components/Footer.jsx'
import MobileCTA from './components/MobileCTA.jsx'
import BeforeClass from './components/BeforeClass.jsx'
import ContractPreview from './components/ContractPreview.jsx'
import { testimonials } from './data/site.js'

export default function App() {
  const [isManagement, setIsManagement] = useState(window.location.hash === '#/gestao')

  useEffect(() => {
    const syncRoute = () => setIsManagement(window.location.hash === '#/gestao')
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  if (isManagement) return <AdminDashboard onExit={() => { window.location.hash = '#topo' }} />

  return (
    <>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <BenefitsStrip />
        <WhatIsPilates />
        <StoryTabs />
        <Partners />
        <HowItWorks />
        <Pricing />
        <Gallery />
        {testimonials.length > 0 && <Testimonials />}
        <BeforeClass />
        <ContractPreview />
        <LeadForm />
        <FAQ />
        <Location />
      </main>
      <Footer />
      <MobileCTA />
    </>
  )
}
import { useEffect, useState } from 'react'
import AdminDashboard from './components/AdminDashboard.jsx'
