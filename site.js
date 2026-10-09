/* AToure: cookie consent, consent gated tracking, and the sticky mobile contact bar.

   No tracker loads until the visitor accepts. Google tags run in consent mode
   with everything denied by default, so a gtag() call made before consent
   (the enquiry form fires one) is queued and never sent unless the visitor
   accepts. Meta and LinkedIn are not loaded at all until then.

   Pages choose their trackers with data-trackers on the script tag:
   "all" (default) loads Google Analytics, Google Ads, Meta and LinkedIn;
   "ga" loads Google Analytics only. */
(function () {
  var KEY = "atoure-consent";
  var GA = "G-ZGDK288FKP", ADS = "AW-18166343151", FB = "1303970591826412", LI = "536781209";
  var me = document.currentScript;
  var all = !me || (me.getAttribute("data-trackers") || "all") === "all";
  var loaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag("consent", "default", { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function fr() { return document.documentElement.lang === "fr"; }

  function script(src) {
    var s = document.createElement("script");
    s.async = true; s.src = src;
    document.head.appendChild(s);
  }

  function load() {
    if (loaded) return;
    loaded = true;
    gtag("consent", "update", { ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
    gtag("js", new Date());
    gtag("config", GA);
    if (all) gtag("config", ADS);
    script("https://www.googletagmanager.com/gtag/js?id=" + GA);
    if (!all) return;
    var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    script("https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", FB);
    fbq("track", "PageView");
    window._linkedin_partner_id = LI;
    window._linkedin_data_partner_ids = (window._linkedin_data_partner_ids || []).concat(LI);
    window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
    window.lintrk.q = [];
    script("https://snap.licdn.com/li.lms-analytics/insight.min.js");
  }

  /* Clears the first party cookies the trackers set, for a visitor who
     withdraws consent after giving it. */
  function clearCookies() {
    var host = location.hostname.replace(/^www\./, "");
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (/^(_ga|_gid|_gcl|_fbp|_fbc|li_|lms_|AnalyticsSyncHistory|UserMatchHistory)/.test(name)) {
        ["", "; domain=" + host, "; domain=." + host].forEach(function (d) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
        });
      }
    });
  }

  var css = document.createElement("style");
  css.textContent =
    ".ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:90;max-width:560px;margin-left:auto;background:var(--night,#141413);color:#fff;padding:20px 22px;font:inherit;font-size:.9rem;line-height:1.5;box-shadow:0 12px 40px rgba(0,0,0,.25);border-top:3px solid var(--acc,#C9971F)}" +
    ".ck[hidden]{display:none}.ck p{margin:0 0 14px}.ck strong{color:var(--acc,#C9971F)}.ck a{color:#fff;text-decoration:underline}" +
    ".ck-b{display:flex;gap:10px}.ck-b button{flex:1;font:inherit;font-weight:700;font-size:.9rem;padding:.75rem 1rem;cursor:pointer;border:1px solid #fff;background:none;color:#fff}" +
    ".ck-b button[data-ck=accept]{background:var(--acc,#C9971F);border-color:var(--acc,#C9971F);color:#121212}" +
    ".ck-b button:hover{background:#fff;border-color:#fff;color:#121212}" +
    ".mcta{display:none}" +
    "@media(max-width:820px){.mcta{position:fixed;left:0;right:0;bottom:0;z-index:80;display:flex;gap:8px;padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:var(--paper,#F3F1EC);border-top:1px solid var(--ink,#121212);transform:translateY(110%);transition:transform .3s ease}" +
    ".mcta.on{transform:none}.mcta a{flex:1;text-align:center;font-weight:700;font-size:.95rem;padding:.85rem 1rem;text-decoration:none;border:1px solid var(--ink,#121212);color:var(--ink,#121212)}" +
    ".mcta .mcta-go{flex:2;background:var(--acc,#C9971F);border-color:var(--acc,#C9971F)}" +
    "html.has-mcta body{padding-bottom:76px}html.has-mcta .ck{bottom:84px}}" +
    "@media(prefers-reduced-motion:reduce){.mcta{transition:none}}";
  document.head.appendChild(css);

  var T = {
    en: { lead: "Cookies.", body: "We use analytics and advertising cookies to see how the site is used and to measure our campaigns. They stay off unless you accept.", link: "Privacy policy", reject: "Reject", accept: "Accept", label: "Cookie choices", go: "Start a conversation" },
    fr: { lead: "Cookies.", body: "Nous utilisons des cookies de mesure d'audience et de publicité pour comprendre l'utilisation du site et mesurer nos campagnes. Ils restent désactivés tant que vous ne les acceptez pas.", link: "Politique de confidentialité", reject: "Refuser", accept: "Accepter", label: "Choix des cookies", go: "Démarrer une conversation" }
  };

  var bar = null, cta = null;

  function paint() {
    var t = fr() ? T.fr : T.en;
    if (bar) {
      bar.setAttribute("aria-label", t.label);
      bar.querySelector("strong").textContent = t.lead;
      bar.querySelector(".ck-t").textContent = " " + t.body + " ";
      bar.querySelector("a").textContent = t.link;
      bar.querySelector("[data-ck=reject]").textContent = t.reject;
      bar.querySelector("[data-ck=accept]").textContent = t.accept;
    }
    if (cta) cta.querySelector(".mcta-go").textContent = t.go;
  }

  function choose(v) {
    var was = get();
    set(v);
    bar.hidden = true;
    if (v === "granted") load();
    else if (was === "granted") {
      gtag("consent", "update", { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      clearCookies();
      location.reload();
    }
    tick();
  }

  function openBar() {
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "ck";
      bar.setAttribute("role", "region");
      bar.setAttribute("data-no-translate", "");
      bar.innerHTML = '<p><strong></strong><span class="ck-t"></span><a href="/privacy.html#cookies"></a></p><div class="ck-b"><button type="button" data-ck="reject"></button><button type="button" data-ck="accept"></button></div>';
      bar.querySelector("[data-ck=reject]").addEventListener("click", function () { choose("denied"); });
      bar.querySelector("[data-ck=accept]").addEventListener("click", function () { choose("granted"); });
      document.body.appendChild(bar);
      paint();
    }
    bar.hidden = false;
    tick();
  }

  /* Sticky contact bar for phones, on the public pages only: those carry the
     gold Contact button in the nav and are not marked noindex. It appears once
     the hero has scrolled away and steps aside while a contact block is on screen. */
  var inView = 0;
  function tick() {
    if (!cta) return;
    var show = window.scrollY > window.innerHeight * 0.6 && inView === 0 && !(bar && !bar.hidden);
    cta.classList.toggle("on", show);
  }

  function makeCta() {
    if (!document.querySelector(".nav-cta")) return;
    if (document.querySelector('meta[name="robots"][content*="noindex"]')) return;
    var home = !!document.getElementById("contact");
    cta = document.createElement("div");
    cta.className = "mcta";
    cta.setAttribute("data-no-translate", "");
    cta.innerHTML = '<a class="mcta-go" href="' + (home ? "#contact" : "/index.html#contact") + '"></a><a href="https://wa.me/447456728616" target="_blank" rel="noopener">WhatsApp</a>';
    document.body.appendChild(cta);
    document.documentElement.classList.add("has-mcta");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var was = e.target._in;
          e.target._in = e.isIntersecting;
          if (was !== e.isIntersecting) inView += e.isIntersecting ? 1 : (was ? -1 : 0);
        });
        tick();
      });
      document.querySelectorAll("#contact, .band, footer").forEach(function (el) { io.observe(el); });
    }
    window.addEventListener("scroll", tick, { passive: true });
    paint();
    tick();
  }

  function start() {
    var c = get();
    if (c === "granted") load();
    makeCta();
    if (c !== "granted" && c !== "denied") openBar();
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-cookie-settings]");
      if (b) { e.preventDefault(); openBar(); }
    });
    new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
