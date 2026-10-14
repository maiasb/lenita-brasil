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

const section = (id, cls, inner, labelledby) =>
  `<section id="${id}" class="section ${cls}"${labelledby ? ` aria-labelledby="${labelledby}"` : ""}><div class="container">${inner}</div></section>`;

// Logos SEM epiteto (nao ha RQE). Reativar a versao com epiteto so quando doctor.rqe existir.
// Tema escuro: sempre a versao clara (bege) do logo horizontal.
const logoH = `<img src="assets/logo/logo-horizontal-claro.svg" alt="Lenita Brasil" width="1732" height="319">`;
// Rodape escuro: logo horizontal claro (o vertical so existe em marrom, sem contraste sobre oliva escuro).
const logoV = logoH;

// CTA generico unico: consulta. Exame so na secao Exames (botoes por grupo, link de texto) e no menu.
const ctaMain = ({ cls = "", wrap = "ctas reveal" } = {}) =>
  `<div class="${wrap}">${cta(c.whatsapp.consulta.label, { msg: c.whatsapp.consulta.message, cls })}</div>`;

const socials = `<ul class="social">
  <li><a href="${c.doctor.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${c.doctor.instagramHandle}">${svgIcon("insta")}</a></li>
  <li><a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp ${c.whatsapp.display}" data-cta>${svgIcon("whats")}</a></li>
</ul>`;

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
const navLabel = Object.fromEntries(c.nav.map((n) => [n.href, n.label]));
const navItems = [
  { href: "#como-agendar", label: c.steps.title },
  { href: "#dra", label: navLabel["#dra"] },
  { href: "#clinica", label: navLabel["#clinica"] },
  { href: "#procedimentos", label: navLabel["#procedimentos"] },
  { href: "#laboratorios", label: navLabel["#laboratorios"] },
  { href: "#faq", label: c.faq.title },
  { href: "#contato", label: navLabel["#contato"] },
];
// Links da barra superior (desktop): os cinco blocos de conteudo + contato.
const barItems = navItems.filter((n) => !["#como-agendar", "#faq"].includes(n.href));

const pad = (n) => String(n + 1).padStart(2, "0");

// Procedimento: linha editorial numerada + painel (details exclusivo por name, acessivel sem JS).
const procedureRow = (p, i) => `<li class="prow reveal">
  <details class="pdet" name="procedimento"${i === 0 ? " open" : ""}>
    <summary class="prow__sum"><span class="prow__n" aria-hidden="true">${pad(i)}</span><span class="prow__thumb" aria-hidden="true">${picture(p.image, "", { sizes: "6rem", style: `object-position:${p.pos}` })}</span><h3 class="prow__t">${esc(p.title)}</h3><span class="prow__s">${esc(p.short)}</span><span class="prow__i" aria-hidden="true"></span></summary>
    <div class="pdet__body">
      <figure class="pdet__fig">${picture(p.image, p.imageAlt, { sizes: "(min-width:760px) 14rem, 60vw", style: `object-position:${p.pos}` })}</figure>
      <div class="pdet__txt">${p.text.map((t) => `<p>${esc(t)}</p>`).join("")}${cta(`Perguntar sobre ${p.title}`, { msg: `Olá! Vim pelo site e gostaria de agendar uma consulta para avaliar ${p.title}.`, cls: "btn--sm btn--alt", aria: `Perguntar pelo WhatsApp sobre ${p.title}` })}</div>
    </div>
  </details>
</li>`;

// Laboratorios: cartao por categoria de exames (tudo visivel) + botao secundario por grupo.
const labCard = (g) => `<li class="lcard reveal">
  <div class="lcard__h"><h4>${esc(g.title)}</h4><p>${g.items.length} exames</p></div>
  <ul class="lcard__list">${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
  ${cta(`Perguntar sobre exames ${g.title.toLowerCase()}`, { msg: `${c.whatsapp.exame.message} Tenho interesse em exames ${g.title.toLowerCase()}.`, cls: "btn--sm btn--alt", aria: `Perguntar pelo WhatsApp sobre exames ${g.title.toLowerCase()}` })}
</li>`;

