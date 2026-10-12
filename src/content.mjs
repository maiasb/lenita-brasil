/* ==========================================================================
   CONTEUDO - textos, links e imagens da pagina.
   Fontes: pasta SITE (estrutura site - lenita brasil.docx, SITE2.pdf),
   MANUAL DE MARCA.pdf e CARDS/IMPRESSOS (enderecos, telefone, @).
   Itens entre [colchetes] sao PLACEHOLDERS (o build lista todos).
   Publicidade medica (CFM 2.336/2023): sem promessa/garantia de resultado,
   sem antes/depois, sem preco/promocao, sem superlativos. Textos oficiais do
   cliente foram ADAPTADOS para cumprir a norma (ver CLAUDE.md > Divergencias).
   ========================================================================== */
export default {
  site: {
    url: "https://[dominio-a-definir]/",
    lang: "pt-BR",
    title: "Dra. Lenita Brasil | Clínica dermatológica e laboratórios em Belém e Castanhal",
    description:
      "Clínica médica dermatológica e laboratórios de exames da Dra. Lenita Brasil, com unidades em Belém e Castanhal (PA). Agende seu horário pelo WhatsApp.",
    ogImage: "assets/img/og.jpg",
    themeColor: "#f9e4ca",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Nata+Sans:wght@300;400;600&display=swap",
  },

  doctor: {
    name: "Dra. Lenita Brasil",
    crm: "CRM-PA 10896", // crachá (IMPRESSOS) e bio do Instagram
    rqe: null, // PENDENTE: RQE de Dermatologia nao consta nos materiais
    instagram: "https://www.instagram.com/dra.lenitabrasil/",
    instagramHandle: "@dra.lenitabrasil",
    labInstagram: "https://www.instagram.com/laboratorio_lb/",
    labInstagramHandle: "@laboratorio_lb",
  },

  whatsapp: {
    number: "5591996040003", // 91 99604-0003 (SITE2.pdf, cards e impressos)
    display: "91 99604-0003",
    message: "Olá! Vim pelo site da Dra. Lenita Brasil e gostaria de agendar um horário.",
    label: "Agende seu horário",
  },

  // Ordem e rotulos conforme SITE2.pdf
  nav: [
    { href: "#dra", label: "Dra. Lenita Brasil" },
    { href: "#clinica", label: "Clínica" },
    { href: "#procedimentos", label: "Procedimentos" },
    { href: "#laboratorios", label: "Laboratórios" },
    { href: "#exames", label: "Exames" },
  ],

  hero: {
    // SITE2: "Clinica medica dermatologica e exames laboratoriais de alto padrao".
    // "de alto padrao" removido (sugere superioridade - CFM 2.336/2023).
    title: "Clínica médica dermatológica e exames laboratoriais",
    text: "Acolhimento, sofisticação e autoridade em cada atendimento, em Belém e Castanhal.",
    cta: "Agende seu horário",
    image: { base: "hero", widths: [960, 1920], w: 1920, h: 791 },
    imageAlt: "Dra. Lenita Brasil, médica, sorrindo com a mão apoiada no queixo.",
    badges: ["Dermatologia", "Exames laboratoriais", "Belém e Castanhal"],
  },

  // Fatos verificaveis (sem numeros inventados)
  authority: {
    title: "Informações da clínica",
    items: [
      { value: "2 unidades", label: "Belém e Castanhal, no Pará" },
      { value: "Clínica + laboratório", label: "consultas, procedimentos e exames" },
      { value: "CRM-PA 10896", label: "Dra. Lenita Brasil, médica" },
      { value: "4 grupos de exames", label: "hematológicos, bioquímicos, hormonais e imunológicos" },
    ],
  },

  // Texto oficial (docx). "referencia" substituido (autoproclamacao).
  about: {
    title: "Dra. Lenita Brasil",
    paragraphs: [
      "Médica à frente da clínica e da rede de laboratórios, a Dra. Lenita Brasil integra saúde e bem-estar em tratamentos estéticos individualizados e exames laboratoriais.",
      "Seu compromisso é promover equilíbrio, autoestima e qualidade de vida, sempre com acolhimento e respeito à naturalidade de cada paciente.",
    ],
    facts: [`Médica · CRM-PA 10896`, "Clínica Lenita Brasil e Laboratórios Lenita Brasil"],
    cta: "Agende sua consulta",
    image: { base: "sobre", widths: [640, 1000], w: 1000, h: 856 },
    imageAlt: "Dra. Lenita Brasil de blazer branco, braços cruzados, ao lado do símbolo da marca.",
  },

  clinic: {
    title: "Clínicas Lenita Brasil",
    paragraphs: [
      "Em nossa clínica, sua experiência começa antes do procedimento. O tratamento exclusivo tem o olhar atento e a compreensão cuidadosa da Dra. Lenita Brasil para que você conheça profundamente os procedimentos que mais fazem sentido para a sua história e para a imagem que você deseja expressar.",
      "A técnica é precisa e a abordagem é delicada para respeitar sua anatomia e sua autenticidade. Priorizamos em todos os protocolos a naturalidade e a harmonia, sem exageros. Esse é um espaço para quem valoriza qualidade, sutileza e estética avançada.",
      "A Clínica Lenita Brasil possui duas unidades, para melhor receber você: uma em Belém e outra em Castanhal.",
    ],
    cta: "Conheça as unidades",
    image: { base: "clinica", widths: [640, 1000], w: 1000, h: 667 },
    imageAlt: "Médica de jaleco com estetoscópio.",
  },

  labs: {
    title: "Laboratórios Lenita Brasil",
    text: "Os Laboratórios Lenita Brasil contam com duas unidades prontas para receber você. Realizamos seus exames com rigor técnico, responsabilidade e agilidade, garantindo uma experiência tranquila e segura em todas as etapas do atendimento.",
    units: [
      {
        name: "Unidade Belém",
        address: "R. Bernal do Couto, nº 75 - Umarizal",
        mapQuery: "R. Bernal do Couto, 75, Umarizal, Belém, PA",
        image: { base: "unidade-belem", widths: [640, 1000], w: 1000, h: 875 },
        imageAlt: "Fachada da unidade de Belém da Clínica e Laboratório Lenita Brasil.",
      },
      {
        name: "Unidade Castanhal",
        address: "Av. Marechal Deodoro, nº 368 - Ianetama",
        mapQuery: "Av. Marechal Deodoro, 368, Castanhal, PA",
        image: { base: "unidade-castanhal", widths: [640, 1000], w: 1000, h: 875 },
        imageAlt: "Fachada da unidade de Castanhal, Centro Médico Lenita Brasil.",
      },
    ],
    mapLabel: "Saiba como chegar",
  },

  exams: {
    title: "Exames",
    // "entre os mais completos do Para" removido (superioridade - CFM).
    text: "Nossos laboratórios contam com equipamentos modernos e de alta precisão, com foco em rigor técnico e agilidade na entrega dos resultados. Conheça abaixo a lista de exames convencionais disponíveis.",
    cta: "Agende seu exame",
    image: { base: "exames", widths: [640, 1000], w: 1000, h: 667 },
    imageAlt: "Profissional de laboratório de luvas azuis manuseando amostras.",
    groups: [
      { title: "Hematológicos", items: ["Hemograma", "Tipagem sanguínea", "Hemoglobina glicada"] },
      {
        title: "Bioquímicos",
        items: ["Ácido úrico", "TGO", "TGP", "GGT", "Fosfatase alcalina", "Ureia", "Creatinina", "Glicose", "Colesterol total e frações", "Triglicerídeos", "Proteínas totais e frações", "Ferro"],
      },
      {
        title: "Hormonais",
        items: ["Testosterona total e livre", "Ferritina", "Vitamina D3", "Vitamina B12", "TSH", "T3", "T4 livre", "Estradiol", "Progesterona", "PSA livre e total"],
      },
      { title: "Imunológicos", items: ["VDRL", "HIV", "HCV", "HBsAg"] },
    ],
  },

  procedures: {
    title: "Procedimentos",
    text: "Na Clínica Lenita Brasil, seu tratamento estético é conduzido com técnica avançada, equipamentos modernos e atenção cuidadosa às suas principais necessidades e desejos. O objetivo é realçar a beleza natural com segurança e harmonia.",
    lead: "O que deseja transformar hoje?",
    note: "Toda indicação parte de avaliação médica. A resposta é individual, não há garantia de resultado e podem existir riscos e efeitos adversos, explicados na consulta.",
    cta: "Agende seu horário",
    // Textos adaptados do docx: removidas promessas de resultado e superlativos.
    items: [
      {
        title: "Botox",
        short: "Toxina botulínica para linhas de expressão.",
        text: [
          "A toxina botulínica é indicada para suavizar linhas finas e marcas de expressão em regiões como testa, entre as sobrancelhas e área dos olhos.",
          "Utilizamos a técnica de aplicação estratégica ponto a ponto, respeitando a anatomia do seu rosto e a naturalidade do seu movimento, sem congelar as expressões.",
        ],
        image: { base: "botox", widths: [480, 800], w: 800, h: 533 },
        imageAlt: "Aplicação de toxina botulínica na região lateral do rosto.",
        pos: "30% 50%",
      },
      {
        title: "Preenchimento labial",
        short: "Ácido hialurônico para contorno e hidratação dos lábios.",
        text: [
          "O preenchimento labial trabalha o formato, o contorno, o volume e a hidratação dos lábios, sem artificialidade.",
          "Avaliamos o formato do rosto, do sorriso e as proporções para aplicar o ácido hialurônico de forma sutil, priorizando movimento, harmonia e delicadeza.",
        ],
        image: { base: "preenchimento-labial", widths: [480, 758], w: 758, h: 684 },
        imageAlt: "Close dos lábios de uma mulher com brilho labial.",
        pos: "50% 55%",
      },
      {
        title: "MesojectGun",
        short: "Tecnologia sem agulhas que cria microcanais para ativos.",
        text: [
          "A MesojectGun usa pulsos de energia para criar microcanais entre as células da pele, permitindo a penetração de ativos concentrados em protocolos para melasma, rejuvenescimento, acne, flacidez das pálpebras e fortalecimento capilar.",
          "A aplicação é feita sem agulhas, e o protocolo é definido após avaliação médica.",
        ],
        image: { base: "mesoject-gun", widths: [480, 800], w: 800, h: 534 },
        imageAlt: "Aplicação com o equipamento MesojectGun no rosto.",
        pos: "55% 50%",
      },
      {
        title: "Terapia capilar",
        short: "Protocolo personalizado para couro cabeludo e fios.",
        text: [
          "O tratamento é focado no couro cabeludo e no fortalecimento dos fios, e pode ser indicado em casos de queda, afinamento, oleosidade ou perda de densidade.",
          "Na primeira consulta, avaliamos as causas da queda e elaboramos um protocolo personalizado com ativos, microestimulação e nutrição das raízes capilares.",
        ],
        image: { base: "terapia-capilar", widths: [480, 800], w: 800, h: 1198 },
        imageAlt: "Profissional de luvas avaliando o couro cabeludo.",
        pos: "50% 45%",
      },
      {
        title: "Tratamento de manchas",
        short: "Abordagem em camadas para o tom e a uniformidade da pele.",
        text: [
          "Abordagem indicada para manchas causadas pelo sol, melasma ou marcas antigas.",
          "Trabalhamos em camadas: primeiro o controle da inflamação (se houver), depois o clareamento gradual, sem abrir mão da proteção e da manutenção. O protocolo inclui dermocosméticos e tecnologias específicas.",
        ],
        image: { base: "manchas", widths: [480, 800], w: 800, h: 450 },
        imageAlt: "Mulher com as mãos no rosto.",
        pos: "55% 50%",
      },
      {
        title: "Fios de PDO",
        short: "Bioestimulação de colágeno e sustentação.",
        text: [
          "Os fios de PDO oferecem sustentação por meio de bioestimulação de colágeno, com ação em firmeza e na estrutura da pele.",
          "Posicionamos os fios respeitando os vetores naturais de sustentação do seu rosto, buscando um resultado sutil e elegante.",
        ],
        image: { base: "fios-pdo", widths: [480, 800], w: 800, h: 533 },
        imageAlt: "Aplicação de fio de PDO na região do queixo.",
        pos: "55% 50%",
      },
      {
        title: "Ultraformer MPT",
        short: "Ultrassom micro e macrofocado, sem cortes e sem cirurgia.",
        text: [
          "O Ultraformer MPT é uma evolução das tecnologias de ultrassom para rejuvenescimento e definição facial. Atua nas camadas mais profundas da pele, sem cortes e sem cirurgia.",
          "A tecnologia envia micropulsos milimétricos que estimulam a produção de colágeno. A indicação e o número de sessões dependem da avaliação médica.",
        ],
        image: { base: "ultraformer-mpt", widths: [480, 800], w: 800, h: 1200 },
        imageAlt: "Aplicação do Ultraformer MPT na região do maxilar.",
        pos: "50% 55%",
      },
      {
        title: "Laser Lavieen",
        short: "Laser para renovação da pele, poros e marcas de acne.",
        text: [
          "O Lavieen é uma tecnologia de laser indicada para renovação da pele, poros dilatados, textura e marcas de acne.",
          "O tratamento é personalizado: avaliamos as necessidades da sua pele, seu histórico e sua resposta às sessões.",
        ],
        image: { base: "laser-lavieen", widths: [480, 800], w: 800, h: 1200 },
        imageAlt: "Mulher recebendo aplicação de laser no rosto.",
        pos: "50% 40%",
      },
    ],
  },

  steps: {
    title: "Como agendar",
    items: [
      { title: "Fale pelo WhatsApp", text: "Envie sua mensagem e nossa equipe orienta sobre unidades e horários." },
      { title: "Avaliação médica", text: "A doutora escuta suas necessidades, avalia seu histórico e explica as opções adequadas." },
      { title: "Plano individualizado", text: "Você recebe orientações claras, incluindo riscos e alternativas, para decidir com segurança." },
    ],
    cta: "Agende seu horário",
  },

  faq: {
    title: "Dúvidas frequentes",
    items: [
      { q: "Onde ficam as unidades?", a: "Em Belém (R. Bernal do Couto, nº 75 - Umarizal) e em Castanhal (Av. Marechal Deodoro, nº 368 - Ianetama), no Pará." },
      { q: "Como agendo uma consulta ou exame?", a: "Pelo botão de WhatsApp desta página ou pelo formulário de contato. A mensagem já vai pronta; é só enviar." },
      { q: "Posso fazer o procedimento na primeira consulta?", a: "Depende. Toda indicação passa por avaliação médica, e a doutora define o que é adequado e seguro para o seu caso." },
      { q: "Existe garantia de resultado?", a: "Não. Procedimentos médicos e estéticos têm resposta individual e riscos inerentes. Por isso, você recebe explicação completa antes de decidir." },
      { q: "Quais exames o laboratório realiza?", a: "Exames hematológicos, bioquímicos, hormonais e imunológicos. A lista completa está na seção Exames desta página." },
      { q: "Qual o valor da consulta e dos exames?", a: "Os valores são informados pela equipe no atendimento pelo WhatsApp, de acordo com o serviço escolhido." },
    ],
  },

  contact: {
    title: "Estamos prontos para cuidar de você.",
    text: "Quer agendar uma consulta, exame ou saber mais sobre nossos tratamentos? Preencha o formulário e fale com nossa equipe.",
    orWhats: "Ou entre em contato pelo WhatsApp",
    submit: "Enviar",
    privacy: "Ao enviar, você abre uma conversa no WhatsApp com os dados preenchidos. Nenhuma informação fica guardada neste site.",
    image: { base: "contato", widths: [600, 900], w: 900, h: 1350 },
    imageAlt: "Dra. Lenita Brasil sorrindo, com as mãos sob o queixo.",
  },

  footer: {
    tagline: "Viva a experiência de um atendimento exclusivo e cuidadoso",
    text: "Agende sua consulta ou exame em uma de nossas clínicas ou laboratórios e permita-se sentir o melhor da sua própria beleza e saúde.",
    legal: [
      "Dra. Lenita Brasil, Médica, CRM-PA 10896.",
      "Este site tem caráter informativo e não substitui consulta médica. Não há garantia de resultados; cada caso é avaliado individualmente. Conteúdo elaborado conforme a Resolução CFM nº 2.336/2023.",
      "CNPJ: [00.000.000/0000-00] · Responsável técnico: [nome e CRM]",
    ],
  },
};
