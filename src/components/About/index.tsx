import './index.css'
import avatar from '../../assets/avatar.png'

function About() {
  return (
    <div id='sobre' className='about'>
      <div className='about-image'>
        <img src={avatar} width={650}/>
      </div>
      <div className='about-text'>
        <h1>Quem é Lenita Brasil?</h1>
        <label>
          A Lenita Brasil é referência em rejuvenescimento e
          cuidados integrados, unindo excelência técnica,
          atendimento humanizado e estrutura premium.
          Oferecendo agilidade, conforto e resultados seguros
          para pacientes que valorizam qualidade, exclusividade
          e conﬁança.
        </label>
      </div>
    </div>
  )
}

export { About }
