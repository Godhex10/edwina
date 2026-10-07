/* =========================================================
   EDWINA · Gloss & Glam — storefront script
   ========================================================= */

/* ---- Store settings: edit these for the client ---- */
const CONFIG = {
  currency: "$",          // e.g. "₦", "£", "€", "MX$"
  freeShipping: 50,       // free-shipping threshold
  whatsapp: "",           // e.g. "2348012345678" → checkout opens a WhatsApp order message
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => CONFIG.currency + (Number.isInteger(n) ? n : n.toFixed(2));

/* ---------- colour helpers ---------- */
function hexToRgb(h) { h = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

/* =========================================================
   PRODUCTS
   ========================================================= */
const PRODUCTS = [
  { id: "bubblegum", cat: "gloss", name: "Bubblegum Pop", price: 14, c: "#ff7eb6", cd: "#e0468e", cap: "rose", glitter: true, badge: "Bestseller", rating: 4.9, reviews: 812, kicker: "sheer pink shimmer", vibe: "Your “I just woke up like this” pink. Sheer, juicy and impossible to mess up." },
  { id: "strawberry", cat: "gloss", name: "Strawberry Glaze", price: 14, c: "#ff4f7b", cd: "#c81e4f", cap: "rose", rating: 4.9, reviews: 640, kicker: "juicy red-pink", vibe: "Tastes like a summer picnic. A glassy berry tint that makes lips look bitten." },
  { id: "champagne", cat: "gloss", name: "Pink Champagne", price: 16, c: "#f7a8b8", cd: "#d47089", cap: "gold", glitter: true, badge: "Fan fave", rating: 5, reviews: 433, kicker: "golden-pink sparkle", vibe: "Pop the bubbly. Soft pink with gold micro-shimmer for every celebration." },
  { id: "cherry", cat: "gloss", name: "Cherry Glaze", price: 16, c: "#e0144a", cd: "#8a0623", cap: "gold", glitter: true, badge: "New", badgeType: "new", rating: 5, reviews: 98, kicker: "glass-like cherry red", vibe: "The limited drop. Deep, glossy cherry with micro-shimmer — main character only." },
  { id: "cottoncandy", cat: "gloss", name: "Cotton Candy Kiss", price: 14, c: "#ffb3d9", cd: "#e57ab5", cap: "white", glitter: true, rating: 4.8, reviews: 377, kicker: "baby pink glitter", vibe: "Sugar-spun pastel pink with iridescent sparkle. Fairground core." },
  { id: "rose", cat: "gloss", name: "Rosé All Day", price: 14, c: "#e8899a", cd: "#b8546a", cap: "rose", rating: 4.8, reviews: 290, kicker: "your-lips-but-better", vibe: "The everyday MLBB nude-rose. Brunch, class, date — she goes everywhere." },
  { id: "peach", cat: "gloss", name: "Honey Peach", price: 12, old: 15, c: "#ffa883", cd: "#e0704a", cap: "gold", badge: "-20%", badgeType: "sale", rating: 4.7, reviews: 211, kicker: "warm peachy glow", vibe: "Sun-kissed peach that warms up every skin tone. Golden hour in a tube." },
  { id: "berry", cat: "gloss", name: "Berry Crush", price: 14, c: "#b8336a", cd: "#7a1240", cap: "white", rating: 4.9, reviews: 356, kicker: "deep berry gloss", vibe: "Moody, juicy and a little bit dangerous. For nights out and big plans." },
  { id: "mauve", cat: "gloss", name: "Mauve Moment", price: 14, c: "#c48aa3", cd: "#8e5670", cap: "rose", rating: 4.7, reviews: 188, kicker: "dusty mauve", vibe: "Soft, vintage, a little romantic. Pairs perfectly with a claw clip and a latte." },
  { id: "crystal", cat: "gloss", name: "Crystal Clear", price: 12, c: "#ffd6ea", cd: "#f2a6c8", cap: "white", glitter: true, clear: true, rating: 4.8, reviews: 520, kicker: "clear + holo glitter", vibe: "Pure glass shine with holographic sparkle. Layer it over everything." },

  { id: "oil-cherry", cat: "oil", name: "Cherry Lip Oil", price: 18, c: "#ff4f7b", cd: "#b3123f", badge: "Bestseller", rating: 4.9, reviews: 402, vibe: "A tinted, cushiony lip oil with cherry seed oil. Hydrates for 8 hours with a soft glassy finish." },
  { id: "oil-peach", cat: "oil", name: "Peach Glow Lip Oil", price: 18, c: "#ffb38f", cd: "#e47b55", rating: 4.8, reviews: 167, vibe: "Peach-tinted lip oil with vitamin E. Feels like nothing, looks like everything." },

  { id: "bow", cat: "acc", name: "Satin Bow Clip", price: 9, c: "#ff8cc0", cd: "#e0468e", shape: "bow", badge: "Trending", rating: 4.9, reviews: 610, vibe: "A big, bouncy satin bow on a gold-tone clip. Coquette approved." },
  { id: "mirror", cat: "acc", name: "Heart Pocket Mirror", price: 12, c: "#f7b9cf", cd: "#e57aa5", shape: "mirror", rating: 4.8, reviews: 233, vibe: "A heart-shaped compact mirror for gloss check-ins. Fits in every bag." },
  { id: "scrunchie", cat: "acc", name: "Silk Scrunchie Trio", price: 15, c: "#ffb3d1", cd: "#e47aa8", shape: "scrunchie", rating: 4.8, reviews: 298, vibe: "Three mulberry-silk scrunchies in strawberry milk, lilac and vanilla." },
  { id: "pearl", cat: "acc", name: "Pearl Barrette", price: 11, c: "#ffe6f0", cd: "#f2b6d0", shape: "pearl", badge: "New", badgeType: "new", rating: 4.7, reviews: 84, vibe: "Faux-pearl hair barrette with a gold finish. Instantly makes any look feel expensive." },
  { id: "charm", cat: "acc", name: "Gloss Charm Keychain", price: 10, c: "#ff7eb6", cd: "#e0468e", shape: "charm", rating: 4.9, reviews: 145, vibe: "A mini gloss tube charm with a heart. Clip it on your bag, keys or AirPods case." },
  { id: "pouch", cat: "acc", name: "Glitter Makeup Pouch", price: 16, c: "#ffa6cc", cd: "#e05a9a", shape: "pouch", rating: 4.8, reviews: 176, vibe: "A sparkly, wipe-clean pouch that holds all your glosses (and then some)." },

  { id: "trio", cat: "set", name: "The Glaze Trio", price: 36, old: 44, c: "#ff7eb6", cd: "#e0468e", shape: "trio", badge: "Save 18%", badgeType: "sale", rating: 5, reviews: 264, vibe: "Bubblegum Pop, Strawberry Glaze and Pink Champagne — the holy trinity of gloss." },
  { id: "giftbox", cat: "set", name: "Sweetheart Gift Box", price: 52, old: 62, c: "#ff8cc0", cd: "#d81b6a", shape: "gift", badge: "Gift ready", rating: 5, reviews: 119, vibe: "Two glosses, a lip oil, a bow clip and a heart mirror in a ribbon-tied box. The perfect gift (for her or for you)." },
];
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const CAT_LABEL = { gloss: "Lip Gloss", oil: "Lip Oil", acc: "Accessory", set: "Gift Set" };

/* =========================================================
   SVG PRODUCT ILLUSTRATIONS
   ========================================================= */
let uid = 0;
const nid = (p) => `${p}${++uid}`;
const CAPS = {
  rose: ["#f7b9cf", "#fff0f6", "#f4a3c2", "#e57aa5"],
  white: ["#efe2e8", "#ffffff", "#f3dfe8", "#dcc0cd"],
  gold: ["#e6be86", "#fff3d6", "#e3b46e", "#b8843f"],
};
const capStops = (k) => CAPS[k].map((c, i) => `<stop offset="${[0, 0.3, 0.6, 1][i]}" stop-color="${c}"/>`).join("");

function glitter(n, x0, x1, y0, y1, r = 1.6) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + Math.random() * (x1 - x0), y = y0 + Math.random() * (y1 - y0);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(Math.random() * r + 0.6).toFixed(1)}" fill="#fff" opacity="${(Math.random() * 0.6 + 0.3).toFixed(2)}"/>`;
  }
  return s;
}

