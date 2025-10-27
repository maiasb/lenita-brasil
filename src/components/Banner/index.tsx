import { Button } from '../Button'
import './index.css'

function Banner() {

  function handleClick() {
    alert("Consulta reaizada com sucesso!")
  }

  return (
    <div id='banner' className="banner">
      <div className='banner-content'>
        <div className='divText'>
          <label>Resultados que
          você vê, cuidado
          que você sente.</label>
        </div>

        <div className='divButton'>
          <Button text='Agende sua consulta' onClick={handleClick}/>
        </div>
      </div>
    </div>
  )
}

export { Banner }
