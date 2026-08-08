import { useEffect, useMemo, useRef, useState } from 'react';
import Papa from 'papaparse';

import Hero from './components/Hero';
import KpiRow from './components/KpiRow';
import HealthScore from './components/HealthScore';
import MilestonePanel from './components/MilestonePanel';
import Leaderboard from './components/Leaderboard';
import RosterTable from './components/RosterTable';
import PersonModal from './components/PersonModal';
import IssuesPanel from './components/IssuesPanel';
import ZeroProgressPanel from './components/ZeroProgressPanel';
import AnnouncementsPanel from './components/AnnouncementsPanel';
import ReminderPanel from './components/ReminderPanel';
import ComposeModal from './components/ComposeModal';
import SettingsModal from './components/SettingsModal';
import PrintView from './components/PrintView';
import ThemeToggle from './components/ThemeToggle';
import Confetti from './components/Confetti';
import ScrollTopFab from './components/ScrollTopFab';
import ToastHost from './components/ToastHost';

import { parseParticipants, computeDashboard } from './lib/compute';
import { DEFAULT_SETTINGS } from './lib/data';
import { downloadText, fmtNum, cohortBaseId } from './lib/helpers';
import { exportDashboardPdf, exportWeeklyRollupPdf } from './lib/exports';
import { migrateCohorts, saveCohort } from './lib/storage';
import { showToast } from './lib/toast';