function glossInner(p, animate = true) {
  const cg = nid("cg"), lg = nid("lg"), cp = nid("cp");
  const op = p.clear ? 0.55 : 0.97;
  return `
  <defs>
    <linearGradient id="${cg}" x1="0" x2="1">${capStops(p.cap || "rose")}</linearGradient>
    <linearGradient id="${lg}" x1="0" x2="1"><stop offset="0" stop-color="${p.cd}"/><stop offset=".45" stop-color="${p.c}"/><stop offset="1" stop-color="${p.cd}"/></linearGradient>
    <clipPath id="${cp}"><rect x="34" y="114" width="52" height="170" rx="21"/></clipPath>
  </defs>
  <rect x="40" y="98" width="40" height="16" rx="4" fill="#f9cfe0"/>
  <rect x="30" y="108" width="60" height="182" rx="25" fill="rgba(255,255,255,.5)" stroke="#fff" stroke-width="2.5"/>
  <g clip-path="url(#${cp})">
    <g class="${animate ? "wave-anim" : ""}" opacity="${op}">
      <path fill="url(#${lg})" d="M-180 138 Q-165 130 -150 138 T-120 138 T-90 138 T-60 138 T-30 138 T0 138 T30 138 T60 138 T90 138 T120 138 T150 138 T180 138 V300 H-180Z"/>
    </g>
    ${p.glitter ? glitter(p.clear ? 30 : 18, 36, 84, 145, 282) : ""}
  </g>
  <rect x="37" y="122" width="7" height="150" rx="3.5" fill="#fff" opacity=".7"/>
  <rect x="78" y="132" width="3" height="70" rx="1.5" fill="#fff" opacity=".45"/>
  <text x="62" y="214" transform="rotate(-90 62 214)" text-anchor="middle" font-family="Great Vibes, cursive" font-size="27" fill="${p.clear ? p.cd : "#fff"}" opacity=".92">edwina</text>
  <rect x="34" y="6" width="52" height="96" rx="13" fill="url(#${cg})"/>
  <rect x="41" y="13" width="6" height="82" rx="3" fill="#fff" opacity=".75"/>
  <rect x="34" y="88" width="52" height="4" fill="#000" opacity=".06"/>`;
}

