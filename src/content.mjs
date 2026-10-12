/* ==========================================================================
   CONTEUDO - textos, links e imagens da pagina.
   Fontes: pasta SITE (estrutura site - lenita brasil.docx, SITE2.pdf),
   MANUAL DE MARCA.pdf e CARDS/IMPRESSOS (enderecos, telefone, @).
   Nenhum placeholder visivel: dados ausentes ficam OCULTOS (ver CLAUDE.md > Ocultado por falta de dado).
   Publicidade medica (CFM 2.336/2023): sem promessa/garantia de resultado,
   sem antes/depois, sem preco/promocao, sem superlativos. Textos oficiais do
   cliente foram ADAPTADOS para cumprir a norma (ver CLAUDE.md > Divergencias).
   ========================================================================== */
export default {
  site: {
    url: "https://maiasb.github.io/lenita-brasil/", // trocar pelo dominio proprio quando houver
    canonical: false, // ativar (true) so com dominio proprio definitivo
    lang: "pt-BR",
    title: "Dra. Lenita Brasil | Consulta e exames em Belém e Castanhal",
    description:
      "Consulta com a Dra. Lenita Brasil e exames de laboratório em Belém e Castanhal (PA). Agende pelo WhatsApp e informe a unidade. CRM-PA 10896.",
    ogImage: "assets/img/og.jpg",
    themeColor: "#f9e4ca",
  },

  doctor: {
    name: "Dra. Lenita Brasil",
    crm: "CRM-PA 10896", // crachá (IMPRESSOS) e bio do Instagram
    // Sem RQE nao se anuncia especialidade. Ao preencher, o site exibe o RQE
    // e passa a poder citar "Dermatologia" (ver build.mjs: specialty).
    rqe: null,
    instagram: "https://www.instagram.com/dra.lenitabrasil/",
    instagramHandle: "@dra.lenitabrasil",
    labInstagram: "https://www.instagram.com/laboratorio_lb/",
    labInstagramHandle: "@laboratorio_lb",
  },

  whatsapp: {
    number: "5591996040003", // 91 99604-0003 (SITE2.pdf, cards e impressos)
    display: "91 99604-0003",
    // Dois caminhos: consulta e exame, cada um com mensagem propria.
    consulta: {
      label: "Agendar consulta",
      message: "Olá! Vim pelo site e gostaria de agendar uma consulta com a Dra. Lenita Brasil.",
    },
    exame: {
      label: "Agendar exame",
      message: "Olá! Vim pelo site e gostaria de informações para fazer exames no laboratório.",
    },
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
    title: "Consulta médica e exames de laboratório em Belém e Castanhal",
    text: "Escolha entre consulta e exame. A equipe responde pelo WhatsApp e informa unidades, horários e valores.",
    micro: "Atendimento pelo WhatsApp 91 99604-0003 · Sem compromisso",
    image: { base: "hero", widths: [960, 1920], w: 1920, h: 791 },
    imageAlt: "Dra. Lenita Brasil, médica, sorrindo com a mão apoiada no queixo.",
    badges: ["Consulta médica", "Exames laboratoriais", "Belém e Castanhal", "CRM-PA 10896"],
  },

  // Fatos verificaveis (sem numeros inventados)
  authority: {
    title: "Informações da clínica",
    items: [
      { value: "2 unidades", label: "Belém e Castanhal, no Pará" },
      { value: "Consulta e exames", label: "com a Dra. Lenita Brasil e nos laboratórios" },
      { value: "CRM-PA 10896", label: "Dra. Lenita Brasil, médica" },
      { value: "WhatsApp", label: "91 99604-0003, para agendar" },
    ],
  },

  about: {
    title: "Dra. Lenita Brasil",
    paragraphs: [
      "Médica à frente da clínica e dos laboratórios, a Dra. Lenita Brasil atende pacientes em consulta e acompanha a oferta de exames laboratoriais.",
      "No consultório, a conversa vem antes da indicação: ela ouve sua queixa, avalia seu histórico e explica as opções disponíveis.",
    ],
    cta: "Agendar consulta",
    image: { base: "sobre", widths: [640, 1000], w: 1000, h: 856 },
    imageAlt: "Dra. Lenita Brasil de blazer branco, braços cruzados, ao lado do símbolo da marca.",
  },

  clinic: {
    title: "Clínica Lenita Brasil",
    paragraphs: [
      "Na consulta, a Dra. Lenita Brasil ouve sua queixa, avalia a pele, o cabelo e o seu histórico, e explica as opções de tratamento, com benefícios, riscos e alternativas. Só então a indicação é feita.",
      "A Clínica Lenita Brasil possui duas unidades: uma em Belém e outra em Castanhal.",
    ],
    cta: "Ver endereços",
    image: { base: "clinica", widths: [640, 1000], w: 1000, h: 667 },
    imageAlt: "Médica de jaleco com estetoscópio. Imagem ilustrativa.",
  },

  labs: {
    title: "Laboratórios Lenita Brasil",
    text: "Os Laboratórios Lenita Brasil têm duas unidades, em Belém e Castanhal. A equipe informa unidades, horários e valores no atendimento pelo WhatsApp.",
    units: [
      {
        name: "Unidade Belém",
        address: "R. Bernal do Couto, nº 75 - Umarizal",
        mapQuery: "R. Bernal do Couto, 75, Umarizal, Belém, PA",
        image: { base: "unidade-belem", widths: [640, 1000], w: 1000, h: 875 },
        imageAlt: "Fachada da unidade de Belém, Lenita Brasil.",
      },
      {
        name: "Unidade Castanhal",
        address: "Av. Marechal Deodoro, nº 368 - Ianetama",
        mapQuery: "Av. Marechal Deodoro, 368, Castanhal, PA",
        image: { base: "unidade-castanhal", widths: [640, 1000], w: 1000, h: 875 },
        imageAlt: "Fachada da unidade de Castanhal, Lenita Brasil.",
      },
    ],
    mapLabel: "Saiba como chegar",
  },

  exams: {
    title: "Exames",
    text: "Veja abaixo a lista de exames convencionais disponíveis. A equipe informa no atendimento pelo WhatsApp se é preciso pedido médico, qual o preparo (como jejum) e como os resultados são entregues.",
    cta: "Agendar exame",
    image: { base: "exames", widths: [640, 1000], w: 1000, h: 667 },
    imageAlt: "Profissional de laboratório de luvas azuis manuseando amostras. Imagem ilustrativa.",
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
    text: "Os procedimentos são realizados após avaliação médica. A indicação, o número de sessões e os cuidados dependem de cada caso.",
    lead: "Conheça os procedimentos oferecidos na clínica.",
    note: "Toda indicação parte de avaliação médica. A resposta é individual, não há garantia de resultado e podem existir riscos e efeitos adversos, explicados na consulta. Imagens ilustrativas.",
    cta: "Agendar consulta",
    items: [
      {
        title: "Toxina botulínica",
        short: "Aplicação em regiões da face definidas na avaliação.",
        text: [
          "A toxina botulínica é aplicada em regiões da face como testa, entre as sobrancelhas e área dos olhos, conforme a avaliação médica.",
          "A aplicação ponto a ponto considera a anatomia do rosto. A indicação depende da avaliação médica.",
        ],
        image: { base: "toxina-botulinica", widths: [480, 800], w: 800, h: 533 },
        imageAlt: "Aplicação de toxina botulínica na região lateral do rosto.",
        pos: "30% 50%",
      },
      {
        title: "Preenchimento labial",
        short: "Aplicação de ácido hialurônico nos lábios.",
        text: [
          "O preenchimento labial é feito com ácido hialurônico e considera o formato do rosto, do sorriso e as proporções de cada pessoa.",
          "A indicação depende da avaliação médica.",
        ],
        image: { base: "preenchimento-labial", widths: [480, 758], w: 758, h: 684 },
        imageAlt: "Close dos lábios de uma mulher com brilho labial.",
        pos: "50% 55%",
      },
      {
        title: "MesojectGun",
        short: "Equipamento que cria microcanais na pele.",
        text: [
          "A MesojectGun é um equipamento que usa pulsos de energia para criar microcanais na pele, por onde ativos podem ser aplicados.",
          "O protocolo é definido após avaliação médica. A indicação depende da avaliação médica.",
        ],
        image: { base: "mesoject-gun", widths: [480, 800], w: 800, h: 534 },
        imageAlt: "Aplicação com o equipamento MesojectGun no rosto.",
        pos: "55% 50%",
      },
      {
        title: "Terapia capilar",
        short: "Protocolo para couro cabeludo e fios, definido em consulta.",
        text: [
          "A terapia capilar é voltada ao couro cabeludo e aos fios.",
          "Na consulta, a Dra. Lenita Brasil avalia o caso e define se há indicação e qual protocolo seguir. A indicação depende da avaliação médica.",
        ],
        image: { base: "terapia-capilar", widths: [480, 800], w: 800, h: 1198 },
        imageAlt: "Profissional de luvas avaliando o couro cabeludo.",
        pos: "50% 45%",
      },
      {
        title: "Tratamento de manchas",
        short: "Avaliação da pele e protocolo definido caso a caso.",
        text: [
          "O tratamento de manchas começa com a avaliação médica da pele e do histórico.",
          "O protocolo pode incluir dermocosméticos e tecnologias específicas, conforme cada caso. A indicação depende da avaliação médica.",
        ],
        image: { base: "manchas", widths: [480, 800], w: 800, h: 450 },
        imageAlt: "Mulher com as mãos no rosto.",
        pos: "55% 50%",
      },
      {
        title: "Fios de PDO",
        short: "Fios posicionados conforme o planejamento médico.",
        text: [
          "O posicionamento dos fios de PDO segue o planejamento feito na avaliação médica, considerando a anatomia do rosto.",
          "A indicação depende da avaliação médica.",
        ],
        image: { base: "fios-pdo", widths: [480, 800], w: 800, h: 533 },
        imageAlt: "Aplicação de fio de PDO na região do queixo.",
        pos: "55% 50%",
      },
      {
        title: "Ultraformer MPT",
        short: "Equipamento de ultrassom micro e macrofocado.",
        text: [
          "O Ultraformer MPT é um equipamento de ultrassom micro e macrofocado, usado sem cortes e sem cirurgia.",
          "A indicação e o número de sessões dependem da avaliação médica.",
        ],
        image: { base: "ultraformer-mpt", widths: [480, 800], w: 800, h: 1200 },
        imageAlt: "Aplicação do Ultraformer MPT na região do maxilar.",
        pos: "50% 55%",
      },
      {
        title: "Laser Lavieen",
        short: "Equipamento de laser aplicado na pele.",
        text: [
          "O Lavieen é um equipamento de laser aplicado na pele.",
          "A indicação, o número de sessões e os cuidados dependem da avaliação da pele e do histórico de cada pessoa.",
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
      { title: "Escolha e envie a mensagem", text: "Escolha consulta ou exame e envie a mensagem pronta pelo WhatsApp." },
      { title: "A equipe responde", text: "A equipe informa unidades, horários e valores." },
      { title: "Consulta ou exame", text: "Consulta: avaliação médica antes de qualquer indicação, com riscos e alternativas explicados. Exame: informe se tem pedido médico e pergunte sobre o preparo (como jejum)." },
    ],
  },

  faq: {
    title: "Dúvidas frequentes",
    items: [
      { q: "Onde ficam as unidades?", a: "Em Belém (R. Bernal do Couto, nº 75 - Umarizal) e em Castanhal (Av. Marechal Deodoro, nº 368 - Ianetama), no Pará." },
      { q: "Como agendo uma consulta ou exame?", a: "Pelos botões \"Agendar consulta\" e \"Agendar exame\" desta página, que abrem o WhatsApp com a mensagem pronta. É só enviar." },
      { q: "Qual o valor da consulta e dos exames?", a: "Os valores são informados pela equipe no atendimento pelo WhatsApp." },
      { q: "Vocês atendem convênio?", a: "A equipe informa no atendimento pelo WhatsApp." },
      { q: "Preciso de pedido médico para fazer exames?", a: "A equipe informa no atendimento pelo WhatsApp." },
      { q: "Preciso de jejum ou preparo?", a: "Depende do exame. A equipe informa o preparo ao agendar." },
      { q: "Como e quando recebo os resultados?", a: "A equipe informa o prazo e a forma de entrega ao agendar." },
      { q: "Posso fazer o procedimento na primeira consulta?", a: "Depende. A avaliação médica vem primeiro, e a Dra. Lenita Brasil define se há indicação no seu caso." },
      { q: "Existe garantia de resultado?", a: "Não. Procedimentos têm resposta individual e podem ter riscos e efeitos adversos. Por isso, benefícios, riscos e alternativas são explicados na consulta, antes de qualquer decisão." },
    ],
  },

  contact: {
    title: "Fale com a equipe pelo WhatsApp",
    text: "Escolha consulta ou exame para abrir o WhatsApp com a mensagem pronta, ou preencha o formulário.",
    orWhats: "Ou entre em contato pelo WhatsApp",
    submit: "Enviar",
    msgHint: "Não escreva sintomas ou dados de saúde aqui; a equipe pergunta no atendimento.",
    privacy:
      "Ao enviar, o site apenas monta uma mensagem e abre o WhatsApp com o que você preencheu; este site não guarda esses dados. Eles são usados somente para responder ao seu contato. O WhatsApp tem política de privacidade própria.",
    privacyLink: "Como este site funciona (privacidade)",
    image: { base: "contato", widths: [600, 900], w: 900, h: 1350 },
    imageAlt: "Dra. Lenita Brasil sorrindo, com as mãos sob o queixo.",
  },

  footer: {
    tagline: "Consulta médica e exames em Belém e Castanhal",
    text: "Agende pelo WhatsApp e informe a unidade de sua preferência.",
    legal: [
      "Dra. Lenita Brasil, Médica, CRM-PA 10896.",
      "Este site tem caráter informativo e não substitui consulta médica. Não há garantia de resultados; cada caso é avaliado individualmente.",
    ],
  },

  // Pagina privacidade.html: texto generico e fiel ao funcionamento do site.
  privacyPage: {
    title: "Privacidade | Dra. Lenita Brasil",
    description: "Como este site funciona e o que acontece com as informações que você preenche no formulário de contato.",
    h1: "Privacidade",
    sections: [
      { h: "Como este site funciona", p: ["Este é um site informativo. Ele não tem cadastro, login nem banco de dados próprio, e não instala cookies de análise ou de publicidade."] },
      { h: "Formulário de contato", p: [
        "O formulário não envia dados para um servidor deste site. Ao clicar em Enviar, o navegador monta uma mensagem de texto com o nome, o telefone e a mensagem que você preencheu e abre o WhatsApp para você enviá-la, se quiser.",
        "Essas informações são usadas somente para responder ao seu contato. Depois que a conversa é aberta no WhatsApp, o tratamento dos dados segue a política de privacidade do próprio WhatsApp.",
        "Não escreva sintomas ou dados de saúde no formulário; a equipe pergunta o necessário no atendimento.",
      ] },
      { h: "Links e serviços externos", p: [
        "Os botões de WhatsApp abrem o WhatsApp. Os links de endereço abrem o Google Maps. Os ícones de Instagram abrem o Instagram. Ao acessar esses serviços, vale a política de cada um.",
        "As fontes de texto deste site são servidas pelo próprio site, sem chamada ao Google Fonts.",
      ] },
      { h: "Dados técnicos de acesso", p: ["O servidor que hospeda o site pode registrar dados técnicos de acesso, como endereço IP e horário, conforme a política do provedor de hospedagem."] },
      { h: "Dúvidas", p: ["Para qualquer dúvida sobre este texto, fale com a equipe pelo WhatsApp 91 99604-0003."] },
    ],
  },
};
