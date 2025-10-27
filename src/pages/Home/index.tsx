import { About } from '../../components/About'
import { Banner } from '../../components/Banner'
import { Footer } from '../../components/Footer'
import { NavBar } from '../../components/NavBar'

function Home() {
  return (
    <>
      <NavBar />
      <Banner />
      <About />
      <Footer />
    </>
  )
}

export { Home }