const SVG = {
  gloss: (p) => `<svg class="product" viewBox="0 0 120 300" aria-hidden="true">${glossInner(p)}</svg>`,

  oil: (p) => {
    const g = nid("og"), l = nid("ol"), cp = nid("oc");
    return `<svg class="product" viewBox="0 0 120 300" aria-hidden="true">
      <defs>
        <linearGradient id="${g}" x1="0" x2="1">${capStops("gold")}</linearGradient>
        <linearGradient id="${l}" x1="0" x2="1"><stop offset="0" stop-color="${p.cd}"/><stop offset=".5" stop-color="${p.c}"/><stop offset="1" stop-color="${p.cd}"/></linearGradient>
        <clipPath id="${cp}"><rect x="26" y="100" width="68" height="182" rx="34"/></clipPath>
      </defs>
      <rect x="44" y="84" width="32" height="20" rx="5" fill="#f3d7a8"/>
      <rect x="22" y="96" width="76" height="190" rx="38" fill="rgba(255,255,255,.5)" stroke="#fff" stroke-width="2.5"/>
      <g clip-path="url(#${cp})">
        <g class="wave-anim" opacity=".88"><path fill="url(#${l})" d="M-180 126 Q-165 118 -150 126 T-120 126 T-90 126 T-60 126 T-30 126 T0 126 T30 126 T60 126 T90 126 T120 126 T150 126 T180 126 V300 H-180Z"/></g>
        <circle cx="50" cy="200" r="5" fill="#fff" opacity=".35"/><circle cx="70" cy="240" r="3" fill="#fff" opacity=".35"/><circle cx="62" cy="170" r="2.5" fill="#fff" opacity=".4"/>
      </g>
      <rect x="31" y="120" width="9" height="140" rx="4.5" fill="#fff" opacity=".65"/>
      <text x="60" y="206" text-anchor="middle" font-family="Great Vibes, cursive" font-size="24" fill="#fff">edwina</text>
      <text x="60" y="224" text-anchor="middle" font-family="Poppins, sans-serif" font-size="7" letter-spacing="2.5" fill="#fff" opacity=".9">LIP OIL</text>
      <rect x="36" y="8" width="48" height="80" rx="12" fill="url(#${g})"/>
      <rect x="42" y="14" width="6" height="66" rx="3" fill="#fff" opacity=".7"/>
    </svg>`;
  },

  bow: (p) => {
    const g = nid("bg");
    return `<svg class="product" viewBox="0 0 200 170" aria-hidden="true">
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(p.c, "#ffffff", 0.35)}"/><stop offset=".5" stop-color="${p.c}"/><stop offset="1" stop-color="${p.cd}"/></linearGradient></defs>
      <rect x="58" y="66" width="84" height="12" rx="6" fill="#e3b46e"/>
      <path fill="url(#${g})" d="M100 70 C70 30 20 20 20 60 C20 95 70 95 100 75Z M100 70 C130 30 180 20 180 60 C180 95 130 95 100 75Z"/>
      <path fill="${p.cd}" d="M95 78 L66 148 L82 142 L90 156 L100 82Z M105 78 L134 148 L118 142 L110 156 L100 82Z"/>
      <path d="M35 55 C45 40 70 45 88 66" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
      <path d="M165 55 C155 40 130 45 112 66" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".35"/>
      <ellipse cx="100" cy="73" rx="15" ry="17" fill="${p.cd}"/><ellipse cx="96" cy="68" rx="5" ry="7" fill="#fff" opacity=".5"/>
    </svg>`;
  },

  mirror: (p) => {
    const g = nid("mg"), m = nid("mm");
    const heart = "M100 175 C40 130 10 95 30 60 C45 32 85 30 100 60 C115 30 155 32 170 60 C190 95 160 130 100 175Z";
    return `<svg class="product" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd3e4"/><stop offset=".4" stop-color="#fff"/><stop offset=".7" stop-color="${p.c}"/><stop offset="1" stop-color="${p.cd}"/></linearGradient>
        <linearGradient id="${m}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#f6e9f0"/><stop offset="1" stop-color="#e9cddb"/></linearGradient>
      </defs>
      <path d="${heart}" fill="url(#${g})"/>
      <path d="${heart}" fill="url(#${m})" transform="translate(100 100) scale(.8) translate(-100 -98)"/>
      <path d="M55 70 L80 55 L115 130 L95 140Z" fill="#fff" opacity=".7" transform="translate(100 100) scale(.8) translate(-100 -98)"/>
      <path d="M120 60 L130 56 L150 100 L142 104Z" fill="#fff" opacity=".6" transform="translate(100 100) scale(.8) translate(-100 -98)"/>
      <circle cx="100" cy="30" r="5" fill="#e3b46e"/>
    </svg>`;
  },

  scrunchie: () => {
    const ring = (cx, cy, c, cd) => `
      <circle cx="${cx}" cy="${cy}" r="42" fill="none" stroke="${cd}" stroke-width="36"/>
      <circle cx="${cx}" cy="${cy}" r="42" fill="none" stroke="${c}" stroke-width="28" stroke-dasharray="9 7" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="48" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-dasharray="6 12" stroke-linecap="round"/>`;
    return `<svg class="product" viewBox="0 0 230 210" aria-hidden="true">
      ${ring(115, 72, "#fff4e8", "#efd9c6")}${ring(72, 140, "#ffb3d1", "#e47aa8")}${ring(158, 140, "#e2c6ff", "#b48be6")}
    </svg>`;
  },

  pearl: () => {
    const pg = nid("pg"), gg = nid("gg");
    let pearls = "";
    for (let i = 0; i < 7; i++) pearls += `<circle cx="${42 + i * 23}" cy="58" r="11" fill="url(#${pg})"/>`;
    return `<svg class="product" viewBox="0 0 220 120" aria-hidden="true">
      <defs>
        <radialGradient id="${pg}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#fbeaf1"/><stop offset="1" stop-color="#e2bfd0"/></radialGradient>
        <linearGradient id="${gg}" x1="0" x2="0" y1="0" y2="1">${capStops("gold")}</linearGradient>
      </defs>
      <g transform="rotate(-14 110 60)">
        <rect x="22" y="44" width="176" height="30" rx="15" fill="url(#${gg})"/>
        <rect x="30" y="70" width="160" height="6" rx="3" fill="#b8843f" opacity=".5"/>
        ${pearls}
      </g>
    </svg>`;
  },

  charm: (p) => `<svg class="product" viewBox="0 0 140 320" aria-hidden="true">
      <circle cx="70" cy="30" r="20" fill="none" stroke="#e3b46e" stroke-width="6"/>
      ${[54, 66, 78].map((y) => `<ellipse cx="70" cy="${y}" rx="4" ry="6" fill="none" stroke="#e3b46e" stroke-width="3"/>`).join("")}
      <path d="M100 98 C92 90 82 96 88 106 L100 118 L112 106 C118 96 108 90 100 98Z" fill="${p.c}" stroke="#fff" stroke-width="2"/>
      <line x1="70" y1="84" x2="100" y2="98" stroke="#e3b46e" stroke-width="2"/>
      <svg x="20" y="84" width="100" height="230" viewBox="0 0 120 300">${glossInner({ ...p, cap: "gold", glitter: true })}</svg>
    </svg>`,

  pouch: (p) => {
    const g = nid("pg");
    return `<svg class="product" viewBox="0 0 220 180" aria-hidden="true">
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(p.c, "#ffffff", 0.4)}"/><stop offset=".55" stop-color="${p.c}"/><stop offset="1" stop-color="${p.cd}"/></linearGradient></defs>
      <path d="M32 44 Q32 34 44 34 H176 Q188 34 188 44 L200 150 Q200 166 184 166 H36 Q20 166 20 150Z" fill="url(#${g})"/>
      <path d="M36 50 H184" stroke="#fff" stroke-width="5" stroke-dasharray="4 4" opacity=".85"/>
      <path d="M150 50 l6 22 h-12z" fill="#e3b46e"/><circle cx="150" cy="76" r="5" fill="#e3b46e"/>
      <path d="M110 94 C100 82 82 90 92 106 L110 124 L128 106 C138 90 120 82 110 94Z" fill="#fff" opacity=".9"/>
      <text x="110" y="150" text-anchor="middle" font-family="Great Vibes, cursive" font-size="22" fill="#fff">edwina</text>
      <path d="M40 60 Q36 110 44 150" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".35"/>
      ${glitter(40, 26, 196, 56, 162, 1.8)}
    </svg>`;
  },

  trio: () => {
    const t = (id, x, y, r) => `<svg x="${x}" y="${y}" width="96" height="240" viewBox="0 0 120 300"><g transform="rotate(${r} 60 150)">${glossInner(byId[id], false)}</g></svg>`;
    return `<svg class="product" viewBox="0 0 260 300" aria-hidden="true">
      ${t("champagne", 6, 40, -12)}${t("strawberry", 158, 40, 12)}${t("bubblegum", 82, 10, 0)}
      <path d="M40 270 Q130 250 220 270" stroke="#ff3d8b" stroke-width="10" fill="none" stroke-linecap="round"/>
    </svg>`;
  },

  gift: (p) => {
    const g = nid("gb");
    return `<svg class="product" viewBox="0 0 220 230" aria-hidden="true">
      <defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="#ffe3ef"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#ffd0e3"/></linearGradient></defs>
      <rect x="30" y="100" width="160" height="120" rx="14" fill="url(#${g})" stroke="#fff" stroke-width="2"/>
      <rect x="22" y="80" width="176" height="34" rx="10" fill="#ffc6dd"/>
      <rect x="98" y="80" width="24" height="140" fill="${p.c}"/>
      <rect x="22" y="88" width="176" height="14" fill="${p.c}" opacity=".0"/>
      <rect x="40" y="108" width="8" height="100" rx="4" fill="#fff" opacity=".8"/>
      <svg x="50" y="14" width="120" height="100" viewBox="0 0 200 170">
        <path fill="${p.c}" d="M100 70 C70 30 20 20 20 60 C20 95 70 95 100 75Z M100 70 C130 30 180 20 180 60 C180 95 130 95 100 75Z"/>
        <path fill="${p.cd}" d="M95 78 L66 148 L82 142 L90 156 L100 82Z M105 78 L134 148 L118 142 L110 156 L100 82Z"/>
        <path d="M35 55 C45 40 70 45 88 66" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/>
        <ellipse cx="100" cy="73" rx="15" ry="17" fill="${p.cd}"/>
      </svg>
      <text x="150" y="190" text-anchor="middle" font-family="Great Vibes, cursive" font-size="26" fill="${p.cd}">xo</text>
    </svg>`;
  },
};

