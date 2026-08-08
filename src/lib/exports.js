import { fmtNum } from './helpers';

// Bring an element into a full-viewport "capture curtain" so html2canvas renders it
// correctly even if it's normally scrolled, collapsed, or off-screen, then restore it.
function withCaptureCurtain(el, fn) {
  const original = {
    position: el.style.position,
    top: el.style.top,
    left: el.style.left,
    zIndex: el.style.zIndex,
    width: el.style.width,
    maxHeight: el.style.maxHeight,
    overflow: el.style.overflow,
    background: el.style.background,
  };
  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.zIndex = '-1';
  el.style.width = `${Math.min(1280, window.innerWidth)}px`;
  el.style.maxHeight = 'none';
  el.style.overflow = 'visible';
  return Promise.resolve(fn()).finally(() => {
    Object.assign(el.style, original);
  });
}

export async function captureElementToCanvas(el) {
  const { default: html2canvas } = await import('html2canvas');
  return withCaptureCurtain(el, () =>
    html2canvas(el, {
      backgroundColor: '#080b12',
      scale: Math.min(2, window.devicePixelRatio || 1.5),
      useCORS: true,
    })
  );
}

export async function exportDashboardPng(el, filename = 'gcaf-scoreboard.png') {
  const canvas = await captureElementToCanvas(el);
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function exportDashboardPdf(el, filename = 'gcaf-scoreboard.pdf') {
  const [{ jsPDF }, canvas] = await Promise.all([
    import('jspdf'),
    captureElementToCanvas(el),
  ]);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  pdf.save(filename);
}

// Builds an off-screen summary card for a single cohort and captures it — used to
// assemble the multi-cohort weekly rollup without needing every cohort mounted at once.
async function renderCohortSummaryCanvas(cohortLabel, dashboard, html2canvas) {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.zIndex = '-1';
  container.style.width = '900px';
  container.style.padding = '32px';
  container.style.background = '#080b12';
  container.style.color = '#eef1f6';
  container.style.fontFamily = "'Space Grotesk', system-ui, sans-serif";
  container.style.border = '1px solid rgba(255,255,255,0.08)';
  container.style.borderRadius = '20px';

  const rows = [
    ['Total participants', fmtNum(dashboard.total)],
    ['Access codes redeemed', fmtNum(dashboard.redeemed)],
    ['Active participants', fmtNum(dashboard.active)],
    ['AI-verified profiles', fmtNum(dashboard.aiVerified)],
    ['Total skill badges', fmtNum(dashboard.totalSkillBadges)],
    ['Total arcade games', fmtNum(dashboard.totalArcadeGames)],
    ['Bonus milestone achieved', fmtNum(dashboard.bonusAchieved)],
    ['Open issues', fmtNum(dashboard.issues.length)],
    ['Zero progress', fmtNum(dashboard.zeroProgress.length)],
  ];

  container.innerHTML = `
    <h1 style="font-family:'Sora',sans-serif;font-size:26px;margin:0 0 4px;">${cohortLabel}</h1>
    <p style="color:#9aa4b8;font-size:12px;margin:0 0 20px;">Weekly rollup · ${new Date().toLocaleDateString()}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${rows
        .map(
          ([label, value]) => `
        <div style="border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:14px 16px;background:rgba(255,255,255,0.03);">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:10.5px;letter-spacing:0.08em;text-transform:uppercase;color:#9aa4b8;">${label}</div>
          <div style="font-family:'Sora',sans-serif;font-size:22px;font-weight:700;margin-top:4px;">${value}</div>
        </div>`
        )
        .join('')}
    </div>
  `;

  document.body.appendChild(container);
  try {
    const canvas = await html2canvas(container, { backgroundColor: '#080b12', scale: 2 });
    return canvas;
  } finally {
    document.body.removeChild(container);
  }
}

export async function exportWeeklyRollupPdf(cohortDashboards, filename = 'gcaf-weekly-rollup.pdf') {
  const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();

  for (let i = 0; i < cohortDashboards.length; i += 1) {
    const { label, dashboard } = cohortDashboards[i];
    const canvas = await renderCohortSummaryCanvas(label, dashboard, html2canvas);
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
  }
  pdf.save(filename);
}