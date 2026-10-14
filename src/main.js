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

  // Barra: ganha linha ao rolar; esconde ao descer e reaparece ao subir (sempre visivel no topo, com menu aberto ou com foco nela)
  const bar = document.getElementById("topbar");
  let lastY = scrollY;
  const sync = () => {
    const y = Math.max(scrollY, 0);
    bar.classList.toggle("is-stuck", y > 8);
    const dy = y - lastY;
    if (Math.abs(dy) > 6) {
      const hide = dy > 0 && y > bar.offsetHeight * 1.5 && !document.body.classList.contains("menu-open") && !bar.matches(":focus-within");
      bar.classList.toggle("is-hidden", hide);
      lastY = y;
    }
    if (y <= 8) bar.classList.remove("is-hidden");
  };
  addEventListener("scroll", sync, { passive: true }); sync();
  bar.addEventListener("focusin", () => bar.classList.remove("is-hidden"));

  // Faixa rolante: botao de pausa (WCAG 2.2.2); CSS ja pausa no hover/foco e para com reduced-motion
  const mqBtn = document.querySelector(".marquee__btn");
  if (mqBtn) {
    const mq = mqBtn.closest(".marquee");
    mqBtn.addEventListener("click", () => {
      const paused = mq.classList.toggle("is-paused");
      mqBtn.setAttribute("aria-pressed", String(paused));
      mqBtn.setAttribute("aria-label", paused ? mqBtn.dataset.off : mqBtn.dataset.on);
    });
  }

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

  // Procedimentos: celula abre o painel (dialog nativo: foco preso e Esc); clique no fundo ou no X fecha
  document.querySelectorAll("[data-dialog]").forEach((b) => {
    const d = document.getElementById(b.dataset.dialog);
    if (!d || typeof d.showModal !== "function") return;
    b.addEventListener("click", () => d.showModal());
    d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) { d.close(); b.focus(); } });
    d.addEventListener("close", () => b.focus());
  });

  // Cartas das unidades: clicar (ou Enter/Espaco) na de tras a traz para frente; so transform/opacity, z-index troca no meio do movimento
  document.querySelectorAll("[data-deck]").forEach((deck) => {
    const cards = [...deck.querySelectorAll(".deck__card")];
    if (cards.length < 2) return;
    const apply = () => cards.forEach((c) => {
      const back = c.dataset.pos === "back";
      if (back) { c.setAttribute("role", "button"); c.tabIndex = 0; c.setAttribute("aria-label", `Trazer para frente a foto da ${c.dataset.name}`); }
      else { c.removeAttribute("role"); c.removeAttribute("tabindex"); c.removeAttribute("aria-label"); }
    });
    const bring = (card) => {
      if (card.dataset.pos !== "back") return;
      cards.forEach((c) => { c.dataset.pos = c.dataset.z = c === card ? "front" : "back"; }); // o CSS atrasa a troca do z-index (transition)
      apply();
      cards.find((c) => c.dataset.pos === "back").focus({ preventScroll: true });
    };
    cards.forEach((c) => {
      c.addEventListener("click", () => bring(c));
      c.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && c.dataset.pos === "back") { e.preventDefault(); bring(c); } });
    });
    apply();
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
