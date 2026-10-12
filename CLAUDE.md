# Landing Dra. Lenita Brasil

Site estático, sem dependências (Node 18+ só para gerar o HTML). Layout baseado no wireframe `SITE2.pdf` do cliente e no MANUAL DE MARCA (ago/2025).

## Rodar
    node build.mjs                 # gera index.html e privacidade.html
    python3 -m http.server 8000    # abrir http://localhost:8000

`index.html` e `privacidade.html` são GERADOS por `build.mjs` a partir de `src/content.mjs`. Não editar à mão.

## Onde mexer
- Cores, fontes, espaçamentos, raios, sombras: `src/tokens.css` (único lugar; `styles.css` só usa tokens).
- Textos, links, WhatsApp, procedimentos, exames, FAQ, rodapé: `src/content.mjs`.
- Estrutura/HTML: `build.mjs`. Estilos: `src/styles.css`. Interações (reveal, menu, form -> WhatsApp): `src/main.js`.
- Imagens: `assets/img/` (WebP responsivo `nome-LARGURA.webp`; `content.mjs` guarda `{base, widths, w, h}`). Logos/selo/símbolo: `assets/logo/` (SVG extraídos dos PDFs oficiais, fundo removido). Ícones: `assets/icons/` (set oficial "NOVOS ICONES", inlinados com `currentColor`).

## Marca (MANUAL DE MARCA)
- Pilares da marca: acolhimento, sofisticação, autoridade (uso INTERNO; não escrever esses termos na copy). Epíteto DERMATOLOGIA: NÃO usar enquanto não houver RQE; logos em `assets/logo/` já estão sem epíteto (os arquivos com epíteto estão no git; restaurar só com `doctor.rqe` preenchido).
- Cores oficiais: marrom `#8C5838`, bege escuro `#F3BB90`, bege claro `#F9E4CA`, verde oliva `#424033`. Tons de apoio são derivados por `color-mix` (nunca cores novas).
- Fontes (self-hosted em `assets/fonts/` + `src/fonts.css`, sem chamada ao Google Fonts): Runalto (logotipo/títulos; comercial, NÃO está no Google Fonts -> substituta provisória Cormorant Garamond) e Nata Sans (apoio; Google Fonts, oficial). Trocar a substituta ao receber a licença/arquivo da Runalto (`--font-display` + `src/fonts.css`).
- Logo: usar só versões oficiais (horizontal/vertical/selo/símbolo), nas cores da paleta; no escuro, versão bege (`logo-horizontal-claro.svg`). Manter área de proteção (~largura do "e" do logotipo ou 2x). Redução máxima: horizontal c/ epíteto 4 cm, sem epíteto 2 cm; vertical 1,6 cm; selo 2 cm.
- NÃO: deformar; trocar fontes; aplicar em caixas/boxes; alterar cores; dispor com elementos não previstos; usar em outline. Símbolo pode ser marca d'água/padronagem.
- Botões e FAB usam as cores da marca (marrom/oliva), não o verde do WhatsApp.

## Regras de publicidade médica (CFM, Res. 2.336/2023)
- Sem promessa/garantia de resultado, sem antes/depois, sem preço/promoção/desconto, sem superlativos ou "referência/melhor/mais completo", sem depoimentos de pacientes, sem fotos de pacientes (não há prova de autorização). Textos oficiais do cliente foram ADAPTADOS para isso; ao receber novo texto, reaplicar.
- A pasta ANTES E DEPOIS, `FOTOS RESULTADO`, cards de desconto/Check-up Rosa/Black Beauty e criativos em vídeo NÃO são usados.
- Imagens dos procedimentos são bancos de imagem (modelos) vindos de SITE/IMAGENS-HOME, conforme wireframe.
- Mostrar RQE assim que informado (`doctor.rqe`); é obrigatório ao anunciar especialidade. Sem autopromoção (autoridade, sofisticação, exclusivo, avançado, melhor).

## Ocultado por falta de dado (reativar quando o cliente enviar)
Regra: nenhum placeholder visível. Itens ocultos/reescritos:
- RQE (`doctor.rqe`): sem ele, não se anuncia "Dermatologia" (copy, badges, title/meta/OG, JSON-LD `medicalSpecialty`, alt, logo com epíteto). Preenchendo, o build exibe o RQE e inclui medicalSpecialty; reativar logo com epíteto e copy de especialidade manualmente.
- CNPJ e responsável técnico (nome/CRM): removidos do rodapé.
- Horários de atendimento, convênios, exigência de pedido médico, preparo/jejum por exame, prazo e forma de entrega de resultados: FAQ diz "A equipe informa no atendimento pelo WhatsApp".
- Formação, sociedades e currículo da Dra.: omitidos na seção Sobre.
- YouTube/Facebook: sem URL, ícones não exibidos (`assets/icons/youtube.svg` existe).
- CEP das unidades; domínio próprio (`site.url` aponta ao GitHub Pages; `site.canonical:false` mantém canonical/og:url desativados).
- Frase "Conteúdo elaborado conforme a Resolução CFM nº 2.336/2023" removida do rodapé (autodeclaração) - decisão a confirmar com o cliente.

## Fluxos
- Um único CTA genérico por bloco (hero, "Como agendar", contato): "Agendar consulta" (`whatsapp.consulta`), preenchido. NÃO há botão genérico "Agendar exame". `whatsapp.exame.message` só é usada na seção Exames (botões por grupo e `tlink`).
- Exames: caminho pelo item "Exames" do menu (`#exames`), pelos botões por grupo, pelo link de texto da seção, pelo FAQ e, no hero, pelo link interno discreto `hero.examsLink` (âncora `#exames`, não wa.me).
- Regra de CTAs (hierarquia): no máximo 3 botões genéricos de consulta PREENCHIDOS entre o hero e o contato (hoje: Sobre, Como agendar, após o FAQ), mais o do hero, o do contato e o FAB. Nunca dois botões lado a lado competindo.
- Botões por procedimento e por grupo de exame: secundários (contorno, `btn--alt` / `btn--alt-light`), rótulo distinto "Perguntar sobre X" e `aria-label` contextual ("Perguntar pelo WhatsApp sobre X"); mensagens específicas. Não repetir o mesmo rótulo; sem superlativos/promessas.
- Telefone/ícone de WhatsApp (contato, rodapé, redes) são links, não botões. Novo CTA genérico só onde há decisão; caso contrário, `tlink`.
- Formulário sem e-mail; aviso de não escrever dados de saúde; `privacidade.html` (gerada pelo build) descreve o funcionamento real do site.

## Técnica
- Alinhamento de CTAs: no desktop o botão acompanha o texto do bloco (texto à esquerda → botão na mesma borda do título; bloco `.center` → centralizado; nunca `justify-self:end`). Exceções centralizadas em todos os breakpoints: o CTA "Ver endereços" da Clínica (`.clinic__cta`, linha própria centralizada abaixo de texto+imagem) e todo o rodapé (`.footer`, blocos em grid de colunas iguais com conteúdo centralizado; também em `privacidade.html`). No celular (<=600px) todo `.btn` é largura total (máx. 24rem, centralizado, alvo >= 44px) e `tlink` centralizado.
- Animar só `transform`/`opacity`; respeitar `prefers-reduced-motion`; contraste AA; foco visível (outline com token); alvos >= 44px.
- Formulário não tem backend: monta mensagem e abre `wa.me` (nada é armazenado).