function productSVG(p) {
  if (p.cat === "gloss") return SVG.gloss(p);
  if (p.cat === "oil") return SVG.oil(p);
  return SVG[p.shape](p);
}
const tintVars = (p) => `--tint:${mix(p.c, "#ffffff", 0.5)};--tint-l:${mix(p.c, "#ffffff", 0.82)}`;
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

/* =========================================================
   STATE (cart + wishlist, saved per browser)
   ========================================================= */
function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
let cart = load("edwina-cart", {});
let wish = new Set(load("edwina-wish", []));
cart = Object.fromEntries(Object.entries(cart).filter(([id]) => byId[id]));

/* =========================================================
   PRODUCT GRID
   ========================================================= */
const grid = $("#grid");
function renderGrid() {
  grid.innerHTML = PRODUCTS.map((p) => `
    <article class="card" data-cat="${p.cat}" data-id="${p.id}">
      <div class="card-media" style="${tintVars(p)}">
        ${p.badge ? `<span class="badge ${p.badgeType || ""}">${p.badge}</span>` : ""}
        <button class="heart ${wish.has(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 4.4 2.6.8-1.4 2.3-2.6 4.4-2.6 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z"/></svg>
        </button>
        ${productSVG(p)}
        <button class="quick" data-quick="${p.id}">Quick look ✨</button>
      </div>
      <div class="card-body">
        <span class="card-cat">${CAT_LABEL[p.cat]}</span>
        <h3 class="card-name">${p.name}</h3>
        <div class="rating">${stars(p.rating)}<small>(${p.reviews})</small></div>
        <div class="card-foot">
          <div><span class="price">${money(p.price)}</span>${p.old ? `<span class="old">${money(p.old)}</span>` : ""}</div>
          <button class="add" data-add="${p.id}"><span class="plus">+</span><span class="lbl">Add</span></button>
        </div>
      </div>
    </article>`).join("");
}
renderGrid();

