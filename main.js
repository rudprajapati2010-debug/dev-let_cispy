const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* Loader */
window.addEventListener('load', () => {
  setTimeout(() => $('#loader').classList.add('hide'), 1600);
});

/* Typing effect */
const roles = ['websites.', 'Discord bots.', 'custom tools.', 'digital experiences.'];
let ri = 0, ci = 0, deleting = false;
const typingEl = $('#typing');
function typeLoop() {
  const word = roles[ri];
  if (!deleting) {
    typingEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1600); return; }
  } else {
    typingEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 85);
}
typeLoop();

/* Terminal animation */
const termLines = [
  { t: '$ > initializing portfolio...', c: 'cmd' },
  { t: '$ > loading projects...', c: 'cmd' },
  { t: '$ > developer.status = "available"', c: 'cmd' },
  { t: '$ > system.ready ✓', c: 'ok' }
];
const term = $('#term');
termLines.forEach((line, i) => {
  setTimeout(() => {
    const d = document.createElement('div');
    d.className = 'line ' + line.c;
    d.textContent = line.t;
    term.appendChild(d);
  }, 1800 + i * 450);
});

/* ID card tilt */
const card = $('#card');
const idcard = $('#idcard');
idcard.addEventListener('mousemove', e => {
  const r = idcard.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
});
idcard.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateY(0) rotateX(0)';
});

/* Projects data */
const projects = [
  { name: 'Obsidian Hearts', desc: 'Concept for a dark-themed community platform with custom dashboard and member tools.', tags: ['Web', 'UI', 'Dashboard'] },
  { name: 'Tx Vault', desc: 'Secure storage and management interface concept with clean data visualization.', tags: ['Web', 'Python'] },
  { name: 'LegendaryBot', desc: 'Feature-rich Discord bot concept with economy, levels, and moderation modules.', tags: ['Discord', 'Python'] },
  { name: 'GENS Bot', desc: 'Utility and automation bot designed for large communities and event servers.', tags: ['Discord', 'Automation'] },
  { name: 'Creator Dashboard', desc: 'Content creator panel concept for stats, links, and audience management.', tags: ['Web', 'UI'] },
  { name: 'Server Manager', desc: 'Admin toolkit concept for multi-server Discord management and analytics.', tags: ['Discord', 'Java'] },
  { name: 'Developer Hub', desc: 'Personal developer portal concept with project showcase and status cards.', tags: ['Web', 'HTML'] },
  { name: 'Utility Suite', desc: 'Collection of small tools and scripts for everyday automation tasks.', tags: ['Python', 'Tools'] }
];
const grid = $('#projectGrid');
projects.forEach(p => {
  const el = document.createElement('div');
  el.className = 'project reveal';
  el.innerHTML = `
    <div class="project-preview">
      <div class="mock">
        <div class="mock-side"></div>
        <div class="mock-main">
          <div class="mock-line" style="width:70%"></div>
          <div class="mock-line" style="width:90%"></div>
          <div class="mock-line" style="width:55%"></div>
          <div class="mock-line" style="width:80%"></div>
        </div>
      </div>
    </div>
    <div class="project-body">
      <div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
    </div>`;
  el.onclick = () => projectInfo(p.name, p.desc, p.tags.join(' · '));
  grid.appendChild(el);
});

function projectInfo(n, d, t) {
  openModal();
  $('#hireResult').innerHTML = `<b>${n}</b><br>${d}<br><br>Stack: ${t}<br><br>This is a portfolio/demo concept. Live demo and source links can be added when an actual project URL is available.`;
}

/* Reveal on scroll */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.12 });
$$('.reveal').forEach(x => io.observe(x));

/* Counters */
const co = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    let n = 0;
    const step = () => {
      n += Math.ceil(target / 25);
      if (n >= target) el.textContent = target;
      else { el.textContent = n; requestAnimationFrame(step); }
    };
    step();
    co.unobserve(el);
  });
}, { threshold: 0.6 });
$$('.counter').forEach(x => co.observe(x));

/* Skill bars */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
$$('.skill-card').forEach(c => skillObs.observe(c));

/* Scroll progress + active nav */
let scrollTick = false;
window.addEventListener('scroll', () => {
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    const total = document.documentElement.scrollHeight - innerHeight;
    $('#progress').style.width = (scrollY / total * 100) + '%';
    const sections = [...$$('section[id]')];
    const cur = sections.findLast(s => scrollY >= s.offsetTop - 160)?.id || 'home';
    $$('.links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    scrollTick = false;
  });
}, { passive: true });

/* Mobile menu */
$('#menu').onclick = () => $('#nav').classList.toggle('mobileopen');
$$('.links a').forEach(a => a.onclick = () => $('#nav').classList.remove('mobileopen'));

/* Theme */
$('#theme').onclick = () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  $('#theme').textContent = isLight ? '☾' : '☼';
  localStorage.theme = isLight ? 'light' : 'dark';
};
if (localStorage.theme === 'light') {
  document.body.classList.add('light');
  $('#theme').textContent = '☾';
}

/* Toast + copy */
function toast(t) {
  $('#toast').textContent = t;
  $('#toast').classList.add('show');
  setTimeout(() => $('#toast').classList.remove('show'), 1600);
}
async function copy(t) {
  try { await navigator.clipboard.writeText(t); toast('Copied ✓'); }
  catch { toast(t); }
}
$('#copyEmail').onclick = () => copy('rudprajapati2010@gmail.com');
$('#copyDiscord').onclick = () => copy('let_cispy');
$('#discordHire').onclick = () => copy('let_cispy');

/* Modal */
function openModal() { $('#modal').classList.add('show'); }
function closeModal() { $('#modal').classList.remove('show'); }
$('#hire').onclick = openModal;
$('#hire2').onclick = openModal;
$('#close').onclick = closeModal;
$('#modal').onclick = e => { if (e.target === $('#modal')) closeModal(); };
$$('.choice').forEach(b => b.onclick = () => {
  $('#hireResult').innerHTML = `Selected: <b>${b.dataset.service}</b><br><br>Use the buttons below to contact me. Include your project idea, required features, and preferred timeline.`;
});
