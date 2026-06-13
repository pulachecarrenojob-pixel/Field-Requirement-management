
/* ─── LOCALIZATION ENGINE ─── */
let lang = 'en';
const chartLabels = {
  area: { en: ['Field Operations', 'Logistics', 'Packaging', 'Administration'], es: ['Operaciones de Campo', 'Logística', 'Empaque', 'Administración'] },
  type: { en: ['Materials', 'Personnel', 'Equipment', 'Supplies'], es: ['Materiales', 'Personal', 'Equipos', 'Suministros'] },
  status: { en: ['Approved', 'Rejected'], es: ['Aprobados', 'Rechazados'] },
  titles: { area: { en: 'Requests by Area', es: 'Solicitudes por Área' }, type: { en: 'Requests by Type', es: 'Solicitudes por Tipo' }, status: { en: 'Approval Status', es: 'Estado de Aprobación' } }
};

function setLang(l) {
  lang = l;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  const currentBtnIndex = l === 'en' ? 1 : 2;
  document.querySelector(`.lang-wrap .lang-btn:nth-child(${currentBtnIndex})`).classList.add('active');
  
  document.querySelectorAll('[data-en]').forEach(el => {
    if(['H1'].includes(el.tagName)) el.innerHTML = el.dataset[l];
    else el.textContent = el.dataset[l];
  });
  if(currentChart) switchChart(currentMode, null);
}

/* ─── DARK / LIGHT MODE CONTROLLER ─── */
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  
  // Refresh chart color mapping depending on dark mode execution
  if(currentChart) buildChart(currentMode);
}

/* ─── ANALYTICS CHARTS SYSTEM ─── */
let currentChart = null, currentMode = 'area';
const chartData = {
  area: { vals: [6, 9, 9, 6], color: '#1A6B3C' },
  type: { vals: [8, 6, 10, 6], color: '#1A4A7A' },
  status: { vals: [19, 11], colors: ['#1A6B3C', '#C0392B'] }
};

function buildChart(mode) {
  if(currentChart) currentChart.destroy();
  const d = chartData[mode];
  const ctx = document.getElementById('mainChart').getContext('2d');
  const lbls = chartLabels[mode][lang];
  
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(250,250,248,0.06)' : 'rgba(26,23,20,0.06)';
  const axisColor = isDark ? '#A8A095' : '#4A4540';

  const baseOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: axisColor, font: { family: "'IBM Plex Sans'", size: 11 } } },
      tooltip: { backgroundColor: isDark ? '#FAFAF8' : '#1A1714', titleColor: isDark ? '#1A1714' : '#FAFAF8' }
    }
  };

  if(mode === 'status') {
    currentChart = new Chart(ctx, { type: 'doughnut',
      data: { labels: lbls, datasets: [{ data: d.vals, backgroundColor: d.colors, borderColor: isDark ? '#1A1715' : '#FAFAF8', borderWidth: 3 }] },
      options: { ...baseOpts, cutout: '72%' }
    });
  } else {
    currentChart = new Chart(ctx, { type: 'bar',
      data: { labels: lbls, datasets: [{ data: d.vals, backgroundColor: d.color + '25', borderColor: d.color, borderWidth: 1.5, borderRadius: 4 }] },
      options: { ...baseOpts, indexAxis: 'y',
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: axisColor } },
          y: { grid: { display: false }, ticks: { color: axisColor } }
        }
      }
    });
  }
}

function switchChart(mode, btn) {
  currentMode = mode;
  if (btn) {
    document.querySelectorAll('.chart-menu-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const lbl = document.getElementById('chartLabel');
  if(lbl) lbl.textContent = chartLabels.titles[mode][lang];
  buildChart(mode);
}

// Init view layers
buildChart('area');

/* ─── VIEWPORT TRACKING INTERSECTION ANIMATIONS ─── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('visible');
      e.target.querySelectorAll('[data-count]').forEach(animCount);
      e.target.querySelectorAll('.kpi-fill').forEach(b => {
        setTimeout(() => { b.style.width = b.dataset.width + '%'; }, 200);
      });
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

function animCount(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const dur = 1200; const t0 = performance.now();
  (function upd(now) {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * target) + suffix;
    if(p < 1) requestAnimationFrame(upd);
  })(t0);
}

/* ─── VISUAL SCREEN ENGINE LIGHTBOX ─── */
function openLightbox(type) {
  document.getElementById('lb-img').src = type === 'as-is' ? 'Requirement_Process_AS-IS.png' : 'img/Requirement_Process_To-BE.png';
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); }
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); }); 