/* Wonderyear — vanilla port of the DCLogic prototype */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const SEASONS = [
    { key: 'summer', label: 'SUMMER', accent: '#38B6E8', headline: 'Splash into the longest days of play',
      intro: 'Sunshine, water and wide-open laughter.',
      adv: [
        ['Splash Lagoon', 'Our giant water playground, from tiny fountains to the big slide.'],
        ['Treetop Trails', 'Rope bridges and lookouts high among the leaves.'],
        ['Sunny Meadow Games', 'Classic outdoor games, all day, all together.'],
        ['Ice-Cream Workshop', 'Mix, freeze and taste your own summer flavour.']
      ],
      say: [
        ['We came for one afternoon. We left with a season pass.', 'Marta, mom of two'],
        ['The only place my son voluntarily leaves his tablet for.', 'David, dad of Leo'],
        ['Splash Lagoon tired out my kids better than any beach holiday.', 'Julia, mom of Max']
      ] },
    { key: 'autumn', label: 'AUTUMN', accent: '#E8722C', headline: 'Jump in – the leaves are waiting',
      intro: 'Crunchy leaves, glowing lanterns, big discoveries.',
      adv: [
        ['The Great Leaf Maze', 'A maze rebuilt every week from real autumn leaves.'],
        ['Pumpkin Craft Lab', 'Carve, paint and invent your own pumpkin character.'],
        ['Lantern Walks', 'A gentle evening trail lit by lanterns the kids make themselves.'],
        ['Apple Press Corner', 'Turn real apples into your own cup of juice.']
      ],
      say: [
        ['The Leaf Maze is all my daughter has talked about for a week.', 'Sofia, mom of Nina'],
        ['Rainy Saturdays used to be a problem. Not anymore.', 'Tom, dad of three'],
        ['She came home with a lantern she made herself and slept with it on her shelf.', 'Emma, mom of Zoe']
      ] },
    { key: 'winter', label: 'WINTER', accent: '#7BC4E0', headline: 'The coziest winter adventure in town',
      intro: 'Snow outside, warm wonders inside.',
      adv: [
        ['Snowflake Park', 'Sledding hills, snow castles and friendly snowball zones.'],
        ['The Warm Burrow', "Our huge indoor soft-play world, cozy as a bear's den."],
        ['Tiny Skaters Rink', 'A first-steps ice rink with penguin helpers to hold.'],
        ['Cocoa & Stories', 'Hot chocolate and storytellers by the fireplace.']
      ],
      say: [
        ['Warm, safe and magical – even in January.', 'Anna, mom of Iga'],
        ['My kids now ask for snow. I blame Wonderyear.', 'Peter, dad of twins'],
        ['First skates, zero tears. The penguin helpers are genius.', 'Kate, mom of Oliver']
      ] },
    { key: 'spring', label: 'SPRING', accent: '#F27EB2', headline: "Everything's blooming. Especially the fun.",
      intro: 'Everything wakes up – and wants to play.',
      adv: [
        ['Garden Expeditions', 'Plant, dig and watch your own patch come alive.'],
        ['Butterfly House', 'Walk among hundreds of butterflies waking up for spring.'],
        ['Mud Kitchen Lab', 'The messiest, happiest cooking class in the world.'],
        ['Kite Hill', 'Build a kite, climb the hill, let the spring wind do the rest.']
      ],
      say: [
        ["My son grew a radish and hasn't stopped smiling since.", 'Laura, mom of Sam'],
        ['The Butterfly House alone is worth the trip.', 'Chris, dad of Mia'],
        ['The Mud Kitchen ruined one t-shirt and made his whole month.', 'Nadia, mom of Adam']
      ] }
  ];

  const ADV_ACCENT = {
    'Splash Lagoon': 'Splash', 'Treetop Trails': 'Treetop', 'Sunny Meadow Games': 'Sunny', 'Ice-Cream Workshop': 'Ice-Cream',
    'The Great Leaf Maze': 'Leaf', 'Pumpkin Craft Lab': 'Pumpkin', 'Lantern Walks': 'Lantern', 'Apple Press Corner': 'Apple',
    'Snowflake Park': 'Snowflake', 'The Warm Burrow': 'Warm', 'Tiny Skaters Rink': 'Skaters', 'Cocoa & Stories': 'Cocoa',
    'Garden Expeditions': 'Garden', 'Butterfly House': 'Butterfly', 'Mud Kitchen Lab': 'Mud', 'Kite Hill': 'Kite'
  };
  const DAY_PASS_NAMES = { summer: 'Splash Pass', autumn: 'Leaf Pass', winter: 'Snow Pass', spring: 'Bloom Pass' };
  const DAY_STOPS = [
    ['9:00', 'Welcome Circle', "Songs, smiles and today's adventure plan."],
    ['10:00', 'The Big Adventure', "This season's flagship, all morning long."],
    ['12:30', 'Picnic Lunch', 'Outdoors in the sun, or in the Warm Burrow.'],
    ['14:00', 'Quiet Corner & Stories', 'Time to rest, read and dream a little.'],
    ['15:30', 'Free Play Everywhere', 'The whole of Wonderyear, wide open.'],
    ['17:00', 'The Goodbye Song', 'The hardest part of the day: going home.']
  ];
  const MAP_ZONES = [
    { key: 'pond', x: 24, y: 76, titles: { summer: 'Splash Lagoon', autumn: 'Apple Press Corner', winter: 'Tiny Skaters Rink', spring: 'Mud Kitchen Lab' } },
    { key: 'hill', x: 79, y: 77, titles: { summer: 'Sunny Meadow Games', autumn: 'The Great Leaf Maze', winter: 'Snowflake Park', spring: 'Kite Hill' } },
    { key: 'trees', x: 75, y: 27, titles: { summer: 'Treetop Trails', autumn: 'Lantern Walks', winter: 'The Warm Burrow', spring: 'Butterfly House' } },
    { key: 'hut', x: 20, y: 33, titles: { summer: 'Ice-Cream Workshop', autumn: 'Pumpkin Craft Lab', winter: 'Cocoa & Stories', spring: 'Garden Expeditions' } }
  ];
  const autumnTints = ['#E8722C', '#C75A1F', '#F0A048'];
  const springTints = ['#F7B7D2', '#F27EB2', '#FFD9E8'];

  const season = k => SEASONS.find(s => s.key === k) || SEASONS[0];
  const escapeHTML = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const accentTitle = (title) => {
    const word = ADV_ACCENT[title];
    if (!word) return escapeHTML(title);
    const i = title.indexOf(word);
    return escapeHTML(title.slice(0, i)) + '<mark>' + escapeHTML(word) + '</mark>' + escapeHTML(title.slice(i + word.length));
  };

  function autoKey() {
    const m = new Date().getMonth();
    return m >= 2 && m <= 4 ? 'spring' : m >= 5 && m <= 7 ? 'summer' : m >= 8 && m <= 10 ? 'autumn' : 'winter';
  }

  // ---------- Elements ----------
  const page = $('.page');
  const nav = $('#nav');
  const hero = $('#hero');
  const heroContent = $('#heroContent');
  const headlineEl = $('#headline');
  const canvas = $('#canvas');
  const ctx = canvas.getContext('2d');
  const announce = $('#announce');

  let active = autoKey();
  let cardSeason = active;
  let ready = false;
  let trans = null;         // ongoing bloom transition
  let particles = [];
  let cw = 0, ch = 0;
  const jitter = [1, 0.82, 0.95, 1.08, 0.78, 1.02, 0.9, 1.12, 0.85, 1.0, 0.8, 1.06, 0.92, 0.88];
  const mqMobile = window.matchMedia('(max-width: 760px)');
  const mqTablet = window.matchMedia('(max-width: 1024px)');

  // ---------- Build static content ----------
  function buildAdventures() {
    const list = $('#advList');
    list.innerHTML = SEASONS[0].adv.map((_, i) => {
      const right = i % 2 === 1;
      return `<article class="adv-row${right ? ' adv-row--right' : ''}" data-adv="${i}">
        <div class="adv-row__text"><h3></h3><p></p></div>
        <div class="adv-row__img" role="img"></div>
      </article>`;
    }).join('');
  }
  function buildParents() {
    $('#parentsGrid').innerHTML = [0, 1, 2].map(i => {
      const tilt = ['-1.6deg', '1.2deg', '-1deg'][i];
      const tailLeft = ['34px', '46px', '38px'][i];
      const dur = [4.6, 5.4, 5.0][i], delay = [0, 0.9, 1.7][i];
      const floatStyle = reduced ? '' : `animation:wy-drift ${dur}s ease-in-out ${delay}s infinite;`;
      return `<figure class="pa-card" data-pa="${i}">
        <div class="pa-card__float" style="${floatStyle}">
          <div class="pa-card__img" role="img"></div>
          <blockquote style="transform:rotate(${tilt})">
            <span class="pa-card__quote" aria-hidden="true">&#8220;</span>
            <p></p>
            <span class="pa-card__tail" style="left:${tailLeft}"></span>
          </blockquote>
          <figcaption style="padding-left:${tailLeft}"></figcaption>
        </div>
      </figure>`;
    }).join('');
  }
  function buildPick() {
    $('#pickGrid').innerHTML = `
      <article class="pk-card" data-pk="0">
        <div class="pk-card__eyebrow">Day Pass</div>
        <h3 class="pk-day-name"></h3>
        <p>One full day of everything this season has to offer.</p>
      </article>
      <article class="pk-card pk-card--featured" data-pk="1">
        <h3>Season Pass</h3>
        <p>Unlimited visits for the whole season.</p>
        <p class="pk-card__line"><mark>Come back as often as the weather changes.</mark></p>
      </article>
      <article class="pk-card" data-pk="2">
        <h3>Wonderyear Pass</h3>
        <p>All four seasons. The full journey, one pass.</p>
        <p class="pk-card__line pk-card__line--plain"><mark>See the same magical place become four different worlds.</mark></p>
      </article>`;
  }
  function buildDay() {
    $('#dayStops').innerHTML = DAY_STOPS.map(d =>
      `<div class="day__stop"><div class="day__time">${escapeHTML(d[0])}</div><h3>${escapeHTML(d[1])}</h3><p>${escapeHTML(d[2])}</p></div>`
    ).join('');
    $('#dayDots').innerHTML = DAY_STOPS.map((_, i) => {
      const t = (i + 0.5) / 6;
      return `<div class="day__dot" data-t="${t}" style="left:${t * 100}%;top:${(92 - 308 * t * (1 - t))}%"></div>`;
    }).join('');
  }
  function buildMapSpots() {
    $('#mapHotspots').innerHTML = MAP_ZONES.map(z =>
      `<button class="map__spot" data-zone="${z.key}" style="left:${z.x}%;top:${z.y}%"></button>`
    ).join('');
  }

  // ---------- Season content application ----------
  function applyCardContent(key) {
    const s = season(key);
    $('#advIntro').textContent = s.intro;
    $$('#advList .adv-row').forEach((row, i) => {
      const a = s.adv[i];
      row.querySelector('h3').innerHTML = accentTitle(a[0]);
      const p = row.querySelector('p'); p.textContent = a[1];
      const img = row.querySelector('.adv-row__img');
      img.style.backgroundImage = `url('assets/adv-${key}-${i + 1}.webp')`;
      img.setAttribute('aria-label', a[0] + ' – ' + a[1]);
    });
    $$('#parentsGrid .pa-card').forEach((card, i) => {
      const q = s.say[i];
      card.querySelector('blockquote p').textContent = q[0];
      card.querySelector('figcaption').textContent = '– ' + q[1];
      const img = card.querySelector('.pa-card__img');
      img.style.backgroundImage = `url('assets/say-${key}-${i + 1}.webp')`;
      img.setAttribute('aria-label', 'Illustrated portrait of ' + q[1]);
    });
    $('.pk-day-name').textContent = DAY_PASS_NAMES[key];
    // active-season toggles on stacked images / skies
    ['.map__img', '.visit__sky', '.visit__ground-img'].forEach(sel =>
      $$(sel).forEach(el => el.classList.toggle('is-active', el.dataset.season === key)));
  }

  function setActive(key) {
    active = key;
    page.dataset.season = key;
    page.style.setProperty('--accent', season(key).accent);
    $$('#nav .seasons__item').forEach(b =>
      b.setAttribute('aria-current', b.dataset.skey === key ? 'true' : 'false'));
    headlineEl.textContent = season(key).headline;
    announce.textContent = 'Season: ' + season(key).label;
  }

  // ---------- Bloom transition (clip-path + canvas particles) ----------
  function blobPath(ox, oy, R) {
    const J = jitter, n = J.length, pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      pts.push([ox + Math.cos(a) * R * J[i], oy + Math.sin(a) * R * J[i]]);
    }
    let d = 'M' + ((pts[0][0] + pts[1][0]) / 2).toFixed(1) + ' ' + ((pts[0][1] + pts[1][1]) / 2).toFixed(1);
    for (let i = 1; i <= n; i++) {
      const p = pts[i % n], q = pts[(i + 1) % n];
      d += ' Q' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' ' + ((p[0] + q[0]) / 2).toFixed(1) + ' ' + ((p[1] + q[1]) / 2).toFixed(1);
    }
    return d + ' Z';
  }

  const heroImg = key => $(`.hero__img[data-season="${key}"]`);

  function settleHero(key) {
    $$('.hero__img').forEach(el => {
      el.style.transition = ''; el.style.clipPath = ''; el.style.transform = '';
      el.classList.toggle('is-active', el.dataset.season === key);
      el.style.zIndex = el.dataset.season === key ? '2' : '1';
    });
  }

  function switchSeason(key, ox, oy) {
    if (!ready || trans || key === active) return;
    const r = hero.getBoundingClientRect();
    if (ox == null) ox = r.width / 2;
    if (oy == null) oy = r.height * 0.2;
    const inc = heroImg(key), cur = heroImg(active);
    if (!inc) return;

    heroContent.classList.add('is-hidden');
    closeTip();
    setTimeout(() => { heroContent.classList.remove('is-hidden'); setActive(key); }, 260);

    const flipDelay = reduced ? 360 : 520;
    startFlip();
    setTimeout(() => {
      dayP = -1; cardSeason = key; applyCardContent(key); endFlip();
      document.dispatchEvent(new Event('wy:season'));
    }, flipDelay);

    if (reduced) {
      trans = { reduced: true };
      inc.style.zIndex = '3'; if (cur) cur.style.zIndex = '2';
      inc.style.transition = 'opacity 0.5s ease'; inc.classList.add('is-active'); inc.style.opacity = '1';
      setTimeout(() => { settleHero(key); trans = null; }, 560);
      return;
    }

    const corners = [[0, 0], [r.width, 0], [0, r.height], [r.width, r.height]];
    const maxD = Math.max(...corners.map(c => Math.hypot(c[0] - ox, c[1] - oy)));
    inc.style.zIndex = '3'; if (cur) cur.style.zIndex = '2';
    inc.classList.add('is-active'); inc.style.opacity = '1';
    inc.style.clipPath = 'path("' + blobPath(ox, oy, 6) + '")';
    trans = { inc, key, ox, oy, start: performance.now(), dur: 1150, maxR: maxD / 0.7 };
  }

  function spawnEdge(tr, R) {
    const n = jitter.length, i = Math.floor(Math.random() * n);
    const a = ((i + Math.random()) / n) * Math.PI * 2, j = jitter[i];
    const x = tr.ox + Math.cos(a) * R * j, y = tr.oy + Math.sin(a) * R * j;
    if (x < -30 || x > cw + 30 || y < -30 || y > ch + 30) return;
    const v = 1.2 + Math.random() * 2.6;
    particles.push({
      x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.5,
      life: 0, max: 34 + Math.random() * 32, season: tr.key, ambient: false,
      size: 2.2 + Math.random() * 4, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.25,
      tint: tr.key === 'autumn' ? autumnTints[Math.floor(Math.random() * 3)]
          : tr.key === 'spring' ? springTints[Math.floor(Math.random() * 3)] : null
    });
  }

  function spawnAmbient(key, w, h) {
    const p = { season: key, ambient: true, life: 0, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.06,
      tint: key === 'autumn' ? autumnTints[Math.floor(Math.random() * 3)]
          : key === 'spring' ? springTints[Math.floor(Math.random() * 3)] : null };
    if (key === 'summer') {
      p.x = Math.random() * w; p.y = h * (0.35 + Math.random() * 0.6);
      p.vx = (Math.random() - 0.5) * 0.4; p.vy = -0.15 - Math.random() * 0.25;
      p.size = 1.6 + Math.random() * 2.4; p.max = 260 + Math.random() * 200;
    } else {
      p.x = Math.random() * w; p.y = -12;
      p.vx = (Math.random() - 0.5) * 0.5; p.vy = 0.4 + Math.random() * (key === 'winter' ? 0.7 : 0.9);
      p.size = key === 'winter' ? 1.4 + Math.random() * 2.2 : 2.4 + Math.random() * 3.6; p.max = 3000;
    }
    particles.push(p);
  }

  function drawParticles() {
    const keep = [];
    for (const p of particles) {
      p.life++;
      if (!p.ambient) { p.vy += 0.03; p.vx *= 0.985; }
      else if (p.season === 'autumn' || p.season === 'spring') { p.x += Math.sin(p.life * 0.04 + p.rot) * 0.55; }
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.life > p.max || p.y > ch + 24 || p.y < -40 || p.x < -30 || p.x > cw + 30) continue;
      keep.push(p);
      const fade = p.ambient ? Math.min(1, p.life / 30) : 1 - p.life / p.max;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.beginPath();
      if (p.season === 'winter') {
        ctx.globalAlpha = 0.85 * fade; ctx.fillStyle = '#FFFFFF'; ctx.arc(0, 0, p.size, 0, 6.29); ctx.fill();
      } else if (p.season === 'autumn') {
        ctx.globalAlpha = 0.9 * fade; ctx.fillStyle = p.tint; ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, 6.29); ctx.fill();
      } else if (p.season === 'spring') {
        ctx.globalAlpha = 0.9 * fade; ctx.fillStyle = p.tint; ctx.ellipse(0, 0, p.size * 0.85, p.size * 0.5, 0, 0, 6.29); ctx.fill();
      } else {
        const tw = p.ambient ? 0.3 + 0.5 * Math.abs(Math.sin(p.life * 0.07 + p.rot)) : fade;
        ctx.globalAlpha = tw; ctx.shadowColor = '#FFD34D'; ctx.shadowBlur = 10;
        ctx.fillStyle = '#FFE9A8'; ctx.arc(0, 0, p.size * 0.6, 0, 6.29); ctx.fill();
      }
      ctx.restore();
    }
    particles = keep;
  }

  function sizeCanvas() {
    const r = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cw = r.width; ch = r.height;
  }

  // ---------- Day timeline ----------
  const dayDraw = $('#dayDraw'), daySun = $('#daySun'), daySection = $('#day');
  let dayP = -1;
  function tickDay() {
    const ih = window.innerHeight, r = daySection.getBoundingClientRect();
    if (r.bottom < -100 || r.top > ih + 100) return;
    let p = reduced ? 1 : Math.max(0, Math.min(1, (ih * 0.68 - r.top) / Math.max(r.height - ih * 0.32, r.height * 0.4)));
    if (p === dayP) return;
    dayP = p;
    const t = p * (11 / 12);
    dayDraw.style.clipPath = 'inset(-90% ' + (100 - t * 100) + '% -30% -5%)';
    daySun.style.left = (t * 100) + '%';
    daySun.style.top = (92 - 308 * t * (1 - t)) + '%';
    const accent = season(cardSeason).accent;
    $$('#dayDots .day__dot').forEach(el => {
      el.style.background = t >= parseFloat(el.dataset.t) - 0.002 ? accent : 'var(--cream)';
    });
  }

  // ---------- Flip helpers (adventures + parents) ----------
  function startFlip() {
    $$('#advList .adv-row.is-in').forEach(r => r.classList.add('is-flip'));
    $$('#parentsGrid .pa-card.is-in').forEach(c => c.classList.add('is-flip'));
    $('#advIntro').style.opacity = '0';
  }
  function endFlip() {
    $$('#advList .adv-row.is-flip').forEach(r => r.classList.remove('is-flip'));
    $$('#parentsGrid .pa-card.is-flip').forEach(c => c.classList.remove('is-flip'));
    $('#advIntro').style.opacity = '1';
  }

  // ---------- Map tooltip ----------
  const mapTip = $('#mapTip');
  let tipZoneKey = null;
  function showTip(z) {
    tipZoneKey = z.key;
    const title = z.titles[cardSeason];
    const adv = season(cardSeason).adv.find(a => a[0] === title);
    mapTip.querySelector('.map__tip-title').textContent = title;
    mapTip.querySelector('.map__tip-desc').textContent = adv ? adv[1] : '';
    mapTip.style.left = z.x + '%';
    mapTip.style.top = z.y + '%';
    mapTip.hidden = false;
  }
  function closeTip() { tipZoneKey = null; mapTip.hidden = true; }

  function wireMap() {
    $$('#mapHotspots .map__spot').forEach(btn => {
      const z = MAP_ZONES.find(zz => zz.key === btn.dataset.zone);
      btn.setAttribute('aria-label', z.titles[cardSeason]);
      let enteredAt = 0;
      btn.addEventListener('mouseenter', () => { enteredAt = Date.now(); showTip(z); });
      btn.addEventListener('mouseleave', () => { if (tipZoneKey === z.key) closeTip(); });
      btn.addEventListener('click', () => {
        const recent = Date.now() - enteredAt < 500;
        if (!recent && tipZoneKey === z.key) closeTip(); else showTip(z);
      });
    });
    // refresh aria labels on season change
    document.addEventListener('wy:season', () => {
      $$('#mapHotspots .map__spot').forEach(btn => {
        const z = MAP_ZONES.find(zz => zz.key === btn.dataset.zone);
        btn.setAttribute('aria-label', z.titles[cardSeason]);
      });
      if (tipZoneKey) showTip(MAP_ZONES.find(z => z.key === tipZoneKey));
    });
  }

  // ---------- Navigation / input ----------
  function pick(key, ev) {
    let ox = null, oy = null;
    if (ev && ev.currentTarget) {
      const r = hero.getBoundingClientRect(), b = ev.currentTarget.getBoundingClientRect();
      ox = b.left + b.width / 2 - r.left; oy = b.top + b.height / 2 - r.top;
    }
    switchSeason(key, ox, oy);
  }
  function cycle(dir) {
    const idx = SEASONS.findIndex(s => s.key === active);
    const nk = SEASONS[(idx + dir + SEASONS.length) % SEASONS.length].key;
    const btn = $(`#nav [data-skey="${nk}"]`);
    let ox = null, oy = null;
    if (btn) { const r = hero.getBoundingClientRect(), b = btn.getBoundingClientRect(); ox = b.left + b.width / 2 - r.left; oy = b.top + b.height / 2 - r.top; }
    switchSeason(nk, ox, oy);
  }

  // ---------- Scroll reveals ----------
  function revealObserver(sel, opts) {
    const io = new IntersectionObserver((entries, o) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); o.unobserve(e.target); } });
    }, opts || { threshold: 0.15 });
    $$(sel).forEach(el => io.observe(el));
  }

  // ---------- Init ----------
  function init() {
    buildAdventures(); buildParents(); buildPick(); buildDay(); buildMapSpots();
    setActive(active);
    applyCardContent(active);
    settleHero(active);
    sizeCanvas();
    wireMap();

    // nav clicks
    $$('#nav .seasons__item').forEach(b => {
      b.disabled = true;
      b.addEventListener('click', ev => pick(b.dataset.skey, ev));
    });

    // preload all hero images, then enable switcher
    Promise.all(SEASONS.map(s => new Promise(res => {
      const im = new Image(); im.onload = res; im.onerror = res; im.src = `assets/hero-${s.key}-16x9.webp`;
    }))).then(() => {
      ready = true;
      nav.classList.add('is-ready');
      $$('#nav .seasons__item').forEach(b => { b.disabled = false; });
    });

    // reveals
    revealObserver('#advList .adv-row', { threshold: 0.2 });
    revealObserver('#parentsGrid .pa-card', { threshold: 0.2 });
    revealObserver('#pickGrid .pk-card', { threshold: 0.2 });
    revealObserver('#visitContent', { threshold: 0.3 });
    const mapIO = new IntersectionObserver((e, o) => {
      if (e.some(x => x.isIntersecting)) { $('#mapFrame').classList.add('is-in'); o.disconnect(); }
    }, { threshold: 0.2 });
    mapIO.observe($('#mapFrame'));

    // back to top
    const toTop = $('#toTop');
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('is-show', window.scrollY > window.innerHeight * 0.7);
    }, { passive: true });

    // keyboard + swipe + resize
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); cycle(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); cycle(-1); }
    });
    let tx = null;
    hero.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      if (tx == null) return;
      const dx = e.changedTouches[0].clientX - tx; tx = null;
      if (dx > 60) cycle(-1); else if (dx < -60) cycle(1);
    }, { passive: true });
    window.addEventListener('resize', sizeCanvas);

    requestAnimationFrame(tick);
  }

  function tick(now) {
    tickDay();
    ctx.clearRect(0, 0, cw, ch);
    if (trans && !trans.reduced) {
      const t = (now - trans.start) / trans.dur;
      if (t >= 1) { settleHero(trans.key); trans = null; document.dispatchEvent(new Event('wy:season')); }
      else {
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const R = Math.max(6, e * trans.maxR);
        trans.inc.style.clipPath = 'path("' + blobPath(trans.ox, trans.oy, R) + '")';
        trans.inc.style.transform = 'scale(' + (1.05 - 0.05 * e).toFixed(4) + ')';
        if (t < 0.8) for (let i = 0; i < 9; i++) spawnEdge(trans, R);
      }
    }
    if (!reduced) {
      const ambientCount = particles.reduce((c, p) => c + (p.ambient ? 1 : 0), 0);
      if (ambientCount < 18 && Math.random() < 0.28) spawnAmbient(active, cw, ch);
    }
    drawParticles();
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
