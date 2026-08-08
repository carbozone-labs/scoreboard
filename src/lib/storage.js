import { cohortBaseId } from './helpers';

const INDEX_KEY = "gcaf-cohort-index";
const COHORT_PREFIX = "gcaf-cohort:";

export function loadCohortIndex() {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCohortIndex(ids) {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
  } catch {
    // storage full or unavailable — app still works in-memory for this session
  }
}

export function loadCohort(id) {
  try {
    const raw = localStorage.getItem(COHORT_PREFIX + id);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCohort(cohort) {
  try {
    localStorage.setItem(COHORT_PREFIX + cohort.id, JSON.stringify(cohort));
    const ids = loadCohortIndex();
    if (!ids.includes(cohort.id)) {
      saveCohortIndex([...ids, cohort.id]);
    }
  } catch {
    // quota exceeded or storage disabled — ignore, nothing breaks
  }
}

export function loadAllCohorts() {
  const ids = loadCohortIndex();
  const result = {};
  ids.forEach((id) => {
    const c = loadCohort(id);
    if (c) result[id] = c;
  });
  return result;
}

export function clearAllCohorts() {
  const ids = loadCohortIndex();
  ids.forEach((id) => localStorage.removeItem(COHORT_PREFIX + id));
  localStorage.removeItem(INDEX_KEY);
}

// One-time migration: older versions of this app created a new cohort per daily
// upload because the filename (which includes the date) was used as the cohort id.
// This merges any cohorts that share the same base program code into a single
// cohort with all snapshots combined, so per-person history in PersonModal can compare across days.
export function migrateCohorts() {
  const all = loadAllCohorts();
  const ids = Object.keys(all);
  if (ids.length === 0) return all;

  const groups = {};
  ids.forEach((id) => {
    const baseId = cohortBaseId(id);
    if (!groups[baseId]) groups[baseId] = [];
    groups[baseId].push(all[id]);
  });

  const needsMigration =
    Object.values(groups).some((g) => g.length > 1) ||
    Object.keys(groups).some((baseId) => baseId !== ids.find((i) => i === baseId) && !all[baseId]);

  if (!needsMigration) return all;

  const merged = {};
  Object.entries(groups).forEach(([baseId, cohortsToMerge]) => {
    const allSnapshots = cohortsToMerge.flatMap((c) => c.snapshots);
    const seen = new Set();
    const deduped = allSnapshots.filter((s) => {
      if (seen.has(s.ts)) return false;
      seen.add(s.ts);
      return true;
    });
    deduped.sort((a, b) => a.ts - b.ts);
    merged[baseId] = { id: baseId, label: baseId, snapshots: deduped.slice(-10) };
  });

  clearAllCohorts();
  Object.values(merged).forEach((c) => saveCohort(c));
  return merged;
}