/* filters */
const glider = $("#chipGlider");
function moveGlider() {
  const a = $(".chip.active");
  if (!a) return;
  glider.style.left = a.offsetLeft + "px";
  glider.style.top = a.offsetTop + "px";
  glider.style.width = a.offsetWidth + "px";
  glider.style.height = a.offsetHeight + "px";
}
$("#filters").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  $$(".chip").forEach((c) => c.classList.toggle("active", c === chip));
  moveGlider();
  const f = chip.dataset.filter;
  let i = 0;
  $$(".card", grid).forEach((card) => {
    const show = f === "all" || card.dataset.cat === f;
    card.classList.toggle("hide", !show);
    card.classList.remove("enter");
    if (show) {
      void card.offsetWidth;
      card.style.animationDelay = i++ * 55 + "ms";
      card.classList.add("enter");
    }
  });
});
window.addEventListener("resize", moveGlider);
document.fonts && document.fonts.ready.then(moveGlider);
moveGlider();

/* grid clicks */
grid.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  const heart = e.target.closest("[data-wish]");
  const quick = e.target.closest("[data-quick]");
  if (add) {
    addToCart(add.dataset.add, 1, add);
    add.classList.add("added");
    add.querySelector(".plus").textContent = "✓";
    add.querySelector(".lbl").textContent = "Added";
    clearTimeout(add._t);
    add._t = setTimeout(() => {
      add.classList.remove("added");
      add.querySelector(".plus").textContent = "+";
      add.querySelector(".lbl").textContent = "Add";
    }, 1400);
  } else if (heart) {
    toggleWish(heart.dataset.wish, heart);
  } else if (quick) {
    openModal(quick.dataset.quick);
  } else if (e.target.closest(".card-media")) {
    openModal(e.target.closest(".card").dataset.id);
  }
});

/* 3D tilt + glare */
if (finePointer && !reduceMotion) {
  grid.addEventListener("pointermove", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.setProperty("--ry", (x - 0.5) * 12 + "deg");
    card.style.setProperty("--rx", (0.5 - y) * 10 + "deg");
    card.style.setProperty("--mx", x * 100 + "%");
    card.style.setProperty("--my", y * 100 + "%");
  });
  grid.addEventListener("pointerout", (e) => {
    const card = e.target.closest(".card");
    if (card && !card.contains(e.relatedTarget)) {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    }
  });
}

/* =========================================================
   WISHLIST
   ========================================================= */
function updateWishCount(pop) {
  const el = $("#wishCount");
  el.textContent = wish.size;
  if (pop) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
}
function toggleWish(id, btn) {
  const on = !wish.has(id);
  on ? wish.add(id) : wish.delete(id);
  save("edwina-wish", [...wish]);
  btn.classList.toggle("on", on);
  updateWishCount(true);
  toast(on ? `💗 Saved ${byId[id].name} to your wishlist` : `Removed from wishlist`);
  if (on) burst(btn);
}
$("#wishBtn").addEventListener("click", () => {
  if (!wish.size) return toast("Tap the 💗 on any product to save it");
  toast(`💗 ${[...wish].map((id) => byId[id].name).join(", ")}`);
});
updateWishCount();

/* =========================================================
   CART
   ========================================================= */
const drawer = $("#drawer"), scrim = $("#scrim");
const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
const cartTotal = () => Object.entries(cart).reduce((s, [id, q]) => s + byId[id].price * q, 0);

function addToCart(id, qty = 1, srcEl) {
  cart[id] = (cart[id] || 0) + qty;
  save("edwina-cart", cart);
  if (srcEl) flyToBag(srcEl, byId[id].c);
  setTimeout(() => {
    renderCart();
    const bag = $("#bagBtn");
    bag.classList.remove("bump"); void bag.offsetWidth; bag.classList.add("bump");
    const c = $("#bagCount"); c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop");
  }, srcEl && !reduceMotion ? 750 : 0);
  toast(`💋 ${byId[id].name} added to your bag`);
}

function flyToBag(el, color) {
  if (reduceMotion) return;
  const from = el.getBoundingClientRect(), to = $("#bagBtn").getBoundingClientRect();
  const dot = document.createElement("div");
  dot.className = "fly";
  dot.style.setProperty("--c", color);
  dot.style.left = from.left + from.width / 2 - 13 + "px";
  dot.style.top = from.top + from.height / 2 - 13 + "px";
  document.body.appendChild(dot);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    dot.style.transform = `translate(${to.left + to.width / 2 - (from.left + from.width / 2)}px, ${to.top + to.height / 2 - (from.top + from.height / 2)}px) scale(.4)`;
    dot.style.opacity = ".6";
  }));
  setTimeout(() => dot.remove(), 850);
  burst(el);
}

function renderCart() {
  const count = cartCount(), total = cartTotal();
  $("#bagCount").textContent = count;
  $("#subtotal").textContent = money(total);
  const left = Math.max(0, CONFIG.freeShipping - total);
  $("#shipText").textContent = left > 0
    ? `You're ${money(left)} away from free shipping 🎀`
    : "Yay! You've unlocked free shipping 🎉";
  $("#shipBar").style.setProperty("--p", Math.min(100, (total / CONFIG.freeShipping) * 100) + "%");

  const items = $("#drawerItems");
  if (!count) {
    items.innerHTML = `<div class="empty"><span class="big-emoji">💄</span><h4>Your bag is feeling empty</h4><p>Let's fix that, pretty.</p><br><a href="#shop" class="btn btn-gloss btn-sm" data-close><span>Start shopping</span></a></div>`;
    return;
  }
  items.innerHTML = Object.entries(cart).map(([id, q]) => {
    const p = byId[id];
    return `<div class="line" data-line="${id}">
      <div class="line-media" style="${tintVars(p)}">${productSVG(p)}</div>
      <div><h4>${p.name}</h4><div class="lp">${money(p.price * q)}</div><button class="remove" data-remove="${id}">remove</button></div>
      <div class="qty"><button data-dec="${id}" aria-label="Decrease">−</button><span>${q}</span><button data-inc="${id}" aria-label="Increase">+</button></div>
    </div>`;
  }).join("");
}

