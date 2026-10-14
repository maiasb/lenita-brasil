// Gera index.html estatico (SEO-friendly) a partir de src/content.mjs.
// Uso: node build.mjs   (sem dependencias)
import { writeFileSync, readFileSync } from "node:fs";
import c from "./src/content.mjs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const waLink = (msg = c.whatsapp.consulta.message) => `https://wa.me/${c.whatsapp.number}?text=${encodeURIComponent(msg)}`;
const mapLink = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const hasUrl = !c.site.url.includes("[");
// Especialidade so pode ser anunciada com RQE informado.
const specialty = c.doctor.rqe ? "Dermatologia" : null;

// Icones oficiais (assets/icons) inlinados com currentColor.
const svgIcon = (name, cls = "icon") => {
  const raw = readFileSync(new URL(`./assets/icons/${name}.svg`, import.meta.url), "utf8");
  const inner = raw.replace(/<\?xml[^>]*>/, "").replace(/<defs>[\s\S]*?<\/defs>/, "").replace(/\s*class="cls-\d+"/g, "").replace(/<svg[^>]*>/, "").replace("</svg>", "");
  const vb = raw.match(/viewBox="([^"]+)"/)[1];
  return `<svg class="${cls}" viewBox="${vb}" aria-hidden="true" focusable="false" fill="currentColor">${inner}</svg>`;
};

const picture = (im, alt, { sizes, eager = false, cls = "", style = "" } = {}) => {
  const ext = "webp";
  const srcset = im.widths.map((w) => `assets/img/${im.base}-${w}.${ext} ${w}w`).join(", ");
  const big = im.widths[im.widths.length - 1];
  return `<img${cls ? ` class="${cls}"` : ""} src="assets/img/${im.base}-${big}.${ext}" srcset="${srcset}" sizes="${sizes}" width="${im.w}" height="${im.h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}${style ? ` style="${style}"` : ""}>`;
};

const cta = (label, { msg, cls = "", aria = "" } = {}) =>
  `<a class="btn ${cls}" href="${waLink(msg)}"${aria ? ` aria-label="${esc(aria)}"` : ""} target="_blank" rel="noopener" data-cta>${svgIcon("whats", "btn__icon")}<span>${esc(label)}</span></a>`;

// Link de texto discreto para o WhatsApp (CTA secundario, sem peso de botao).
const tlink = (label, msg) =>
  `<a class="tlink" href="${waLink(msg)}" target="_blank" rel="noopener" data-cta>${esc(label)}<span class="sr"> (abre o WhatsApp em nova aba)</span></a>`;

// Logos SEM epiteto (nao ha RQE). Reativar a versao com epiteto so quando doctor.rqe existir.
// Tema claro: versao oficial marrom do logo horizontal.
const logoH = `<img src="assets/logo/logo-horizontal.svg" alt="Lenita Brasil" width="1732" height="319">`;

// Italico de destaque numa palavra/trecho (cor de destaque via CSS). Se o trecho nao existir, nao destaca.
const emph = (text, phrase) => { const t = esc(text); const ph = esc(phrase); return phrase && t.includes(ph) ? t.replace(ph, `<em>${ph}</em>`) : t; };
const arrow = `<span class="arr" aria-hidden="true">\u2197</span>`;
const tubeIcon = `<svg class="tube" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v11.5a2 2 0 1 0 4 0V3"/><path d="M10 11h4"/></svg>`;
const SHOW = { faq: false }; // "Como agendar" e FAQ nao existem na referencia; FAQ fica no content.mjs (reativar com true)

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Physician",
      name: c.doctor.name,
      ...(specialty ? { medicalSpecialty: "Dermatology" } : {}),
      identifier: c.doctor.crm,
      telephone: "+" + c.whatsapp.number,
      sameAs: [c.doctor.instagram],
    },
    ...c.labs.units.map((u, i) => ({
      "@type": "MedicalBusiness",
      name: `Lenita Brasil - ${u.name}`,
      telephone: "+" + c.whatsapp.number,
      address: { "@type": "PostalAddress", streetAddress: u.address.replace(" - ", ", "), addressLocality: i === 0 ? "Belém" : "Castanhal", addressRegion: "PA", addressCountry: "BR" },
      ...(hasUrl ? { url: c.site.url } : {}),
    })),
    {
      "@type": "DiagnosticLab",
      name: "Laboratórios Lenita Brasil",
      telephone: "+" + c.whatsapp.number,
      sameAs: [c.doctor.labInstagram],
    },
  ],
};
const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

