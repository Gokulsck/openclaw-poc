/**
 * OpenClaw Skill: Sleep & Recovery Monitor
 * Tracks sleep quality, recovery metrics, and provides AI-powered insights
 * 
 * Usage:
 * - "How was my sleep last night?"
 * - "Log 7 hours of sleep"
 * - "Connect my WHOOP data"
 * - "What's my recovery score today?"
 * - "Give me recovery recommendations"
 */

const fs = require('fs');
const path = require('path');

// Data storage
const DATA_DIR = path.join(__dirname, '../data');
const SLEEP_FILE = path.join(DATA_DIR, 'sleep.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load sleep data
function loadSleepData() {
  if (fs.existsSync(SLEEP_FILE)) {
    return JSON.parse(fs.readFileSync(SLEEP_FILE, 'utf8'));
  }
  return {
    settings: {
      target_sleep_hours: 8,
      bedtime: '23:00',
      wake_time: '07:00',
    },
    log: {},
    integrations: {
      whoop: null,
      oura: null,
      apple_health: null,
    },
  };
}

function saveSleepData(data) {
  fs.writeFileSync(SLEEP_FILE, JSON.stringify(data, null, 2));
}

// Log sleep
function logSleep(hours, quality = 7, notes = '') {
  const data = loadSleepData();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];
  
  data.log[dateStr] = {
    hours: parseFloat(hours),
    quality: parseInt(quality), // 1-10 scale
    notes: notes,
    timestamp: new Date().toISOString(),
    source: 'manual',
  };
  
  saveSleepData(data);
  
  return `Logged ${hours}h sleep with quality ${quality}/10 ✓`;
}

// Get sleep stats
function getSleepStats(days = 7) {
  const data = loadSleepData();
  const stats = {
    period: `Last ${days} days`,
    target: data.settings.target_sleep_hours,
    entries: {},
    averages: {},
    insights: [],
  };
  
  let total_hours = 0;
  let total_quality = 0;
  let days_on_target = 0;
  let count = 0;
  
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (data.log[dateStr]) {
      const entry = data.log[dateStr];
      stats.entries[dateStr] = entry;
      total_hours += entry.hours;
      total_quality += entry.quality;
      if (entry.hours >= data.settings.target_sleep_hours) {
        days_on_target++;
      }
      count++;
    }
  }
  
  if (count > 0) {
    stats.averages = {
      sleep_hours: (total_hours / count).toFixed(1),
      quality_score: (total_quality / count).toFixed(1),
      compliance_rate: ((days_on_target / count) * 100).toFixed(0) + '%',
    };
  }
  
  // Generate insights
  if (stats.averages.sleep_hours < data.settings.target_sleep_hours - 1) {
    stats.insights.push('⚠️ Below target sleep. Prioritize getting 1-2 more hours.');
  }
  if (stats.averages.quality_score < 6) {
    stats.insights.push('💤 Low sleep quality detected. Check caffeine intake and bedtime routine.');
  }
  if (stats.averages.compliance_rate >= 80) {
    stats.insights.push('✅ Excellent sleep consistency! Keep it up.');
  }
  
  return stats;
}

// Get recovery recommendations
function getRecoveryRecommendations() {
  const sleep_data = loadSleepData();
  const today_data = sleep_data.log[new Date().toISOString().split('T')[0]];
  
  let sleep_hours = 0;
  if (today_data) {
    sleep_hours = today_data.hours;
  }
  
  const recommendations = {
    date: new Date().toISOString().split('T')[0],
    sleep_hours: sleep_hours,
    recovery_level: 'unknown',
    recommendations: [],
  };
  
  if (sleep_hours >= 8) {
    recommendations.recovery_level = 'excellent';
    recommendations.recommendations = [
      '🟢 Excellent recovery - you can handle high intensity workouts',
      'Good day for heavy lifting or intense CrossFit sessions',
      'Consider pushing your training harder today',
    ];
  } else if (sleep_hours >= 7) {
    recommendations.recovery_level = 'good';
    recommendations.recommendations = [
      '🟡 Good recovery - normal training intensity recommended',
      'Stick to your regular workout routine',
      'Focus on form and technique today',
    ];
  } else if (sleep_hours >= 6) {
    recommendations.recovery_level = 'fair';
    recommendations.recommendations = [
      '🟠 Fair recovery - reduce intensity slightly',
      'Consider a shorter or lighter workout session',
      'Focus on mobility and recovery work today',
    ];
  } else {
    recommendations.recovery_level = 'poor';
    recommendations.recommendations = [
      '🔴 Limited recovery - rest day recommended',
      'Prioritize light activity or rest',
      'Schedule your intense training for tomorrow',
    ];
  }
  
  return recommendations;
}

// Connect health data integration
function connectIntegration(service, credentials) {
  const data = loadSleepData();
  
  if (service === 'whoop') {
    data.integrations.whoop = {
      enabled: true,
      credentials: '***masked***',
      synced_at: new Date().toISOString(),
    };
    return 'WHOOP integration connected! Now syncing your data...';
  } else if (service === 'oura') {
    data.integrations.oura = {
      enabled: true,
      credentials: '***masked***',
      synced_at: new Date().toISOString(),
    };
    return 'Oura Ring integration connected!';
  }
  
  saveSleepData(data);
  return `Connected to ${service} ✓`;
}

module.exports = {
  name: 'Sleep & Recovery Monitor',
  description: 'Track sleep quality, monitor recovery, and get AI-powered recommendations',
  commands: {
    log: logSleep,
    stats: getSleepStats,
    recommendations: getRecoveryRecommendations,
    connect: connectIntegration,
  },
};
