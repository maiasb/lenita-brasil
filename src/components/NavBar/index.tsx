import { useNavigate } from 'react-router';
import './index.css'

function NavBar() {
  const navigate = useNavigate()

  function handleNavigate(path: string) {
    navigate(path)
  }

  return (
    <div className="NavBar">
      <div className='sectionBar'>
        <button onClick={() => handleNavigate('/clinica')}>A clínica</button>
      </div>

      <div className='sectionBar'>
        <h1>Navegação</h1>
      </div>

      <div className='sectionBar'>
        <h1>Pesquisar</h1>
      </div>
    </div>
  )
}

export { NavBar }
