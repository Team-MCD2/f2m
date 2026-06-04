(function () {
  const cfg = window.F2M_SITE;
  const html = document.documentElement;
  const base = html.getAttribute("data-base") || "";

  function href(path) {
    if (!path) return "#";
    if (path.startsWith("http") || path.startsWith("tel:") || path.startsWith("mailto:"))
      return path;
    return base + path;
  }

  function isActive(navHref) {
    const page = html.getAttribute("data-page") || "";
    const navKey = navHref.replace(/^\.\//, "").replace(/\/index\.html$/, "").replace(/\.html$/, "");
    if (navHref === "index.html" && page === "home") return true;
    return Boolean(page && (page === navKey || page.startsWith(navKey)));
  }

  const navLinks = cfg.nav
    .map(
      (item) =>
        `<li><a href="${href(item.href)}" class="${isActive(item.href) ? "is-active" : ""}${item.highlight ? " nav-highlight" : ""}">${item.label}</a></li>`
    )
    .join("");

  const legalLinks = cfg.legal
    .map((item) => `<li><a href="${href(item.href)}">${item.label}</a></li>`)
    .join("");

  const header = `
<header class="site-header" role="banner">
  <div class="header-inner container">
    <a class="logo" href="${href("index.html")}" aria-label="${cfg.name} — Accueil">
      <span class="logo-mark">F2M</span>
      <span class="logo-text">Consulting</span>
    </a>
    <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Ouvrir le menu">
      <span></span><span></span><span></span>
    </button>
    <nav id="main-nav" class="main-nav" aria-label="Navigation principale">
      <ul class="nav-list">${navLinks}</ul>
      <a class="btn btn-gold btn-sm nav-cta" href="${href("contact/index.html")}">Contact</a>
      <a class="btn btn-outline btn-sm" href="tel:${cfg.phoneTel}">${cfg.phone}</a>
    </nav>
  </div>
</header>
<a href="tel:${cfg.phoneTel}" class="sticky-cta" aria-label="Appeler F2M Consulting">
  <span class="sticky-cta-icon" aria-hidden="true">📞</span>
  <span>Appeler</span>
</a>`;

  const footer = `
<footer class="site-footer" role="contentinfo">
  <div class="container footer-grid">
    <div class="footer-brand">
      <p class="footer-logo">${cfg.name}</p>
      <p class="footer-tagline">${cfg.tagline}</p>
      <p class="footer-keywords">${cfg.keywords}</p>
    </div>
    <div>
      <p class="footer-heading">Coordonnées</p>
      <address class="footer-address">
        ${cfg.address.full}<br />
        <a href="tel:${cfg.phoneTel}">${cfg.phone}</a><br />
        <a href="mailto:${cfg.email}">${cfg.email}</a>
      </address>
    </div>
    <div>
      <p class="footer-heading">Formations</p>
      <ul class="footer-links">
        <li><a href="${href("formation-dgesp/index.html")}">Formation DGESP</a></li>
        <li><a href="${href("vae-dgesp/index.html")}">VAE DGESP</a></li>
        <li><a href="${href("financements/index.html")}">Financements</a></li>
        <li><a href="${href("e-learning/index.html")}">E-learning</a></li>
      </ul>
    </div>
    <div>
      <p class="footer-heading">Liens utiles</p>
      <ul class="footer-links">
        <li><a href="${href("notre-centre/index.html")}">Notre centre</a></li>
        <li><a href="${href("blog/index.html")}">Blog & ressources</a></li>
        <li><a href="${href("contact/index.html")}">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom container">
    <ul class="footer-legal">${legalLinks}</ul>
    <p>© ${new Date().getFullYear()} ${cfg.name} — Certifié Qualiopi · Titre RNCP 36654</p>
  </div>
</footer>`;

  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = header;
  if (footerEl) footerEl.innerHTML = footer;
})();