// Ordem de leitura, do menu e do rodape. "Exames" vive dentro de Laboratorios (ancora #exames mantida).
const navItems = [
  { href: "#dra", label: c.ui.nav.dra },
  { href: "#clinica", label: c.ui.nav.clinica },
  { href: "#procedimentos", label: c.ui.nav.procedimentos },
  { href: "#laboratorios", label: c.ui.nav.laboratorios },
  ...(SHOW.faq ? [{ href: "#faq", label: c.faq.title }] : []),
  { href: "#contato", label: c.ui.nav.contato },
];
const barItems = navItems.filter((n) => n.href !== "#faq");

const pad = (n) => String(n + 1).padStart(2, "0");
const label = (txt) => `<span class="label">${esc(txt)}</span>`;

// Procedimento: celula da grade (numeral, nome, descricao curta, seta). Abre o painel (dialog) com texto + "Perguntar sobre X".
const procedureCell = (p, i) => `<li class="pcell-li reveal"><button class="pcell" type="button" data-dialog="pd-${i}" aria-haspopup="dialog" aria-label="${esc(p.title)}: ver detalhes">
  <span class="pcell__n" aria-hidden="true">${pad(i)}</span>
  <span class="pcell__t">${esc(p.title)}</span>
  <span class="pcell__s">${esc(p.short)}</span>
  <span class="pcell__a" aria-hidden="true">\u2197</span>
</button></li>`;
const procedureDialog = (p, i) => `<dialog class="pdialog" id="pd-${i}" aria-labelledby="pd-${i}-t">
  <div class="pdialog__in">
    <button class="pdialog__x" type="button" data-close aria-label="Fechar detalhes de ${esc(p.title)}"><span aria-hidden="true">\u00d7</span></button>
    <figure class="pdialog__fig">${picture(p.image, p.imageAlt, { sizes: "(min-width:760px) 22rem, 90vw", style: `object-position:${p.pos}` })}</figure>
    <div class="pdialog__txt"><h3 id="pd-${i}-t">${esc(p.title)}</h3>${p.text.map((t) => `<p>${esc(t)}</p>`).join("")}${cta(`Perguntar sobre ${p.title}`, { msg: `Olá! Vim pelo site e gostaria de agendar uma consulta para avaliar ${p.title}.`, cls: "btn--sm btn--alt", aria: `Perguntar pelo WhatsApp sobre ${p.title}` })}</div>
  </div>
</dialog>`;

// Laboratorios: grupo com icone de tubo, exames em linha (ponto medio) e botao secundario por grupo.
const labGroup = (g) => `<li class="lgroup reveal">
  <span class="lgroup__ico">${tubeIcon}</span>
  <div class="lgroup__body"><h4>${esc(g.title)}</h4><p class="lgroup__items">${g.items.map(esc).join(" \u00b7 ")}</p>
  ${cta(`Perguntar sobre exames ${g.title.toLowerCase()}`, { msg: `${c.whatsapp.exame.message} Tenho interesse em exames ${g.title.toLowerCase()}.`, cls: "btn--sm btn--alt", aria: `Perguntar pelo WhatsApp sobre exames ${g.title.toLowerCase()}` })}</div>
</li>`;

// Unidade: cartao fino com rotulo, endereco e "como chegar" (link).
const unitCard = (u) => `<li class="ucard reveal">
  ${label(u.name)}
  <p class="ucard__addr">${esc(u.address)}</p>
  <a class="ulink" href="${mapLink(u.mapQuery)}" target="_blank" rel="noopener">${esc(c.labs.mapLabel)}${svgIcon("loc", "ulink__ico")}<span class="sr">, ${esc(u.name)} (abre em nova aba)</span></a>
</li>`;

