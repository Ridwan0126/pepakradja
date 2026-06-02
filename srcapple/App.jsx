import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import Features from './components/Features'
import Showcase from './components/Showcase'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Carousel />
      <Features />
      <Showcase />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
