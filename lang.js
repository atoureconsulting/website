/* AToure — English / French language toggle.
   Swaps text nodes against a dictionary. Anything not in the dictionary stays
   in English, so the site degrades gracefully as translations are added.
   House style: no em dashes, en dashes or hyphenated compounds in copy. */
(function () {
  "use strict";

  var FR = {
    /* ---- navigation and shared chrome ---- */
    "Home": "Accueil",
    "About": "À propos",
    "Services": "Services",
    "Our Work": "Nos réalisations",
    "Contact": "Contact",
    "Let's Talk": "Discutons",
    "Get in Touch": "Nous contacter",
    "Start a Conversation": "Démarrer la conversation",
    "WhatsApp Us": "Écrivez nous sur WhatsApp",
    "Tell us your brief": "Présentez nous votre projet",
    "AToure · Est. 2023, London": "AToure · Fondée en 2023, Londres",
    "© 2025 AToure LTD · England & Wales · All rights reserved.":
      "© 2025 AToure LTD · Angleterre et Pays de Galles · Tous droits réservés.",
    "Related Work": "Projets liés",
    "All Case Studies": "Toutes les études de cas",
    "Back to Our Work": "Retour aux réalisations",
    "Ready to work together?": "Prêts à travailler ensemble ?",
    "Tell me what you": "Dites moi ce que vous",
    "want to make happen.": "voulez réaliser.",
    "Ready to build something?": "Prêts à construire quelque chose ?",
    "Let’s talk.": "Discutons.",
    "Let's talk.": "Discutons.",
    "Tell us about the campaign. We'll tell you how to land it.":
      "Parlez nous de la campagne. Nous vous dirons comment la réussir.",
    "Want to partner on the next one?": "Envie de nous accompagner sur la prochaine ?",
    "Tell us what you want to reach. We'll tell you how to land it.":
      "Dites nous qui vous voulez toucher. Nous vous dirons comment y parvenir.",

    /* ---- home ---- */
    "African Market Access": "Accès aux marchés africains",
    "Global Creators | International Media | Complete Operations & Logistics":
      "Créateurs internationaux | Médias internationaux | Opérations et logistique complètes",
    "A global marketing and logistics agency specialising in African market access for creators, media and brands alike.":
      "Une agence internationale de marketing et de logistique spécialisée dans l'accès aux marchés africains pour les créateurs, les médias et les marques.",
    "Trusted by global brands": "La confiance de marques internationales",
    "Case Studies": "Études de cas",
    "Real markets. Real results.": "De vrais marchés. De vrais résultats.",
    "Every case shows the brief, the market, and exactly how AToure made it happen, from first contact to final delivery.":
      "Chaque projet montre le brief, le marché, et la façon exacte dont AToure l'a concrétisé, du premier contact à la livraison finale.",
    "What We Do": "Ce que nous faisons",
    "Access & Relationships": "Accès et relations",
    "We get you in rooms most agencies can't find.":
      "Nous vous ouvrons des portes que la plupart des agences ne trouvent même pas.",
    "We don't brief and disappear. We stay in the room.":
      "Nous ne livrons pas un brief avant de disparaître. Nous restons présents.",
    "Permits & Visas": "Autorisations et visas",
    "Security & Logistics": "Sécurité et logistique",
    "Market Intelligence & Strategy": "Intelligence de marché et stratégie",
    "We know what lands in these markets. And what doesn't.":
      "Nous savons ce qui fonctionne sur ces marchés. Et ce qui échoue.",
    "Who we work": "Avec qui nous",
    "What's Your Brief?": "Quel est votre projet ?",
    "If it involves Africa,": "Si cela concerne l'Afrique,",
    "we're the answer.": "nous sommes la réponse.",
    "We respond within 24 hours.": "Nous répondons sous 24 heures.",
    "Thanks. We'll be in touch within 24 hours.": "Merci. Nous vous recontactons sous 24 heures.",
    "Company or Brand": "Société ou marque",
    "What are you trying to do?": "Que souhaitez vous faire ?",
    "Select your brief type": "Sélectionnez votre type de projet",
    "Tell us more": "Dites nous en plus",
    "All enquiries, partnerships & proposals": "Toutes demandes, partenariats et propositions",
    "Message us directly on WhatsApp": "Écrivez nous directement sur WhatsApp",
    "London, United Kingdom": "Londres, Royaume Uni",
    "Operating internationally · AToure LTD, England & Wales":
      "Présents à l'international · AToure LTD, Angleterre et Pays de Galles",

    /* ---- about ---- */
    "About AToure": "À propos d'AToure",
    "Built to close": "Conçus pour combler",
    "execution gap.": "déficit d'exécution.",
    "We are an agency. And we are much more. Atoure brings together a curated creator database, matchmaking expertise, and full operational execution, all under one roof. From talent discovery to campaign delivery, we handle every stage with the same team, the same standards, and the same commitment to getting it right.":
      "Nous sommes une agence. Et bien davantage. AToure réunit une base de créateurs sélectionnés, une expertise de mise en relation et une exécution opérationnelle complète, le tout sous un même toit. De la découverte des talents à la livraison des campagnes, nous prenons en charge chaque étape avec la même équipe, les mêmes exigences et la même volonté de bien faire.",
    "Our Reach": "Notre présence",
    "Where we've": "Où nous avons",
    "activated": "opéré",
    "Ground-level presence across 17 countries, from West Africa to the Middle East, Europe, and beyond.":
      "Une présence de terrain dans 17 pays, de l'Afrique de l'Ouest au Moyen Orient, à l'Europe et au delà.",
    "The Founder": "Le fondateur",
    "Founder · AToure": "Fondateur · AToure",
    "The problem was never the idea. It was the in between. So we stepped into the middle and made it personal.":
      "Le problème n'a jamais été l'idée. C'était l'entre deux. Nous nous sommes donc placés au milieu, et nous en avons fait une affaire personnelle.",
    "A brand looking for the right creator. A creator visiting a new market. Whatever the brief, let's talk.":
      "Une marque en quête du bon créateur. Un créateur qui découvre un nouveau marché. Quel que soit le projet, discutons.",

    /* ---- services ---- */
    "Four things we do.": "Quatre métiers.",
    "One desk.": "Un seul interlocuteur.",
    "Your brief.": "Votre brief.",
    "Our execution.": "Notre exécution.",
    "Creator Partnerships": "Partenariats créateurs",
    "Market Activation": "Activation de marché",
    "On-the-Ground Production": "Production sur le terrain",
    "African Market Strategy": "Stratégie des marchés africains",
    "The Access Advantage": "L'avantage de l'accès",
    "We're already in the markets": "Nous sommes déjà présents sur les marchés",
    "you're trying to reach.": "que vous cherchez à atteindre.",
    "Let's get to work": "Mettons nous au travail",
    "Bring the brief. We'll tell you exactly how we'd make it work.":
      "Apportez le brief. Nous vous dirons précisément comment nous le réaliserions.",

    /* ---- our work ---- */
    "Campaigns that move cultures.": "Des campagnes qui font bouger les cultures.",
    "And numbers.": "Et les chiffres.",
    "What we've built.": "Ce que nous avons bâti.",
    "With who.": "Et avec qui.",
    "More Work": "Autres projets",
    "More campaigns.": "D'autres campagnes.",
    "Same standard.": "Le même standard.",
    "The Brief": "Le brief",
    "What AToure Did": "Ce qu'AToure a fait",
    "Key Outcomes": "Résultats clés",
    "Brand Partnerships": "Partenariats de marque",
    "Artist Management": "Management d'artistes",

    /* ---- race weekend ---- */
    "Case Study · Owned Event": "Étude de cas · Événement propriétaire",
    "The Concept": "Le concept",
    "The Format": "Le format",
    "On The Ground": "Sur le terrain",
    "Guests & Amplification": "Invités et amplification",
    "Why It Worked": "Pourquoi cela a fonctionné",
    "Partners": "Partenaires",
    "Media & Coverage": "Médias et couverture",
    "At a Glance": "En bref",
    "The Opportunity": "L'opportunité",
    "Guests per day": "Invités par jour",
    "Two days. ": "Deux jours. ",
    "Track, paddock, arrival": "Piste, paddock, arrivée",
    "Monaco, live and loud": "Monaco, en direct et à plein volume",
    "Who backed the weekend.": "Qui a soutenu le week end.",
    "Filmed, hosted, ": "Filmé, animé, ",
    "A format ": "Un format ",
    "Formula 1, ": "La Formule 1, ",
    "brought to Abidjan.": "à Abidjan.",
    "People who make it ": "Ceux qui lui donnent sa ",
    "credible.": "crédibilité.",
    "Concept to ": "Du concept à ",
    "execution.": "l'exécution.",
    "First mover, ": "Précurseurs, ",
    "on purpose.": "délibérément.",
    "worth repeating.": "à reproduire.",
    "covered.": "couvert.",
    "Two different rooms.": "Deux ambiances différentes."
  };

  /* Headings whose English splits across <br> / <em> nodes translate badly word
     by word, so they are swapped whole. Keyed on the element's own markup. */
  var FR_HTML = {
    'Built to close<br>the <em>execution gap.</em>':
      'Conçus pour combler<br>le <em>déficit d\'exécution.</em>',
    'Baba <em>Touré</em>': 'Baba <em>Touré</em>',
    'Four things we do.<br><em>One desk.</em>':
      'Quatre métiers.<br><em>Un seul interlocuteur.</em>',
    'Your brief. <em>Our execution.</em>': 'Votre brief. <em>Notre exécution.</em>',
    "What we've built. <em>With who.</em>": 'Ce que nous avons bâti. <em>Et avec qui.</em>',
    'More campaigns. <em>Same standard.</em>': 'D\'autres campagnes. <em>Le même standard.</em>',
    'Real briefs. <em>Real markets. Real results.</em>':
      'De vrais briefs. <em>De vrais marchés. De vrais résultats.</em>',
    'Three things. <em>Done properly.</em>': 'Trois métiers. <em>Faits correctement.</em>',
    'Who we work <em>with</em>': 'Avec qui nous <em>travaillons</em>',
    'Not a roster.<br><em>A network.</em>': 'Pas un catalogue.<br><em>Un réseau.</em>',
    'Race Weekend<em>Abidjan 2026</em>': 'Race Weekend<em>Abidjan 2026</em>',
    'Formula 1, <em>brought to Abidjan.</em>': 'La Formule 1, <em>à Abidjan.</em>',
    'Two days. <em>Two different rooms.</em>': 'Deux jours. <em>Deux ambiances.</em>',
    'What the weekend <em>looked like.</em>': 'À quoi ressemblait <em>le week end.</em>',
    'People who make it <em>credible.</em>': 'Ceux qui lui donnent sa <em>crédibilité.</em>',
    'First mover, <em>on purpose.</em>': 'Précurseurs, <em>délibérément.</em>',
    'Concept to <em>execution.</em>': 'Du concept à <em>l\'exécution.</em>',
    'Who backed <em>the weekend.</em>': 'Qui a soutenu <em>le week end.</em>',
    'Filmed, hosted, <em>covered.</em>': 'Filmé, animé, <em>couvert.</em>',
    'A format <em>worth repeating.</em>': 'Un format <em>à reproduire.</em>'
  };

  var STORE = "atoure-lang";
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, IFRAME: 1, CODE: 1, PRE: 1 };
  var originals = null;     /* [node, englishText] captured on first switch */
  var htmlOriginals = null; /* [element, englishInnerHTML] for whole swaps */

  function norm(s) {
    return s.replace(/ /g, " ").replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
  }

  function walk(fn) {
    var it = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.parentNode || SKIP[n.parentNode.nodeName]) return NodeFilter.FILTER_REJECT;
        if (n.parentNode.closest && n.parentNode.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var n;
    while ((n = it.nextNode())) fn(n);
  }

  function normHTML(h) {
    return h.replace(/\s+/g, " ").replace(/[\u2018\u2019]/g, "'").trim();
  }

  /* Elements swapped whole are marked data-no-translate before the text walker
     records anything, so the two passes never fight over the same nodes. */
  function collect() {
    if (htmlOriginals && originals) return;
    htmlOriginals = [];
    var heads = document.querySelectorAll("h1, h2, h3");
    Array.prototype.forEach.call(heads, function (el) {
      var fr = FR_HTML[normHTML(el.innerHTML)];
      if (fr) {
        htmlOriginals.push([el, el.innerHTML, fr]);
        el.setAttribute("data-no-translate", "");
      }
    });
    originals = [];
    walk(function (n) { originals.push([n, n.nodeValue]); });
  }

  function toFrench() {
    collect();
    htmlOriginals.forEach(function (r) { r[0].innerHTML = r[2]; });
    originals.forEach(function (pair) {
      var node = pair[0], en = pair[1];
      var fr = FR[norm(en)];
      if (!fr) return;
      /* keep whatever whitespace the original node carried, so inline
         layout (e.g. "ATOURE " before an <em>) is preserved */
      var lead = en.match(/^\s*/)[0];
      var trail = en.match(/\s*$/)[0];
      node.nodeValue = lead + fr + trail;
    });
    document.documentElement.lang = "fr";
  }

  function toEnglish() {
    if (htmlOriginals) htmlOriginals.forEach(function (r) { r[0].innerHTML = r[1]; });
    if (originals) originals.forEach(function (p) { p[0].nodeValue = p[1]; });
    document.documentElement.lang = "en";
  }

  function apply(lang, save) {
    if (lang === "fr") toFrench(); else toEnglish();
    if (save !== false) { try { localStorage.setItem(STORE, lang); } catch (e) {} }
    var box = document.getElementById("lang-toggle");
    if (box) {
      box.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
        b.classList.toggle("is-on", b.dataset.lang === lang);
      });
    }
  }

  function injectStyles() {
    var css = document.createElement("style");
    css.textContent =
      "#lang-toggle{display:inline-flex;align-items:center;gap:2px;border:1px solid rgba(200,169,81,.45);" +
      "border-radius:3px;overflow:hidden;margin-left:.4rem;flex:0 0 auto;}" +
      "#lang-toggle button{font-family:inherit;font-size:.62rem;font-weight:600;letter-spacing:.1em;" +
      "text-transform:uppercase;padding:.34rem .6rem;background:transparent;color:inherit;border:0;" +
      "cursor:pointer;line-height:1;transition:background .2s,color .2s;opacity:.72;}" +
      "#lang-toggle button.is-on{background:var(--gold,#C8A951);color:#0D0C0A;opacity:1;}" +
      "#lang-toggle button:hover{opacity:1;}" +
      "@media(max-width:820px){#lang-toggle{margin:.6rem auto;}}";
    document.head.appendChild(css);
  }

  function injectToggle() {
    var list = document.querySelector(".nav-links");
    if (!list || document.getElementById("lang-toggle")) return;
    var li = document.createElement("li");
    li.setAttribute("data-no-translate", "");
    var box = document.createElement("span");
    box.id = "lang-toggle";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Language / Langue");
    ["en", "fr"].forEach(function (code) {
      var b = document.createElement("button");
      b.type = "button";
      b.dataset.lang = code;
      b.textContent = code.toUpperCase();
      b.setAttribute("aria-label", code === "en" ? "Switch to English" : "Passer en français");
      b.addEventListener("click", function () { apply(code); });
      box.appendChild(b);
    });
    li.appendChild(box);
    var cta = list.querySelector(".nav-cta");
    if (cta && cta.parentNode) list.insertBefore(li, cta.parentNode); else list.appendChild(li);
  }

  function start() {
    injectStyles();
    injectToggle();
    var saved = null;
    try { saved = localStorage.getItem(STORE); } catch (e) {}
    if (!saved) {
      saved = (navigator.language || "").toLowerCase().indexOf("fr") === 0 ? "fr" : "en";
    }
    apply(saved, false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
