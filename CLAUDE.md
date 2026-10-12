# Landing Dra. Lenita Brasil

Site estático, sem dependências (Node 18+ só para gerar o HTML). Layout baseado no wireframe `SITE2.pdf` do cliente e no MANUAL DE MARCA (ago/2025).

## Rodar
    node build.mjs                 # gera index.html e lista pendências [entre colchetes]
    python3 -m http.server 8000    # abrir http://localhost:8000

`index.html` é GERADO por `build.mjs` a partir de `src/content.mjs`. Não editar à mão.

## Onde mexer
- Cores, fontes, espaçamentos, raios, sombras: `src/tokens.css` (único lugar; `styles.css` só usa tokens).
- Textos, links, WhatsApp, procedimentos, exames, FAQ, rodapé: `src/content.mjs`.
- Estrutura/HTML: `build.mjs`. Estilos: `src/styles.css`. Interações (reveal, menu, form -> WhatsApp): `src/main.js`.
- Imagens: `assets/img/` (WebP responsivo `nome-LARGURA.webp`; `content.mjs` guarda `{base, widths, w, h}`). Logos/selo/símbolo: `assets/logo/` (SVG extraídos dos PDFs oficiais, fundo removido). Ícones: `assets/icons/` (set oficial "NOVOS ICONES", inlinados com `currentColor`).

## Marca (MANUAL DE MARCA)
- Pilares: acolhimento, sofisticação, autoridade. Epíteto: DERMATOLOGIA.
- Cores oficiais: marrom `#8C5838`, bege escuro `#F3BB90`, bege claro `#F9E4CA`, verde oliva `#424033`. Tons de apoio são derivados por `color-mix` (nunca cores novas).
- Fontes: Runalto (logotipo/títulos; comercial, NÃO está no Google Fonts -> substituta provisória Cormorant Garamond) e Nata Sans (apoio; Google Fonts, oficial). Trocar a substituta ao receber a licença/arquivo da Runalto (`--font-display` + `site.fontsUrl`).
- Logo: usar só versões oficiais (horizontal/vertical/selo/símbolo), nas cores da paleta; no escuro, versão bege (`logo-horizontal-claro.svg`). Manter área de proteção (~largura do "e" do logotipo ou 2x). Redução máxima: horizontal c/ epíteto 4 cm, sem epíteto 2 cm; vertical 1,6 cm; selo 2 cm.
- NÃO: deformar; trocar fontes; aplicar em caixas/boxes; alterar cores; dispor com elementos não previstos; usar em outline. Símbolo pode ser marca d'água/padronagem.
- Botões e FAB usam as cores da marca (marrom/oliva), não o verde do WhatsApp.

## Regras de publicidade médica (CFM, Res. 2.336/2023)
- Sem promessa/garantia de resultado, sem antes/depois, sem preço/promoção/desconto, sem superlativos ou "referência/melhor/mais completo", sem depoimentos de pacientes, sem fotos de pacientes (não há prova de autorização). Textos oficiais do cliente foram ADAPTADOS para isso; ao receber novo texto, reaplicar.
- A pasta ANTES E DEPOIS, `FOTOS RESULTADO`, cards de desconto/Check-up Rosa/Black Beauty e criativos em vídeo NÃO são usados.
- Imagens dos procedimentos são bancos de imagem (modelos) vindos de SITE/IMAGENS-HOME, conforme wireframe.
- Mostrar RQE assim que informado (`doctor.rqe`); é obrigatório ao anunciar especialidade.

## Pendências (o build lista)
domínio (`site.url`: canonical/og), CNPJ, responsável técnico (nome/CRM), RQE, horários de atendimento, links de YouTube/Facebook (ícones existem, sem URL), CEP das unidades.

## Técnica
- Animar só `transform`/`opacity`; respeitar `prefers-reduced-motion`; contraste AA; foco visível (outline com token); alvos >= 44px.
- Formulário não tem backend: monta mensagem e abre `wa.me` (nada é armazenado).
