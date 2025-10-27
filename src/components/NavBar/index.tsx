import logo from '../../assets/logo-1.png'
import './index.css'

function NavBar() {

  return (
    <div className="NavBar">
      <div className='sectionBar'>
        <a href='#banner'>
          <img src={logo} alt='logo' width={250}/>
        </a>
      </div>

      <div className='sectionBar links'>
        <div>
          <a href='#sobre'>Quem é Lenita Brasil</a>
        </div>

        <div>
          <a href='#clinica'>A Clínica</a>
        </div>

        <div>
          <a href='#laboratorios'>Nossos Laboratórios</a>
        </div>

        <div>
          <a href='#exames'>Exames</a>
        </div>
      </div>

      <div className='sectionBar'>
        <div className='social'></div>
        <div className='search'>
          <h1>Search</h1>
        </div>
      </div>
    </div>
  )
}

export { NavBar }
