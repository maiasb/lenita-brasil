import { useState } from 'react'
import { Input } from '../Input'
import logo from '../../assets/logo-1.png'
import instagram from '../../assets/instagram-icon.svg'
import whatsapp from '../../assets/whatsapp-icon.svg'
import youtube from '../../assets/youtube-icon.svg'

import './index.css'

type NavBarProps = {
  isMobile: boolean
}

function NavBar({ isMobile }: NavBarProps) {
  const [search, setSearch] = useState('')

  return (
    <div className="NavBar">
      <div className='sectionBar'>
        <a href='#banner'>
          <img src={logo} alt='logo' width={250}/>
        </a>
      </div>

      <div className='sectionBar links'>
        {
          isMobile && (
            <>
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
            </>
          )
        }
      </div>

      <div className='sectionBar align'>
        <div className='social'>
          <img src={instagram} alt='instagram' width={30} />
          <img src={whatsapp} alt='whatsapp' width={30} />
          <img src={youtube} alt='youtube' width={38} />
        </div>
        <div className='search'>
          <Input value={search} placeholder='Pesquisar' onChange={(e) => setSearch(e.target.value)}/>
        </div>
      </div>
    </div>
  )
}

export { NavBar }
