import './App.css'
import { NavBar } from './components/NavBar'
import { Banner } from './components/Banner'
import { About } from './components/About'
import { Footer } from './components/Footer'
import { useMediaQuery } from 'react-responsive';

function App() {
  const isMobile = useMediaQuery({ query: `(min-width: 1100px)` });

  return (
    <>
      <NavBar isMobile={isMobile} />
      <Banner />
      <About />
      <Footer />
    </>
  )
}

export default App
