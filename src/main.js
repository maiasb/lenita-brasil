// Interacoes leves, sem dependencias: reveal on scroll, menu mobile, topbar, formulario -> WhatsApp.
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

  const bar = document.getElementById("topbar");
  const onScroll = () => bar.classList.toggle("is-stuck", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Menu mobile (botao + Esc + fecha ao escolher item)
  const btn = document.querySelector(".menu-btn");
  const nav = document.getElementById("nav");
  const setMenu = (open) => { btn.setAttribute("aria-expanded", String(open)); nav.classList.toggle("is-open", open); };
  btn.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); btn.focus(); } });

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
