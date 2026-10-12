// Gera index.html estatico (SEO-friendly) a partir de src/content.mjs.
// Uso: node build.mjs   (sem dependencias)
import { writeFileSync, readFileSync } from "node:fs";
import c from "./src/content.mjs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const waLink = (msg = c.whatsapp.message) => `https://wa.me/${c.whatsapp.number}?text=${encodeURIComponent(msg)}`;
const mapLink = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const hasUrl = !c.site.url.includes("[");

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

const cta = (label, { msg, cls = "" } = {}) =>
  `<a class="btn ${cls}" href="${waLink(msg)}" target="_blank" rel="noopener" data-cta>${svgIcon("whats", "btn__icon")}<span>${esc(label)}</span></a>`;

const section = (id, cls, inner, labelledby) =>
  `<section id="${id}" class="section ${cls}"${labelledby ? ` aria-labelledby="${labelledby}"` : ""}><div class="container">${inner}</div></section>`;

const logoH = `<img src="assets/logo/logo-horizontal.svg" alt="Lenita Brasil Dermatologia" width="1732" height="319">`;
const logoV = `<img src="assets/logo/logo-vertical.svg" alt="Lenita Brasil Dermatologia" width="705" height="955">`;

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
      medicalSpecialty: "Dermatology",
      identifier: c.doctor.crm,
      telephone: "+" + c.whatsapp.number,
      sameAs: [c.doctor.instagram],
    },
    ...c.labs.units.map((u, i) => ({
      "@type": "MedicalClinic",
      name: `Clínica Lenita Brasil - ${u.name}`,
      description: c.site.description,
      telephone: "+" + c.whatsapp.number,
      medicalSpecialty: "Dermatology",
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

const procedureCard = (p) => `<li class="proc reveal">
  <div class="proc__img">${picture(p.image, p.imageAlt, { sizes: "(min-width:960px) 280px, (min-width:600px) 45vw, 90vw", style: `object-position:${p.pos}` })}</div>
  <h3>${esc(p.title)}</h3>
  <p class="proc__short">${esc(p.short)}</p>
  <details class="proc__more"><summary>Saiba mais</summary>
    <div>${p.text.map((t) => `<p>${esc(t)}</p>`).join("")}${cta(c.procedures.cta, { msg: `Olá! Vim pelo site e gostaria de agendar uma avaliação sobre ${p.title}.`, cls: "btn--sm" })}</div>
  </details>
</li>`;

const examGroup = (g) => `<details class="exam reveal"><summary><span>${esc(g.title)}</span></summary>
  <ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
  ${cta(c.exams.cta, { msg: `Olá! Vim pelo site e gostaria de agendar exames (${g.title.toLowerCase()}).`, cls: "btn--sm btn--light" })}
</details>`;

const unitCard = (u) => `<article class="unit reveal">
  <figure>${picture(u.image, u.imageAlt, { sizes: "(min-width:760px) 45vw, 90vw" })}<figcaption class="chip">${esc(u.name)}</figcaption></figure>
  <p class="unit__addr">${esc(u.address)}</p>
  <a class="pill" href="${mapLink(u.mapQuery)}" target="_blank" rel="noopener">${svgIcon("loc")}<span>${esc(c.labs.mapLabel)}<span class="sr"> - ${esc(u.name)} (abre em nova aba)</span></span></a>
</article>`;

const rqe = c.doctor.rqe ? ` · ${c.doctor.rqe}` : "";

const html = `<!doctype html>
<html lang="${c.site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.site.title)}</title>
<meta name="description" content="${esc(c.site.description)}">
<meta name="theme-color" content="${c.site.themeColor}">
${hasUrl ? `<link rel="canonical" href="${esc(c.site.url)}">\n<meta property="og:url" content="${esc(c.site.url)}">\n<meta property="og:image" content="${esc(c.site.url + c.site.ogImage)}">` : "<!-- canonical/og:url/og:image absoluto: definir site.url em content.mjs -->"}
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(c.site.title)}">
<meta property="og:description" content="${esc(c.site.description)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/logo/simbolo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${c.site.fontsUrl}">
<link rel="stylesheet" href="src/tokens.css">
<link rel="stylesheet" href="src/styles.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
</head>
<body>
<a class="skip" href="#main">Pular para o conteúdo</a>
<header class="topbar" id="topbar">
  <div class="container topbar__in">
    <a class="brand" href="#top" aria-label="${esc(c.doctor.name)} - início">${logoH}</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav"><span class="menu-btn__bars" aria-hidden="true"></span><span class="sr">Menu</span></button>
    <nav class="nav" id="nav" aria-label="Principal"><ul>${c.nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></nav>
    ${socials}
  </div>
</header>
<main id="main">
<section id="top" class="hero">
  <div class="hero__bg">${picture(c.hero.image, c.hero.imageAlt, { sizes: "(min-width:760px) 100vw, 200vw", eager: true })}</div>
  <div class="container hero__in">
    <div class="hero__copy">
      <h1 class="reveal">${esc(c.hero.title)}</h1>
      <p class="hero__text reveal">${esc(c.hero.text)}</p>
      <div class="reveal">${cta(c.hero.cta, { cls: "btn--lg" })}</div>
      <ul class="badges reveal">${c.hero.badges.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
    </div>
  </div>
</section>

<section class="authority" aria-label="${esc(c.authority.title)}">
  <div class="container"><ul class="stats">${c.authority.items.map((i) => `<li class="reveal"><strong>${esc(i.value)}</strong><span>${esc(i.label)}</span></li>`).join("")}</ul></div>
</section>

<section id="dra" class="section section--rose about" aria-labelledby="t-dra">
  <div class="container about__in">
    <figure class="about__media reveal">${picture(c.about.image, c.about.imageAlt, { sizes: "(min-width:880px) 608px, 90vw" })}</figure>
    <div class="about__copy">
      <h2 id="t-dra" class="reveal">${esc(c.about.title)}</h2>
      ${c.about.paragraphs.map((p) => `<p class="reveal">${esc(p)}</p>`).join("")}
      <ul class="facts reveal">${c.about.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      <div class="reveal">${cta(c.about.cta, { cls: "btn--dark" })}</div>
    </div>
  </div>
</section>

<section id="clinica" class="section clinic" aria-labelledby="t-clinica">
  <div class="container clinic__in">
    <div class="clinic__copy">
      <h2 id="t-clinica" class="reveal">${esc(c.clinic.title)}</h2>
      ${c.clinic.paragraphs.map((p) => `<p class="reveal">${esc(p)}</p>`).join("")}
      <p class="reveal"><a class="pill" href="#laboratorios">${esc(c.clinic.cta)}</a></p>
    </div>
    <figure class="clinic__media reveal">${picture(c.clinic.image, c.clinic.imageAlt, { sizes: "(min-width:880px) 480px, 90vw" })}</figure>
  </div>
</section>

<section id="procedimentos" class="section section--warm" aria-labelledby="t-proc">
  <div class="container">
    <header class="section__head center reveal"><h2 id="t-proc">${esc(c.procedures.title)}</h2><p>${esc(c.procedures.text)}</p><p class="lead">${esc(c.procedures.lead)}</p></header>
    <ul class="procs">${c.procedures.items.map(procedureCard).join("")}</ul>
    <p class="note center reveal">${esc(c.procedures.note)}</p>
    <div class="center reveal">${cta(c.procedures.cta, { cls: "btn--lg" })}</div>
  </div>
</section>

<section id="laboratorios" class="section" aria-labelledby="t-lab">
  <div class="container">
    <header class="section__head center reveal"><h2 id="t-lab">${esc(c.labs.title)}</h2><p>${esc(c.labs.text)}</p></header>
    <div class="units">${c.labs.units.map(unitCard).join("")}</div>
  </div>
</section>

<section id="exames" class="section section--dark exams" aria-labelledby="t-exames">
  <div class="container">
    <header class="section__head center reveal"><h2 id="t-exames">${esc(c.exams.title)}</h2><p>${esc(c.exams.text)}</p></header>
    <div class="exams__grid">${c.exams.groups.map(examGroup).join("")}</div>
  </div>
</section>

<section id="como-agendar" class="section section--warm" aria-labelledby="t-steps">
  <div class="container">
    <header class="section__head center reveal"><h2 id="t-steps">${esc(c.steps.title)}</h2></header>
    <ol class="steps">${c.steps.items.map((s, i) => `<li class="step reveal"><span class="step__n" aria-hidden="true">${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
    <div class="center reveal">${cta(c.steps.cta)}</div>
  </div>
</section>

<section id="faq" class="section" aria-labelledby="t-faq">
  <div class="container">
    <header class="section__head center reveal"><h2 id="t-faq">${esc(c.faq.title)}</h2></header>
    <div class="faq">${c.faq.items.map((f) => `<details class="reveal"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
  </div>
</section>

<section id="contato" class="section section--rose contact" aria-labelledby="t-contato">
  <div class="container contact__in">
    <figure class="contact__media reveal">${picture(c.contact.image, c.contact.imageAlt, { sizes: "(min-width:880px) 340px, 60vw" })}</figure>
    <div class="contact__copy">
      <h2 id="t-contato" class="reveal">${esc(c.contact.title)}</h2>
      <p class="reveal">${esc(c.contact.text)}</p>
      <p class="reveal">${esc(c.contact.orWhats)}</p>
      <p class="reveal"><a class="phone" href="${waLink()}" target="_blank" rel="noopener" data-cta>${svgIcon("whats", "phone__icon")}<span>${esc(c.whatsapp.display)}</span></a></p>
    </div>
    <form class="form reveal" id="form" action="${waLink()}" method="get" data-wa="${c.whatsapp.number}" novalidate>
      <div class="field"><label for="f-nome">Seu nome</label><input id="f-nome" name="nome" type="text" autocomplete="name" required></div>
      <div class="field"><label for="f-email">Seu e-mail</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
      <div class="field"><label for="f-tel">Seu telefone</label><input id="f-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel"></div>
      <div class="field"><label for="f-msg">Mensagem</label><textarea id="f-msg" name="msg" rows="3"></textarea></div>
      <p class="form__status" id="form-status" role="status" aria-live="polite"></p>
      <p class="note">${esc(c.contact.privacy)}</p>
      <button class="btn btn--dark" type="submit"><span>${esc(c.contact.submit)}</span></button>
    </form>
  </div>
</section>
</main>

<footer class="footer">
  <div class="container footer__in">
    <div class="footer__logo">${logoV}</div>
    <nav aria-label="Rodapé"><ul class="footer__nav"><li><a href="#top">Home</a></li>${c.nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></nav>
    <div class="footer__about"><p class="footer__tag">${esc(c.footer.tagline)}</p><p>${esc(c.footer.text)}</p>
      <p><a class="phone phone--sm" href="${waLink()}" target="_blank" rel="noopener" data-cta>${svgIcon("whats", "phone__icon")}<span>${esc(c.whatsapp.display)}</span></a></p></div>
    <div class="footer__units">${c.labs.units.map((u) => `<p><span class="chip chip--outline">${esc(u.name)}</span><br>${esc(u.address)}</p>`).join("")}
      <p class="footer__ig"><a href="${c.doctor.instagram}" target="_blank" rel="noopener">${svgIcon("insta", "icon icon--sm")}${esc(c.doctor.instagramHandle)}</a><br><a href="${c.doctor.labInstagram}" target="_blank" rel="noopener">${svgIcon("insta", "icon icon--sm")}${esc(c.doctor.labInstagramHandle)}</a></p></div>
  </div>
  <div class="container footer__legal">${c.footer.legal.map((l) => `<p>${esc(l)}</p>`).join("")}${rqe ? `<p>${esc(c.doctor.rqe)}</p>` : ""}</div>
</footer>

<a class="fab" href="${waLink()}" target="_blank" rel="noopener" aria-label="${esc(c.whatsapp.label)} pelo WhatsApp" data-cta>${svgIcon("whats", "fab__icon")}<span class="fab__t">Fale conosco</span></a>
<script src="src/main.js" defer></script>
</body>
</html>
`;
writeFileSync(new URL("./index.html", import.meta.url), html);

// Lista placeholders [entre colchetes] e pendencias para o relatorio.
const found = new Set();
(function walk(o) { if (typeof o === "string") { (o.match(/\[[^\]]+\]/g) || []).forEach((m) => found.add(m)); } else if (o && typeof o === "object") Object.values(o).forEach(walk); })(c);
if (!c.doctor.rqe) found.add("[RQE nao informado: doctor.rqe]");
console.log("index.html gerado.\nPendentes (" + found.size + "):\n- " + [...found].join("\n- "));