function cohortIdFromFile(file) {
  return cohortBaseId(file.name) || `cohort-${Date.now()}`;
}

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [cohorts, setCohorts] = useState(() => {
    try {
      return migrateCohorts();
    } catch {
      return {};
    }
  });
  const [activeCohortId, setActiveCohortId] = useState(() => {
    try {
      const loaded = migrateCohorts();
      const ids = Object.keys(loaded);
      return ids.length ? ids[ids.length - 1] : null;
    } catch {
      return null;
    }
  });
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [compose, setCompose] = useState(null); // { person, templateId }
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [contactLog, setContactLog] = useState({});
  const [confettiActive, setConfettiActive] = useState(false);
  const [exporting, setExporting] = useState(false);
  const dashboardRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleUpload = (files) => {
    files.forEach((file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const participants = parseParticipants(results.data);
          const id = cohortIdFromFile(file);
          setCohorts((prev) => {
            const existing = prev[id];
            const snapshots = existing ? [...existing.snapshots] : [];
            const today = new Date().toDateString();
            const lastSnapshot = snapshots[snapshots.length - 1];

            if (lastSnapshot && new Date(lastSnapshot.ts).toDateString() === today) {
              const proceed = window.confirm(
                `You already uploaded a CSV for "${id}" today. Upload again and replace today's snapshot?`
              );
              if (!proceed) {
                showToast('Upload cancelled — today\'s snapshot was kept.', 'info');
                return prev;
              }
              snapshots.pop();
            }

            snapshots.push({ ts: Date.now(), participants });
            const trimmed = snapshots.slice(-10);
            const newCohort = { id, label: id, snapshots: trimmed };
            saveCohort(newCohort);
            showToast(`${id} updated — ${participants.length} participants loaded.`, 'success');
            return { ...prev, [id]: newCohort };
          });
          setActiveCohortId(id);
        },
        error: () => {
          showToast(`Could not parse ${file.name}. Please check it is a valid CSV export.`, 'error');
        },
      });
    });
  };

  const cohortList = useMemo(
    () => Object.values(cohorts).map((c) => ({ id: c.id, label: c.label })),
    [cohorts]
  );

  const activeCohort = activeCohortId ? cohorts[activeCohortId] : null;
  const latestSnapshot = activeCohort?.snapshots[activeCohort.snapshots.length - 1];
  const previousSnapshot = activeCohort?.snapshots.length > 1
    ? activeCohort.snapshots[activeCohort.snapshots.length - 2]
    : null;

  const dashboard = useMemo(
    () => (latestSnapshot ? computeDashboard(latestSnapshot.participants) : null),
    [latestSnapshot]
  );
  const previousDashboard = useMemo(
    () => (previousSnapshot ? computeDashboard(previousSnapshot.participants) : null),
    [previousSnapshot]
  );

  useEffect(() => {
    if (!dashboard || !previousDashboard) return;
    const newlyAchieved = dashboard.milestones.some(
      (m, i) => m.achieved && !previousDashboard.milestones[i]?.achieved
    );
    if (newlyAchieved) {
      setConfettiActive(true);
      const t = setTimeout(() => setConfettiActive(false), 2600);
      return () => clearTimeout(t);
    }
  }, [dashboard, previousDashboard]);

  const toggleContacted = (personId) => {
    setContactLog((prev) => ({ ...prev, [personId]: !prev[personId] }));
  };

  const openCompose = (person, templateId) => setCompose({ person, templateId });

  const copyReportText = async () => {
    if (!dashboard) return;
    const lines = [
      `GCAF Cohort Scoreboard — ${activeCohort.label}`,
      `Generated ${new Date().toLocaleString()}`,
      '',
      `Total participants: ${fmtNum(dashboard.total)}`,
      `Access codes redeemed: ${fmtNum(dashboard.redeemed)}`,
      `Active participants: ${fmtNum(dashboard.active)}`,
      `AI-verified profiles: ${fmtNum(dashboard.aiVerified)}`,
      `Total skill badges: ${fmtNum(dashboard.totalSkillBadges)}`,
      `Total arcade games: ${fmtNum(dashboard.totalArcadeGames)}`,
      `Open issues: ${fmtNum(dashboard.issues.length)}`,
      `Zero progress: ${fmtNum(dashboard.zeroProgress.length)}`,
      '',
      'Top 10 leaderboard:',
      ...dashboard.leaderboard.slice(0, 10).map((p) => `${p.rank}. ${p.displayName} — ${fmtNum(p.combined)} combined`),
    ];
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      showToast('Report copied to clipboard.', 'success');
    } catch {
      downloadText(`${activeCohort.label}-report.txt`, text);
      showToast('Clipboard unavailable — downloaded a text file instead.', 'info');
    }
  };

  const handlePrint = () => window.print();

  const handleDownloadCsv = () => {
    if (!dashboard || !activeCohort) return;
    const rows = dashboard.leaderboard.map((p) => ({
      Rank: p.rank,
      Name: p.displayName,
      Email: p.email,
      'Access Code Redeemed': p.redeemed ? 'Yes' : 'No',
      'Skill Badges': p.skillBadges,
      'Arcade Games': p.arcadeGames,
      Combined: p.combined,
      Milestone: p.generalMilestone || 'None',
      'AI Verified': p.aiVerified ? 'Yes' : 'No',
    }));
    const csv = Papa.unparse(rows);
    downloadText(`${activeCohort.label}-roster.csv`, csv);
    showToast('Roster CSV downloaded.', 'success');
  };

  const handleDownloadPdf = async () => {
    if (!dashboardRef.current) return;
    setExporting(true);
    try {
      await exportDashboardPdf(dashboardRef.current, `${activeCohort.label}-scoreboard.pdf`);
      showToast('PDF downloaded.', 'success');
    } catch {
      showToast('Could not generate the PDF. Please try again.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleWeeklyRollup = async () => {
    const list = Object.values(cohorts).map((c) => ({
      label: c.label,
      dashboard: computeDashboard(c.snapshots[c.snapshots.length - 1].participants),
    }));
    if (list.length === 0) return;
    setExporting(true);
    try {
      await exportWeeklyRollupPdf(list, 'gcaf-weekly-rollup.pdf');
      showToast('Weekly rollup PDF downloaded.', 'success');
    } catch {
      showToast('Could not generate the rollup PDF. Please try again.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const history = useMemo(() => {
    if (!selectedPerson || !activeCohort) return [];
    return activeCohort.snapshots.map((s, i) => {
      const p = s.participants.find((x) => x.email === selectedPerson.email || x.name === selectedPerson.name);
      return { label: `Upload ${i + 1}`, combined: p ? p.combined : 0 };
    });
  }, [selectedPerson, activeCohort]);

  return (
    <>
      <div className="aurora" />
      <div className="pixel-grid" />
      <Confetti active={confettiActive} />
      <ScrollTopFab />
      <ToastHost />
      <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
      <button className="btn btn-icon settings-fab" onClick={() => setSettingsOpen(true)} aria-label="Email settings" title="Email settings">⚙</button>

      <div className="app-shell" ref={dashboardRef}>
        <Hero
          cohorts={cohortList}
          activeCohortId={activeCohortId}
          onSelectCohort={setActiveCohortId}
          onUpload={handleUpload}
          dashboard={dashboard}
          onCopyReport={copyReportText}
          onPrint={handlePrint}
          onDownloadPdf={handleDownloadPdf}
          onDownloadCsv={handleDownloadCsv}
          onWeeklyRollup={handleWeeklyRollup}
          exporting={exporting}
        />

        {!dashboard && (
          <div className="panel empty-state animate-in">
            <h2>Upload your first cohort CSV to get started</h2>
            <p className="empty-note">
              Export your GCAF participant report and drop it in above. You can load multiple cohorts
              and switch between them once 2+ are loaded — and re-upload the same file later to see trends.
            </p>
          </div>
        )}

        {dashboard && (
          <>
            <KpiRow dashboard={dashboard} />

            <HealthScore dashboard={dashboard} />

            <MilestonePanel dashboard={dashboard} />

            <Leaderboard leaderboard={dashboard.leaderboard} onSelect={setSelectedPerson} />

            <RosterTable participants={dashboard.leaderboard} onSelect={setSelectedPerson} />

            <div className="grid-2col">
              <IssuesPanel issues={dashboard.issues} onSelect={setSelectedPerson} />
              <ZeroProgressPanel zeroProgress={dashboard.zeroProgress} onSelect={setSelectedPerson} />
            </div>

            <AnnouncementsPanel participants={latestSnapshot.participants} settings={settings} />

            <ReminderPanel
              participants={latestSnapshot.participants}
              contactLog={contactLog}
              onToggleContacted={toggleContacted}
              onCompose={openCompose}
            />
          </>
        )}
      </div>

      {dashboard && <PrintView dashboard={dashboard} cohortLabel={activeCohort.label} />}

      <PersonModal
        person={selectedPerson}
        history={history}
        onClose={() => setSelectedPerson(null)}
        onCompose={(p) => { setSelectedPerson(null); openCompose(p, null); }}
      />

      {compose && (
        <ComposeModal
          person={compose.person}
          initialTemplateId={compose.templateId}
          settings={settings}
          onClose={() => setCompose(null)}
          onSent={(personId) => { setContactLog((prev) => ({ ...prev, [personId]: true })); setCompose(null); showToast('Mail client opened.', 'success'); }}
        />
      )}

      {settingsOpen && (
        <SettingsModal settings={settings} onSave={setSettings} onClose={() => setSettingsOpen(false)} />
      )}
    </>
  );
}
