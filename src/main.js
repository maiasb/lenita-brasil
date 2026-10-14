// Interacoes leves, sem dependencias: reveal on scroll, menu em tela cheia, barra, formulario -> WhatsApp.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("is-in"));
  } else {
    document.documentElement.classList.add("js-motion");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    els.forEach((e, i) => { e.style.setProperty("--d", `${(i % 4) * 70}ms`); io.observe(e); });
  }

  // Barra: ganha linha ao rolar e troca para a versao oliva (logo claro) enquanto estiver sobre uma secao escura
  const bar = document.getElementById("topbar");
  const darkEls = [...document.querySelectorAll("[data-dark]")];
  const sync = () => {
    bar.classList.toggle("is-stuck", scrollY > 8);
    const h = bar.offsetHeight, y = scrollY < h ? h + 1 : h / 2; // no topo, a secao logo abaixo da barra define o tom
    bar.classList.toggle("bar--dark", darkEls.some((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }));
  };
  addEventListener("scroll", sync, { passive: true }); addEventListener("resize", sync); sync(); // leitura barata (poucos retangulos), sem layout forcado em cascata

  // CTA fixo (FAB): esconde enquanto o CTA principal do hero, o contato ou o rodape estao a vista
  const fab = document.querySelector(".fab");
  if (fab && "IntersectionObserver" in window) {
    const seen = new Set();
    const fio = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)));
      fab.classList.toggle("is-away", seen.size > 0);
    });
    document.querySelectorAll(".hero .btn, #contato, .footer").forEach((el) => fio.observe(el));
  }

  // Menu em tela cheia: botao, Esc, foco preso no overlay, fecha ao escolher item; restante da pagina inerte
  const btn = document.querySelector(".menu-btn");
  const menu = document.getElementById("menu");
  const label = btn.querySelector(".menu-btn__t");
  const outside = [document.getElementById("main"), document.querySelector(".footer"), document.querySelector(".fab"), document.querySelector(".skip")];
  const isOpen = () => menu.classList.contains("is-open");
  const setMenu = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    label.textContent = open ? label.dataset.close : label.dataset.open;
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    menu.inert = !open;
    outside.forEach((el) => el && (el.inert = open));
    document.documentElement.style.overflow = open ? "hidden" : "";
  };
  btn.addEventListener("click", () => setMenu(!isOpen()));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") { setMenu(false); btn.focus(); return; }
    if (e.key === "Tab") {
      const items = [btn, ...menu.querySelectorAll("a[href]")];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Formulario -> abre WhatsApp com a mensagem montada (sem backend; o site nao guarda os dados)
  const form = document.getElementById("form");
  const status = document.getElementById("form-status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.nome;
    if (!nome.value.trim()) {
      nome.setAttribute("aria-invalid", "true");
      status.textContent = "Informe seu nome para continuar.";
      nome.focus();
      return;
    }
    nome.removeAttribute("aria-invalid");
    const lines = ["Olá! Vim pelo site da Dra. Lenita Brasil.", `Nome: ${nome.value.trim()}`];
    if (form.tel.value.trim()) lines.push(`Telefone: ${form.tel.value.trim()}`);
    if (form.msg.value.trim()) lines.push(`Mensagem: ${form.msg.value.trim()}`);
    status.textContent = "Abrindo o WhatsApp...";
    open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });
})();