// Unidade: cartao com foto, endereco e link "como chegar".
const unitRow = (u) => `<li class="lunit reveal">
  <figure class="lunit__fig">${picture(u.image, u.imageAlt, { sizes: "(min-width:760px) 34rem, 90vw" })}</figure>
  <div class="lunit__txt"><h3>${esc(u.name)}</h3><p>${esc(u.address)}</p>
  <a class="pill" href="${mapLink(u.mapQuery)}" target="_blank" rel="noopener">${svgIcon("loc")}<span>${esc(c.labs.mapLabel)}<span class="sr"> - ${esc(u.name)} (abre em nova aba)</span></span></a></div>
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
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
</head>
<body>
<a class="skip" href="#main">Pular para o conteúdo</a>
<header class="bar" id="topbar">
  <div class="container bar__in">
    <a class="brand" href="#top" aria-label="${esc(c.doctor.name)} - início">${logoH}</a>
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
      <p class="hero__eyebrow reveal">${esc(c.hero.eyebrow)}</p>
      <h1 class="reveal">${esc(heroA)}${heroB ? ` <em>${esc(heroB)}</em>` : ""}</h1>
      <p class="hero__text reveal">${esc(c.hero.text)}</p>
      ${ctaMain({ cls: "btn--lg" })}
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

<section id="como-agendar" class="section steps" aria-labelledby="t-steps">
  <div class="container">
    <header class="head reveal"><h2 id="t-steps">${esc(c.steps.title)}</h2></header>
    <ol class="timeline">${c.steps.items.map((s, i) => `<li class="tl reveal"><span class="tl__mark" aria-hidden="true"></span><span class="tl__n" aria-hidden="true">${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
    ${ctaMain()}
  </div>
</section>

<section id="dra" class="section section--rose about" aria-labelledby="t-dra">
  <div class="container about__in">
    <figure class="about__media reveal">${picture(c.about.image, c.about.imageAlt, { sizes: "(min-width:880px) 30rem, 90vw" })}</figure>
    <div class="about__copy">
      <h2 id="t-dra" class="reveal">${esc(c.about.title)}</h2>
      <p class="about__pull reveal">${esc(c.about.paragraphs[1])}</p>
      <p class="reveal">${esc(c.about.paragraphs[0])}</p>
      <ul class="ficha reveal" aria-label="${esc(c.authority.title)}">${c.authority.items.map((i) => `<li><strong>${esc(i.value)}</strong><span>${esc(i.label)}</span></li>`).join("")}</ul>
      <div class="ctas reveal">${cta(c.about.cta, { msg: c.whatsapp.consulta.message })}</div>
    </div>
  </div>
</section>

<section id="clinica" class="section clinic" aria-labelledby="t-clinica">
  <div class="container">
    <header class="head reveal"><h2 id="t-clinica">${esc(c.clinic.title)}</h2><div class="head__aside">${c.clinic.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div></header>
    <ul class="lunits" id="unidades">${c.labs.units.map(unitRow).join("")}</ul>
  </div>
</section>

<section id="procedimentos" class="section section--warm procs" aria-labelledby="t-proc">
  <div class="container">
    <header class="head reveal"><h2 id="t-proc">${esc(c.procedures.title)}</h2><div class="head__aside"><p>${esc(c.procedures.text)}</p><p class="lead">${esc(c.procedures.lead)}</p></div></header>
    <ol class="plist">${c.procedures.items.map(procedureRow).join("")}</ol>
    <p class="note procs__note reveal">${esc(c.procedures.note)}</p>
    <p class="reveal">${tlink(c.procedures.linkText, c.whatsapp.consulta.message)}</p>
  </div>
</section>

<section id="laboratorios" class="section labs" aria-labelledby="t-lab">
  <div class="container">
    <header class="head reveal"><h2 id="t-lab">${esc(c.labs.title)}</h2><div class="head__aside"><p>${esc(c.labs.text)}</p></div></header>
    <div id="exames" class="exams">
      <div class="exams__intro reveal"><h3>${esc(c.exams.title)}</h3><p>${esc(c.exams.text)}</p></div>
      <ul class="lgrid">${c.exams.groups.map(labCard).join("")}</ul>
      <p class="exams__more reveal">${tlink(c.exams.linkText, c.whatsapp.exame.message)}</p>
    </div>
  </div>
</section>

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

<section id="contato" class="section section--rose contact" aria-labelledby="t-contato">
  <div class="container contact__in">
    <div class="contact__copy">
      <h2 id="t-contato" class="reveal">${esc(c.contact.title)}</h2>
      <p class="reveal">${esc(c.contact.text)}</p>
      ${ctaMain()}
      <p class="contact__or reveal">${esc(c.contact.orWhats)}</p>
      <p class="reveal"><a class="phone" href="${waLink()}" target="_blank" rel="noopener" data-cta>${svgIcon("whats", "phone__icon")}<span>${esc(c.whatsapp.display)}</span></a></p>
    </div>
    <form class="form reveal" id="form" action="${waLink()}" method="get" data-wa="${c.whatsapp.number}" novalidate>
      <div class="field"><label for="f-nome">Seu nome</label><input id="f-nome" name="nome" type="text" autocomplete="name" required></div>
      <div class="field"><label for="f-tel">Seu telefone</label><input id="f-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel"></div>
      <div class="field"><label for="f-msg">Mensagem</label><textarea id="f-msg" name="msg" rows="3" aria-describedby="f-msg-hint"></textarea><p class="field__hint" id="f-msg-hint">${esc(c.contact.msgHint)}</p></div>
      <p class="form__status" id="form-status" role="status" aria-live="polite"></p>
      <p class="note">${esc(c.contact.privacy)} <a href="privacidade.html">${esc(c.contact.privacyLink)}</a>.</p>
      <button class="btn" type="submit"><span>${esc(c.contact.submit)}</span></button>
    </form>
  </div>
</section>
</main>

<footer class="footer">
  <div class="container footer__in">
    <div class="footer__logo">${logoV}</div>
    <nav aria-label="Rodapé"><ul class="footer__nav"><li><a href="#top">Início</a></li>${navItems.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></nav>
    <div class="footer__about"><p class="footer__tag">${esc(c.footer.tagline)}</p><p>${esc(c.footer.text)}</p>
      <p><a class="phone phone--sm" href="${waLink()}" target="_blank" rel="noopener" data-cta>${svgIcon("whats", "phone__icon")}<span>${esc(c.whatsapp.display)}</span></a></p></div>
    <div class="footer__units">${c.labs.units.map((u) => `<p><span class="chip chip--outline">${esc(u.name)}</span><br>${esc(u.address)}</p>`).join("")}
      <p class="footer__ig"><a href="${c.doctor.instagram}" target="_blank" rel="noopener">${svgIcon("insta", "icon icon--sm")}${esc(c.doctor.instagramHandle)}</a><br><a href="${c.doctor.labInstagram}" target="_blank" rel="noopener">${svgIcon("insta", "icon icon--sm")}${esc(c.doctor.labInstagramHandle)}</a></p></div>
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
<header class="bar is-stuck"><div class="container bar__in"><a class="brand" href="./" aria-label="${esc(c.doctor.name)} - início">${logoH}</a></div></header>
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
