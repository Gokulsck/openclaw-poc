/**
 * OpenClaw Skill: Supplement Tracker
 * Tracks daily supplement intake and compliance
 * 
 * Usage:
 * - "I took my morning vitamins"
 * - "Log vitamin D and magnesium"
 * - "Show me my supplement report for this week"
 */

const fs = require('fs');
const path = require('path');

// Data storage
const DATA_DIR = path.join(__dirname, '../data');
const SUPPLEMENTS_FILE = path.join(DATA_DIR, 'supplements.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize or load supplement log
function loadSupplements() {
  if (fs.existsSync(SUPPLEMENTS_FILE)) {
    return JSON.parse(fs.readFileSync(SUPPLEMENTS_FILE, 'utf8'));
  }
  return {
    routine: {
      morning: ['Vitamin D', 'Magnesium', 'Omega-3', 'Multivitamin'],
      afternoon: ['Iron', 'Vitamin C'],
      evening: ['Magnesium', 'Zinc', 'Melatonin'],
    },
    log: {},
    compliance: {},
  };
}

function saveSupplements(data) {
  fs.writeFileSync(SUPPLEMENTS_FILE, JSON.stringify(data, null, 2));
}

// Log supplement intake
function logSupplement(supplement, time = 'now') {
  const data = loadSupplements();
  const today = new Date().toISOString().split('T')[0];
  
  if (!data.log[today]) {
    data.log[today] = [];
  }
  
  data.log[today].push({
    supplement,
    time: new Date().toISOString(),
    logged_at: time,
  });
  
  saveSupplements(data);
  
  return `Logged ${supplement} ✓`;
}

// Get compliance report
function getComplianceReport(days = 7) {
  const data = loadSupplements();
  const report = {
    period: `Last ${days} days`,
    daily_targets: data.routine,
    compliance: {},
    insights: [],
  };
  
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const logged = data.log[dateStr] || [];
    const compliance_rate = (logged.length / 10) * 100; // Assuming 10 total supplements
    
    report.compliance[dateStr] = {
      logged: logged.length,
      compliance_rate: compliance_rate.toFixed(1) + '%',
      supplements: logged.map(l => l.supplement),
    };
  }
  
  return report;
}

// Get missing supplements for today
function getMissingSupplements() {
  const data = loadSupplements();
  const today = new Date().toISOString().split('T')[0];
  const logged_today = (data.log[today] || []).map(l => l.supplement.toLowerCase());
  
  const all_supplements = [
    ...data.routine.morning,
    ...data.routine.afternoon,
    ...data.routine.evening,
  ];
  
  const missing = all_supplements.filter(s => !logged_today.includes(s.toLowerCase()));
  
  return {
    logged: logged_today,
    missing: missing,
    pending_count: missing.length,
  };
}

// Update routine
function updateRoutine(time, supplements) {
  const data = loadSupplements();
  data.routine[time] = supplements;
  saveSupplements(data);
  return `Updated ${time} routine: ${supplements.join(', ')}`;
}

module.exports = {
  name: 'Supplement Tracker',
  description: 'Track daily supplement intake and monitor compliance',
  commands: {
    log: logSupplement,
    report: getComplianceReport,
    missing: getMissingSupplements,
    update: updateRoutine,
  },
};