$("#drawerItems").addEventListener("click", (e) => {
  const t = e.target.closest("button, a");
  if (!t) return;
  if (t.dataset.close !== undefined) return closeDrawer();
  const id = t.dataset.inc || t.dataset.dec || t.dataset.remove;
  if (!id) return;
  if (t.dataset.inc) cart[id]++;
  if (t.dataset.dec) cart[id]--;
  if (t.dataset.remove || cart[id] <= 0) {
    const line = t.closest(".line");
    line.classList.add("out");
    delete cart[id];
    save("edwina-cart", cart);
    setTimeout(renderCart, 300);
    return;
  }
  save("edwina-cart", cart);
  renderCart();
});

function openDrawer() { drawer.classList.add("open"); scrim.classList.add("show"); drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("locked"); }
function closeDrawer() { drawer.classList.remove("open"); scrim.classList.remove("show"); drawer.setAttribute("aria-hidden", "true"); document.body.classList.remove("locked"); }
$("#bagBtn").addEventListener("click", openDrawer);
$("#closeDrawer").addEventListener("click", closeDrawer);
scrim.addEventListener("click", closeDrawer);

$("#checkoutBtn").addEventListener("click", () => {
  if (!cartCount()) return toast("Your bag is empty — go treat yourself 💕");
  if (CONFIG.whatsapp) {
    const lines = Object.entries(cart).map(([id, q]) => `• ${q} × ${byId[id].name} — ${money(byId[id].price * q)}`);
    const msg = `Hi Edwina! 💋 I'd like to order:\n${lines.join("\n")}\n\nTotal: ${money(cartTotal())}`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    return;
  }
  confetti();
  toast("🎉 Order placed! (demo checkout) Thank you, gorgeous");
  cart = {};
  save("edwina-cart", cart);
  setTimeout(() => { renderCart(); closeDrawer(); }, 1600);
});
renderCart();

/* =========================================================
   QUICK VIEW MODAL
   ========================================================= */
const modal = $("#modal");
let modalId = null, modalQty = 1;
function openModal(id) {
  const p = byId[id];
  modalId = id; modalQty = 1;
  $("#modalMedia").setAttribute("style", tintVars(p));
  $("#modalMedia").innerHTML = productSVG(p);
  $("#modalCat").textContent = CAT_LABEL[p.cat];
  $("#modalName").textContent = p.name;
  $("#modalRating").innerHTML = `${stars(p.rating)}<small>${p.rating} · ${p.reviews} reviews</small>`;
  $("#modalRating").className = "rating";
  $("#modalDesc").textContent = p.vibe;
  $("#modalPrice").textContent = money(p.price);
  $("#modalOld").textContent = p.old ? money(p.old) : "";
  $("#modalOld").className = "old";
  $("#qtyVal").textContent = 1;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
}
function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("locked"); }
$("#closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
$("#qtyMinus").addEventListener("click", () => { modalQty = Math.max(1, modalQty - 1); $("#qtyVal").textContent = modalQty; });
$("#qtyPlus").addEventListener("click", () => { modalQty = Math.min(20, modalQty + 1); $("#qtyVal").textContent = modalQty; });
$("#modalAdd").addEventListener("click", (e) => { addToCart(modalId, modalQty, e.currentTarget); setTimeout(closeModal, 350); });
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (modal.classList.contains("open")) closeModal();
  else if (drawer.classList.contains("open")) closeDrawer();
});

/* =========================================================
   HERO — glitter + shade swatches
   ========================================================= */
$("#heroGlitter").innerHTML = Array.from({ length: 34 }, () => {
  const x = 70 + Math.random() * 100, y = 270 + Math.random() * 250;
  return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(Math.random() * 2.4 + 0.8).toFixed(1)}" style="animation-delay:${(-Math.random() * 2.4).toFixed(2)}s"/>`;
}).join("");

const HERO_SHADES = ["bubblegum", "strawberry", "cherry", "champagne", "berry", "peach"];
const heroSw = $("#heroSwatches");
heroSw.innerHTML = HERO_SHADES.map((id, i) =>
  `<button class="swatch ${i === 0 ? "active" : ""}" data-hero="${id}" style="--c:${byId[id].c};--cd:${byId[id].cd}" aria-label="${byId[id].name}"></button>`).join("");
function setHeroShade(id) {
  const p = byId[id];
  document.documentElement.style.setProperty("--hero-gloss", p.c);
  document.documentElement.style.setProperty("--hero-gloss-dark", p.cd);
  $$(".swatch", heroSw).forEach((s) => s.classList.toggle("active", s.dataset.hero === id));
}
heroSw.addEventListener("click", (e) => {
  const s = e.target.closest("[data-hero]");
  if (!s) return;
  setHeroShade(s.dataset.hero);
  clearInterval(heroCycle);
});
let hi = 0;
const heroCycle = reduceMotion ? null : setInterval(() => setHeroShade(HERO_SHADES[(hi = (hi + 1) % HERO_SHADES.length)]), 4200);
setHeroShade("bubblegum");

/* =========================================================
   SHADE FINDER (virtual swatch)
   ========================================================= */
const SHADES = PRODUCTS.filter((p) => p.cat === "gloss");
const shadeSw = $("#shadeSwatches");
shadeSw.innerHTML = SHADES.map((p, i) =>
  `<button class="swatch ${i === 0 ? "active" : ""}" data-shade="${p.id}" style="--c:${p.c};--cd:${p.cd}" aria-label="${p.name}"><span>${p.name}</span></button>`).join("");

let currentShade = SHADES[0].id, swipeRaf = 0;
const lipBase = $("#lipBase"), lipSwipe = $("#lipSwipe");
lipBase.setAttribute("fill", SHADES[0].c);

