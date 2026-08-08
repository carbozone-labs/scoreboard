import { COHORT_MILESTONES } from './data';

function pick(row, ...names) {
  for (const n of names) {
    const key = Object.keys(row).find(
      (k) => k.trim().toLowerCase() === n.toLowerCase()
    );
    if (key !== undefined && row[key] !== undefined) return row[key];
  }
  return '';
}

function toInt(v) {
  const n = parseInt(String(v).replace(/[^\d-]/g, ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

function isYes(v) {
  return String(v).trim().toLowerCase() === 'yes';
}

function isAllGood(v) {
  const s = String(v).trim().toLowerCase();
  return s === 'all good' || s === 'good' || s === '';
}

export function parseParticipants(rawRows) {
  return rawRows
    .filter((r) => Object.values(r).some((v) => String(v).trim() !== ''))
    .map((row, idx) => {
      const name = pick(row, 'User Name', 'Name').trim();
      const email = pick(row, 'User Email', 'Email').trim();
      const redeemed = isYes(pick(row, 'Access Code Redemption Status'));
      const gear = pick(row, 'GEAR Digital Badges Earned').trim();
      const skillBadges = toInt(pick(row, '# of Skill Badges Completed'));
      const arcadeGames = toInt(pick(row, '# of Arcade Games Completed'));
      const skillsUrlStatus = pick(row, 'Google Skills Profile URL Status').trim();
      const devUrlStatus = pick(row, 'Google Developer Profile URL Status').trim();
      const aiVerification = pick(row, 'AI Agent Verification Status').trim();
      const generalMilestone = pick(row, 'General Milestone Earned').trim();
      const bonusMilestone = pick(row, 'Bonus Milestone Earned').trim();
      const skillsUrl = pick(row, 'Google Skills Profile URL').trim();
      const devUrl = pick(row, 'Google Developer Profile URL').trim();

      const skillsUrlOk = isAllGood(skillsUrlStatus);
      const devUrlOk = isAllGood(devUrlStatus);
      const combined = skillBadges + arcadeGames;
      const aiVerified = String(aiVerification).trim().toLowerCase().includes('verified') &&
        !String(aiVerification).trim().toLowerCase().includes('not');

      return {
        id: `${idx}-${email || name}`,
        name,
        displayName: titleCase(name),
        email,
        redeemed,
        gear,
        gearCount: gear ? gear.split(',').filter((s) => s.trim()).length : 0,
        skillBadges,
        arcadeGames,
        combined,
        skillsUrlStatus,
        devUrlStatus,
        skillsUrlOk,
        devUrlOk,
        skillsUrl,
        devUrl,
        aiVerification,
        aiVerified,
        generalMilestone: generalMilestone && generalMilestone.toLowerCase() !== 'none' ? generalMilestone : null,
        bonusMilestone: isYes(bonusMilestone),
        hasIssue: !redeemed || !skillsUrlOk || !devUrlOk,
        zeroProgress: skillBadges === 0 && arcadeGames === 0 && !redeemed,
      };
    });
}

function titleCase(str = '') {
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

export function computeDashboard(participants) {
  const total = participants.length;
  const redeemed = participants.filter((p) => p.redeemed).length;
  const active = participants.filter((p) => p.combined > 0).length;
  const aiVerified = participants.filter((p) => p.aiVerified).length;
  const totalSkillBadges = participants.reduce((s, p) => s + p.skillBadges, 0);
  const totalArcadeGames = participants.reduce((s, p) => s + p.arcadeGames, 0);
  const totalCombined = totalSkillBadges + totalArcadeGames;
  const bonusAchieved = participants.filter((p) => p.bonusMilestone).length;
  const issues = participants.filter((p) => p.hasIssue);
  const zeroProgress = participants.filter((p) => p.zeroProgress);

  const leaderboard = [...participants]
    .sort((a, b) => b.combined - a.combined || b.arcadeGames - a.arcadeGames)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  const milestones = COHORT_MILESTONES.map((tier) => {
    const gamesPct = Math.min(100, (totalArcadeGames / tier.games) * 100);
    const badgesPct = Math.min(100, (totalSkillBadges / tier.badges) * 100);
    const overallPct = Math.min(gamesPct, badgesPct);
    return {
      ...tier,
      gamesPct,
      badgesPct,
      overallPct,
      gamesRemaining: Math.max(0, tier.games - totalArcadeGames),
      badgesRemaining: Math.max(0, tier.badges - totalSkillBadges),
      achieved: totalArcadeGames >= tier.games && totalSkillBadges >= tier.badges,
    };
  });

  // Composite, point-in-time health score (0-100). Blends redemption, activity,
  // verification, and average milestone progress — no history or pace required.
  const redeemedRate = total ? (redeemed / total) * 100 : 0;
  const activeRate = total ? (active / total) * 100 : 0;
  const verifiedRate = total ? (aiVerified / total) * 100 : 0;
  const avgMilestoneProgress = milestones.length
    ? milestones.reduce((s, m) => s + m.overallPct, 0) / milestones.length
    : 0;
  const healthScore = total
    ? Math.round(
        redeemedRate * 0.3 + activeRate * 0.3 + verifiedRate * 0.15 + avgMilestoneProgress * 0.25
      )
    : 0;
  const healthStatus = !total
    ? 'No data'
    : healthScore >= 75
    ? 'On track'
    : healthScore >= 50
    ? 'Needs attention'
    : 'At risk';

  return {
    total,
    redeemed,
    active,
    aiVerified,
    totalSkillBadges,
    totalArcadeGames,
    totalCombined,
    bonusAchieved,
    issues,
    zeroProgress,
    leaderboard,
    milestones,
    healthScore,
    healthStatus,
  };
}

export function reminderScore(p) {
  // Higher score = higher priority to nudge. Zero-progress and issues score highest;
  // near-milestone participants score high too.
  if (p.zeroProgress) return 100;
  if (p.hasIssue) return 90;
  const nearestGap = Math.min(
    ...[12].map((g) => Math.max(0, g - p.arcadeGames)),
    ...[66].map((b) => Math.max(0, b - p.skillBadges))
  );
  if (p.combined > 0 && p.combined < 78 && nearestGap <= 5) return 70;
  if (p.combined > 0) return 40;
  return 20;
}

export function reminderReason(p) {
  if (!p.redeemed) return 'Access code not redeemed';
  if (!p.skillsUrlOk) return 'Google Skills profile URL issue';
  if (!p.devUrlOk) return 'Google Developer profile URL issue';
  if (p.zeroProgress) return 'No badges or games completed yet';
  if (p.combined > 0 && p.combined < 78) return 'Close to the Ultimate Milestone';
  return 'Keep up the momentum';
}
