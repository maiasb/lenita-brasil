import clinic from '../../assets/clinic-icon.svg'
import tube from '../../assets/tube-icon.svg'

import './index.css'

function Footer() {
  return (
    <div className="footer">
      <div className="div-footer">
        <div className="div-title">
          <img src={clinic} alt='clinic' width={50} />
          <h1>Clínica Lenita Brasil</h1>
        </div>
        <p>
          A Lenita Brasil é referência em rejuvenescimento e
          cuidados integrados, unindo excelência técnica,
          atendimento humanizado e estrutura premium.
          Oferecendo agilidade, conforto e resultados seguros
          para pacientes que valorizam qualidade, exclusividade
          e conﬁança.
        </p>
      </div>

      <div className="div-footer">
        <div className="div-title">
          <img className='tube' src={tube} alt='tube' width={40}  />
          <h1>Laboratórios Lenita Brasil</h1>
        </div>
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

export { Footer }
