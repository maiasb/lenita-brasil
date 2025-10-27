import { BrowserRouter, Route, Routes } from 'react-router'
import { Home } from './pages/Home'
import { Clinic } from './pages/Clinic'
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clinica" element={<Clinic />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