function setShade(id) {
  if (id === currentShade) return;
  const p = byId[id];
  currentShade = id;
  $$(".swatch", shadeSw).forEach((s) => s.classList.toggle("active", s.dataset.shade === id));

  // info panel
  const info = $(".shade-info");
  info.classList.remove("fade-swap"); void info.offsetWidth; info.classList.add("fade-swap");
  $("#shadeKicker").textContent = p.kicker;
  $("#shadeName").textContent = p.name;
  $("#shadeVibe").textContent = p.vibe;
  $("#shadePrice").textContent = money(p.price);

  // swipe animation
  cancelAnimationFrame(swipeRaf);
  lipSwipe.setAttribute("fill", p.c);
  const wand = $("#swipeWand");
  wand.style.setProperty("--wc", p.c);
  wand.classList.remove("go"); void wand.offsetWidth; wand.classList.add("go");
  const dur = reduceMotion ? 1 : 950, t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    lipSwipe.setAttribute("width", (e * 400).toFixed(1));
    if (k < 1) swipeRaf = requestAnimationFrame(step);
    else { lipBase.setAttribute("fill", p.c); lipSwipe.setAttribute("width", 0); sparkleLips(); }
  };
  swipeRaf = requestAnimationFrame(step);
}
shadeSw.addEventListener("click", (e) => { const s = e.target.closest("[data-shade]"); if (s) setShade(s.dataset.shade); });
$("#shadeAdd").addEventListener("click", (e) => addToCart(currentShade, 1, e.currentTarget));

function sparkleLips() {
  if (reduceMotion) return;
  const host = $("#lipsSparkles");
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.style.left = 18 + Math.random() * 64 + "%";
    s.style.top = 25 + Math.random() * 50 + "%";
    s.style.animationDelay = Math.random() * 0.4 + "s";
    const size = 8 + Math.random() * 14;
    s.style.width = s.style.height = size + "px";
    host.appendChild(s);
    setTimeout(() => s.remove(), 1500);
  }
}

/* =========================================================
   DROP — big tube + countdown
   ========================================================= */
$("#dropVisual").innerHTML = `<svg viewBox="0 0 120 300" aria-hidden="true">${glossInner({ ...byId.cherry, cap: "gold", glitter: true })}</svg>`;

function nextDrop() {
  const d = new Date();
  d.setHours(18, 0, 0, 0);
  const add = (5 - d.getDay() + 7) % 7 || 7; // next Friday, 6pm
  d.setDate(d.getDate() + add);
  return d;
}
const dropAt = nextDrop();
const cd = { D: $("#cdD"), H: $("#cdH"), M: $("#cdM"), S: $("#cdS") };
function tickCountdown() {
  let s = Math.max(0, Math.floor((dropAt - Date.now()) / 1000));
  const vals = { D: Math.floor(s / 86400), H: Math.floor((s % 86400) / 3600), M: Math.floor((s % 3600) / 60), S: s % 60 };
  for (const k in vals) {
    const v = String(vals[k]).padStart(2, "0");
    if (cd[k].textContent !== v) {
      cd[k].textContent = v;
      cd[k].classList.remove("tick"); void cd[k].offsetWidth; cd[k].classList.add("tick");
    }
  }
}
tickCountdown();
setInterval(tickCountdown, 1000);
$("#dropBtn").addEventListener("click", (e) => addToCart("cherry", 1, e.currentTarget));

/* =========================================================
   TESTIMONIALS + INSTA
   ========================================================= */
const LOVE = [
  ["Amara", "Lagos", "The Strawberry Glaze is literally my personality now. Not sticky AT ALL and it smells sooo good.", "#ff7eb6", "#d81b6a"],
  ["Chloe", "London", "Bought the trio for my bestie's birthday and ended up keeping one for myself. No regrets 🎀", "#f6c4ff", "#9b4de0"],
  ["Zainab", "Abuja", "Packaging is so cute I didn't want to open it. The bow clip is now in every single outfit.", "#ffb38f", "#e47b55"],
  ["Sofia", "Madrid", "Pink Champagne under the sun = actual glass. Every girl asked me what I was wearing.", "#ffc6dd", "#ff3d8b"],
  ["Tolu", "Toronto", "Cherry lip oil is the only thing that keeps my lips soft in winter. Repurchased 4 times!!", "#ff8cc0", "#b3123f"],
  ["Mia", "New York", "Delivery was fast and they added a handwritten note 🥹 customer for life.", "#e2c6ff", "#7b2fa8"],
  ["Ada", "Port Harcourt", "Crystal Clear over a liner is my everyday look. That glitter catches the light so pretty.", "#ffd6ea", "#e05a9a"],
];
const loveHTML = LOVE.map(([n, city, q, c1, c2]) => `
  <div class="love">
    <div class="rating">★★★★★</div>
    <p>“${q}”</p>
    <div class="love-who"><span class="avatar" style="--c1:${c1};--c2:${c2}">${n[0]}</span><div><strong>${n}</strong><span>${city} · verified buyer</span></div></div>
  </div>`).join("");
$("#loveTrack").innerHTML = loveHTML + loveHTML;

const INSTA = ["cherry", "bow", "champagne", "mirror", "oil-cherry", "scrunchie"];
$("#insta").innerHTML = INSTA.map((id) => {
  const p = byId[id];
  return `<a href="#" class="insta-tile" style="--t1:${mix(p.c, "#ffffff", 0.7)};--t2:${mix(p.c, "#ffffff", 0.3)}" aria-label="${p.name} on Instagram">
    ${productSVG(p)}<span class="ig-over">💗 ${(Math.random() * 3 + 1).toFixed(1)}k</span></a>`;
}).join("");

/* =========================================================
   NEWSLETTER
   ========================================================= */
$("#newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  confetti();
  toast("💌 Welcome to the Gloss Club! Check your inbox for 10% off");
});

/* =========================================================
   DECOR — drips, bubbles, footer pool
   ========================================================= */
