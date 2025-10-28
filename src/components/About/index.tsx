import './index.css'
import avatar from '../../assets/Imagem-Lenita.png'

function About() {
  return (
    <div id='sobre' className='sobre'>
      <div className='sobre-image'>
        <img src={avatar} alt='avatar' width={550} />
      </div>

      <div className='sobre-text'>
        <h1>Quem é Lenita Brasil?</h1>
        <p>
          A Lenita Brasil é referência em rejuvenescimento e
          cuidados integrados, unindo excelência técnica,
          atendimento humanizado e estrutura premium.
          Oferecendo agilidade, conforto e resultados seguros
          para pacientes que valorizam qualidade, exclusividade
          e conﬁança.
        </p>
      </div>
    </div>
  )
}

export { About }