// Titulo do hero: a ultima parte (apos " em ") vai em italico na cor de destaque.
const [heroA, heroB] = (() => { const i = c.hero.title.lastIndexOf(" em "); return i < 0 ? [c.hero.title, ""] : [c.hero.title.slice(0, i), c.hero.title.slice(i + 1)]; })();
// Faixa rolante: lista real + duplicata aria-hidden (loop continuo; CSS para com reduced-motion).
const mq = c.hero.marquee.map((w) => `<li>${esc(w)}</li>`).join("");

const html = `<!doctype html>
<html lang="${c.site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.site.title)}</title>
<meta name="description" content="${esc(c.site.description)}">
<meta name="theme-color" content="${c.site.themeColor}">
${hasUrl ? `${c.site.canonical ? `<link rel="canonical" href="${esc(c.site.url)}">\n<meta property="og:url" content="${esc(c.site.url)}">\n` : "<!-- canonical/og:url desativados ate haver dominio proprio (site.canonical) -->\n"}<meta property="og:image" content="${esc(c.site.url + c.site.ogImage)}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="${esc(c.site.title)}">\n<meta property="og:site_name" content="Lenita Brasil">\n<meta name="twitter:image" content="${esc(c.site.url + c.site.ogImage)}">` : "<!-- canonical/og:url/og:image absoluto: definir site.url em content.mjs -->"}
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(c.site.title)}">
<meta property="og:description" content="${esc(c.site.description)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(c.site.title)}">
<meta name="twitter:description" content="${esc(c.site.description)}">
<link rel="icon" href="assets/logo/simbolo.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/nata-sans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="src/fonts.css">
<link rel="stylesheet" href="src/tokens.css">
<link rel="stylesheet" href="src/styles.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
${SHOW.faq ? `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>` : ""}
</head>
<body>
<a class="skip" href="#main">Pular para o conteúdo</a>
<header class="bar" id="topbar">
  <div class="container bar__in">
    <a class="brand" href="#top" aria-label="${esc(c.doctor.name)}, início">${logoH}</a>
    <nav class="bar__nav" aria-label="Principal"><ul>${barItems.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></nav>
    <a class="btn btn--sm bar__cta" href="${waLink()}" aria-label="${esc(c.whatsapp.consulta.label)} pelo WhatsApp" target="_blank" rel="noopener" data-cta><span>${esc(c.whatsapp.consulta.shortLabel)}</span></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-btn__t" data-open="Menu" data-close="Fechar">Menu</span><span class="menu-btn__bars" aria-hidden="true"></span></button>
  </div>
</header>
<div class="menu" id="menu" inert>
  <div class="container menu__in">
    <nav aria-label="Menu"><ul class="menu__list">${navItems.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></nav>
    <div class="menu__side"><p class="menu__tag">${esc(c.footer.tagline)}</p>
      <p><a class="phone phone--sm" href="${waLink()}" target="_blank" rel="noopener" data-cta>${svgIcon("whats", "phone__icon")}<span>${esc(c.whatsapp.display)}</span></a></p>
      <p><a class="plain" href="${c.doctor.instagram}" target="_blank" rel="noopener">${svgIcon("insta", "icon icon--sm")}${esc(c.doctor.instagramHandle)}</a></p></div>
  </div>
</div>
<main id="main">
<section id="top" class="hero">
  <div class="container hero__in">
    <div class="hero__copy">
      <p class="hero__eyebrow reveal">${label(c.hero.eyebrow)}</p>
      <h1 class="reveal">${esc(heroA)}${heroB ? ` <em>${esc(heroB)}</em>` : ""}</h1>
      <p class="hero__text reveal">${esc(c.hero.text)}</p>
      <div class="ctas reveal">${cta(c.whatsapp.consulta.label, { msg: c.whatsapp.consulta.message, cls: "btn--lg" })}<a class="btn btn--lg btn--alt" href="#procedimentos"><span>${esc(c.hero.procLink)}</span></a></div>
      <p class="hero__exams reveal"><a class="tlink" href="#exames">${esc(c.hero.examsLink)}</a></p>
    </div>
    <figure class="hero__media">${picture(c.hero.image, c.hero.imageAlt, { sizes: "(min-width:900px) 34rem, 80vw", eager: true })}
      <figcaption class="hero__cap"><strong>${esc(c.hero.caption.name)}</strong><span>${esc(c.hero.caption.role)}</span></figcaption></figure>
  </div>
</section>

<div class="marquee" role="region" aria-label="${esc(c.hero.marqueeLabel)}">
  <div class="marquee__view"><div class="marquee__track"><ul class="marquee__list">${mq}</ul><ul class="marquee__list" aria-hidden="true">${mq}</ul></div></div>
  <button class="marquee__btn" type="button" aria-pressed="false" aria-label="Pausar faixa de destaques" data-on="Pausar faixa de destaques" data-off="Retomar faixa de destaques"><span class="marquee__ico" aria-hidden="true"></span></button>
</div>

<section id="dra" class="section about" aria-labelledby="t-dra">
  <div class="container about__in">
    <figure class="about__media reveal">${picture(c.about.image, c.about.imageAlt, { sizes: "(min-width:900px) 30rem, 80vw" })}</figure>
    <div class="about__body">
    <h2 id="t-dra" class="about__label reveal">${label(c.ui.labels.dra)}</h2>
    <div class="about__copy">
      <p class="about__pull reveal">${emph(c.about.paragraphs[1], "a conversa")}</p>
      <p class="about__text reveal">${esc(c.about.paragraphs[0])}</p>
      <ul class="ficha reveal" aria-label="${esc(c.authority.title)}">${c.authority.items.map((i) => `<li><strong>${esc(i.value)}</strong><span>${esc(i.label)}</span></li>`).join("")}</ul>
      <div class="ctas reveal">${cta(c.about.cta, { msg: c.whatsapp.consulta.message, cls: "btn--alt", aria: `${c.about.cta} com a ${c.doctor.name} pelo WhatsApp` })}</div>
    </div>
    </div>
  </div>
</section>

<section id="clinica" class="section section--rose clinic" aria-labelledby="t-clinica">
  <div class="container clinic__in">
    <div class="clinic__media reveal">
      <div class="deck" data-deck role="group" aria-label="${esc(c.ui.deckLabel)}">
        ${c.labs.units.map((u, i) => `<figure class="deck__card" data-pos="${i === 0 ? "front" : "back"}" data-z="${i === 0 ? "front" : "back"}" data-name="${esc(u.name)}">${picture(u.image, u.imageAlt, { sizes: "(min-width:900px) 22rem, 70vw" })}<figcaption>${esc(u.name)}</figcaption></figure>`).join("")}
      </div>
      <p class="clinic__count"><strong>${esc(c.clinic.count.n)}</strong><span>${esc(c.clinic.count.label)}</span></p></div>
    <div class="clinic__copy">
      <p class="reveal">${label(c.ui.labels.clinica)}</p>
      <h2 id="t-clinica" class="reveal">${esc(c.clinic.title)}</h2>
      ${c.clinic.paragraphs.map((p) => `<p class="reveal">${esc(p)}</p>`).join("")}
      <ul class="ucards" id="unidades">${c.labs.units.map(unitCard).join("")}</ul>
    </div>
  </div>
</section>

<section id="procedimentos" class="section procs" aria-labelledby="t-proc">
  <div class="container">
    <header class="phead">
      <div class="phead__t reveal"><p>${label(c.ui.labels.procedimentos)}</p><h2 id="t-proc">${emph(c.procedures.lead.replace(/\.$/, ""), "procedimentos")}</h2></div>
      <p class="phead__p reveal">${esc(c.procedures.text)}</p>
    </header>
    <ol class="pgrid">${c.procedures.items.map(procedureCell).join("")}</ol>
    ${c.procedures.items.map(procedureDialog).join("\n")}
    <figure class="pbanner reveal">${picture(c.hero.wide, c.hero.wideAlt, { sizes: "(min-width:1280px) 78rem, 100vw" })}<figcaption>${esc(c.ui.proceduresBanner)}</figcaption></figure>
    <p class="note procs__note reveal">${esc(c.procedures.note.replace(c.ui.proceduresBanner, "").trim())}</p>
    <p class="reveal">${tlink(c.procedures.linkText, c.whatsapp.consulta.message)}</p>
  </div>
</section>

<section id="laboratorios" class="section section--sand labs" aria-labelledby="t-lab">
  <div class="container labs__in">
    <div class="labs__copy">
      <p class="reveal">${label(c.ui.labels.laboratorios)}</p>
      <h2 id="t-lab" class="reveal">${esc(c.labs.title)}</h2>
      <p class="reveal">${esc(c.labs.text)}</p>
      <figure class="labs__fig reveal">${picture(c.exams.image, c.exams.imageAlt, { sizes: "(min-width:900px) 38rem, 90vw" })}</figure>
    </div>
    <div id="exames" class="exams">
      <div class="exams__intro reveal"><h3>${esc(c.exams.title)}</h3><p>${esc(c.exams.text)}</p></div>
      <ul class="lgroups">${c.exams.groups.map(labGroup).join("")}</ul>
      <div class="ctas reveal">${cta(c.ui.examsButton, { msg: c.whatsapp.exame.message, cls: "btn--dark", aria: "Perguntar pelo WhatsApp sobre exames" })}</div>
    </div>
  </div>
</section>
${SHOW.faq ? `
<section id="faq" class="section section--warm faq" aria-labelledby="t-faq">
  <div class="container faq__in">
    <div class="faq__side">
      <h2 id="t-faq" class="reveal">${esc(c.faq.title)}</h2>
      <p class="reveal">${esc(c.faq.ctaText)}</p>
      <div class="reveal">${cta(c.faq.cta, { msg: c.whatsapp.consulta.message })}</div>
    </div>
    <div class="faq__list">${c.faq.items.map((f) => `<details class="reveal"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
  </div>
</section>
` : ""}
<section id="contato" class="section contact" aria-labelledby="t-contato">
  <div class="container contact__in">
    <div class="contact__copy">
      <p class="reveal">${label(c.ui.labels.contato)}</p>
      <h2 id="t-contato" class="reveal">${esc(c.contact.title)}</h2>
      <p class="reveal">${esc(c.contact.text)}</p>
      <a class="wacard reveal" href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp ${esc(c.whatsapp.display)} (abre em nova aba)" data-cta>${svgIcon("whats", "wacard__ico")}<span class="wacard__t"><span class="label">WhatsApp</span><span class="wacard__n">${esc(c.whatsapp.display)}</span></span></a>
    </div>
    <form class="form reveal" id="form" action="${waLink()}" method="get" data-wa="${c.whatsapp.number}" novalidate>
      <div class="field"><label for="f-nome">Seu nome</label><input id="f-nome" name="nome" type="text" autocomplete="name" required></div>
      <div class="field"><label for="f-tel">Seu telefone</label><input id="f-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel"></div>
      <div class="field"><label for="f-msg">Mensagem</label><textarea id="f-msg" name="msg" rows="3" aria-describedby="f-msg-hint"></textarea><p class="field__hint" id="f-msg-hint">${esc(c.contact.msgHint)}</p></div>
      <p class="form__status" id="form-status" role="status" aria-live="polite"></p>
      <p class="note">${esc(c.contact.privacy)} <a href="privacidade.html">${esc(c.contact.privacyLink)}</a>.</p>
      <button class="btn btn--dark btn--send" type="submit"><span>${esc(c.contact.submit)}</span><span class="arr" aria-hidden="true">\u2192</span></button>
    </form>
  </div>
</section>
</main>

<footer class="footer">
  <div class="container footer__in">
    <div class="footer__brand"><div class="footer__logo">${logoH}</div><p>${esc(c.footer.tagline)}. ${esc(c.footer.text)}</p></div>
    <nav aria-label="Rodapé"><h2 class="footer__h">${label(c.ui.navTitle)}</h2><ul class="footer__nav"><li><a href="#top">Início</a></li>${navItems.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></nav>
    <div class="footer__units"><h2 class="footer__h">${label(c.ui.unitsTitle)}</h2>${c.labs.units.map((u) => `<p><strong>${esc(u.name)}</strong><br>${esc(u.address)}</p>`).join("")}</div>
    <div class="footer__social"><h2 class="footer__h">${label(c.ui.socialTitle)}</h2><ul>
      <li><a href="${c.doctor.instagram}" target="_blank" rel="noopener">${svgIcon("insta", "icon icon--sm")}${esc(c.doctor.instagramHandle)}</a></li>
      <li><a href="${c.doctor.labInstagram}" target="_blank" rel="noopener">${svgIcon("insta", "icon icon--sm")}${esc(c.doctor.labInstagramHandle)}</a></li>
      <li><a href="${waLink()}" target="_blank" rel="noopener" data-cta>${svgIcon("whats", "icon icon--sm")}${esc(c.whatsapp.display)}</a></li></ul></div>
  </div>
  <div class="container footer__legal">${c.footer.legal.map((l) => `<p>${esc(l)}</p>`).join("")}${c.doctor.rqe ? `<p>${esc(c.doctor.rqe)}</p>` : ""}<p><a href="privacidade.html">Privacidade</a></p></div>
</footer>

<a class="fab" href="${waLink()}" target="_blank" rel="noopener" aria-label="${esc(c.whatsapp.consulta.label)} pelo WhatsApp" data-cta>${svgIcon("whats", "fab__icon")}<span class="fab__t">${esc(c.whatsapp.consulta.label)}</span></a>
<script src="src/main.js" defer></script>
</body>
</html>
`;
writeFileSync(new URL("./index.html", import.meta.url), html);

// privacidade.html: pagina simples, mesma identidade visual.
const pp = c.privacyPage;
writeFileSync(new URL("./privacidade.html", import.meta.url), `<!doctype html>
<html lang="${c.site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(pp.title)}</title>
<meta name="description" content="${esc(pp.description)}">
<meta name="theme-color" content="${c.site.themeColor}">
<link rel="icon" href="assets/logo/simbolo.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/nata-sans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="src/fonts.css">
<link rel="stylesheet" href="src/tokens.css">
<link rel="stylesheet" href="src/styles.css">
</head>
<body>
<header class="bar is-stuck"><div class="container bar__in"><a class="brand" href="./" aria-label="${esc(c.doctor.name)}, início">${logoH}</a></div></header>
<main id="main" class="section prose"><div class="container">
<h1>${esc(pp.h1)}</h1>
${pp.sections.map((x) => `<h2>${esc(x.h)}</h2>${x.p.map((t) => `<p>${esc(t)}</p>`).join("")}`).join("\n")}
<p><a class="pill" href="./">Voltar ao site</a></p>
</div></main>
<footer class="footer"><div class="container footer__legal"><p>${esc(c.footer.legal[0])}</p></div></footer>
</body>
</html>
`);
if (hasUrl) {
  writeFileSync(new URL("./robots.txt", import.meta.url), `User-agent: *\nAllow: /\n\nSitemap: ${c.site.url}sitemap.xml\n`);
  writeFileSync(new URL("./sitemap.xml", import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${c.site.url}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`);
}

// Lista placeholders [entre colchetes] e pendencias para o relatorio.
const found = new Set();
(function walk(o) { if (typeof o === "string") { (o.match(/\[[^\]]+\]/g) || []).forEach((m) => found.add(m)); } else if (o && typeof o === "object") Object.values(o).forEach(walk); })(c);
if (!c.doctor.rqe) found.add("RQE nao informado (doctor.rqe): especialidade e epiteto ocultos");
console.log("index.html e privacidade.html gerados.\nPendentes/ocultos (" + found.size + "):\n- " + [...found].join("\n- "));
console.log("- Ocultos por falta de dado: CNPJ, responsavel tecnico, horarios, convenios, prazo de resultado, formacao/sociedades, YouTube/Facebook, CEP, dominio proprio (canonical).");