function buildDrips() {
  const band = $("#dripBand");
  band.innerHTML = "";
  const w = window.innerWidth;
  let x = 10;
  while (x < w) {
    const dw = 14 + Math.random() * 22, dh = 18 + Math.random() * 46;
    const d = document.createElement("span");
    d.className = "drip";
    Object.assign(d.style, { left: x + "px", width: dw + "px", height: dh + "px",
      animationDuration: 2.5 + Math.random() * 3 + "s", animationDelay: -Math.random() * 4 + "s" });
    band.appendChild(d);
    if (Math.random() < 0.45) {
      const drop = document.createElement("span");
      drop.className = "drip-drop";
      const s = dw * 0.55;
      Object.assign(drop.style, { left: x + dw / 2 - s / 2 + "px", top: 18 + dh + "px", width: s + "px", height: s * 1.2 + "px",
        animationDuration: 3 + Math.random() * 4 + "s", animationDelay: -Math.random() * 6 + "s" });
      band.appendChild(drop);
    }
    x += dw + 30 + Math.random() * 90;
  }
}
buildDrips();

function buildFooterPool() {
  const pool = $(".footer-drip");
  pool.innerHTML = "";
  let x = -40;
  while (x < window.innerWidth + 40) {
    const w = 80 + Math.random() * 120, h = 20 + Math.random() * 24;
    const i = document.createElement("i");
    Object.assign(i.style, { left: x + "px", width: w + "px", height: h + "px" });
    pool.appendChild(i);
    x += w * 0.6;
  }
}
buildFooterPool();

let rz;
window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { buildDrips(); buildFooterPool(); }, 200); });

if (!reduceMotion) {
  const bubbles = $("#bubbles");
  for (let i = 0; i < 14; i++) {
    const b = document.createElement("span");
    b.className = "bubble";
    const s = 10 + Math.random() * 34;
    Object.assign(b.style, { width: s + "px", height: s + "px", left: Math.random() * 100 + "%",
      animationDuration: 14 + Math.random() * 16 + "s", animationDelay: -Math.random() * 30 + "s" });
    bubbles.appendChild(b);
  }
}

/* =========================================================
   FX — toast, burst, confetti, cursor trail
   ========================================================= */
function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  const host = $("#toasts");
  host.appendChild(t);
  while (host.children.length > 3) host.firstChild.remove();
  setTimeout(() => t.remove(), 3100);
}

const PINKS = ["#ff3d8b", "#ff7eb6", "#ffc6dd", "#d81b6a", "#f6c4ff", "#ffffff", "#ffb38f"];
function burst(el) {
  if (reduceMotion) return;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let i = 0; i < 12; i++) {
    const d = document.createElement("span");
    d.className = "trail";
    const a = (Math.PI * 2 * i) / 12, dist = 30 + Math.random() * 30;
    d.style.left = cx + "px"; d.style.top = cy + "px";
    d.style.background = PINKS[i % PINKS.length];
    d.style.setProperty("--dx", Math.cos(a) * dist + "px");
    d.style.setProperty("--dy", Math.sin(a) * dist + "px");
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 900);
  }
}

const cv = $("#confetti"), ctx = cv.getContext("2d");
let parts = [], confettiRaf = 0;
function heartPath(x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s * 0.3);
  ctx.bezierCurveTo(x - s / 2, y + s * 0.6, x, y + s * 0.8, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.8, x + s / 2, y + s * 0.6, x + s / 2, y + s * 0.3);
  ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s * 0.3);
  ctx.fill();
}
function confetti() {
  if (reduceMotion) return;
  cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  for (let i = 0; i < 160; i++) {
    parts.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.55,
      vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 16 - 6,
      s: 6 + Math.random() * 10, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      c: PINKS[(Math.random() * PINKS.length) | 0], k: (Math.random() * 3) | 0, life: 0,
    });
  }
  cancelAnimationFrame(confettiRaf);
  const loop = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach((p) => {
      p.vy += 0.38; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.max(0, 1 - p.life / 160);
      if (p.k === 0) heartPath(0, -p.s / 2, p.s);
      else if (p.k === 1) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2.5, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-p.s / 2, -p.s / 5, p.s, p.s / 2.5);
      ctx.restore();
    });
    parts = parts.filter((p) => p.y < innerHeight + 40 && p.life < 160);
    if (parts.length) confettiRaf = requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, innerWidth, innerHeight);
  };
  loop();
}

if (finePointer && !reduceMotion) {
  let lx = 0, ly = 0;
  window.addEventListener("pointermove", (e) => {
    if (Math.hypot(e.clientX - lx, e.clientY - ly) < 22) return;
    lx = e.clientX; ly = e.clientY;
    const d = document.createElement("span");
    d.className = "trail";
    const s = 5 + Math.random() * 7;
    Object.assign(d.style, { left: lx + "px", top: ly + "px", width: s + "px", height: s + "px",
      background: `radial-gradient(circle at 30% 30%, #fff, ${PINKS[(Math.random() * 4) | 0]})` });
    d.style.setProperty("--dx", (Math.random() - 0.5) * 30 + "px");
    d.style.setProperty("--dy", 10 + Math.random() * 24 + "px");
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 900);
  }, { passive: true });
}

/* =========================================================
   NAV, REVEAL, LOADER
   ========================================================= */
const nav = $("#nav");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });
const burger = $("#burger"), navLinks = $("#navLinks");
burger.addEventListener("click", () => { burger.classList.toggle("open"); navLinks.classList.toggle("open"); });
navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) { burger.classList.remove("open"); navLinks.classList.remove("open"); } });

function startReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const sibs = [...en.target.parentElement.children].filter((c) => c.classList.contains("reveal"));
      en.target.style.transitionDelay = Math.max(0, sibs.indexOf(en.target)) * 90 + "ms";
      en.target.classList.add("in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
}

$("#year").textContent = new Date().getFullYear();

const t0 = performance.now();
function hideLoader() {
  const wait = Math.max(0, (reduceMotion ? 200 : 1700) - (performance.now() - t0));
  setTimeout(() => {
    $("#loader").classList.add("done");
    startReveal();
    moveGlider();
  }, wait);
}
if (document.readyState === "complete") hideLoader();
else window.addEventListener("load", hideLoader);
