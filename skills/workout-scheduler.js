/**
 * OpenClaw Skill: Workout Scheduler
 * Manages gym and CrossFit schedules with automatic check-ins
 * 
 * Usage:
 * - "Schedule me for 9 AM CrossFit tomorrow"
 * - "Add gym session today at 6 PM"
 * - "Show me this week's workouts"
 * - "I'm checking in at the gym"
 * - "What's my workout plan for today?"
 */

const fs = require('fs');
const path = require('path');

// Data storage
const DATA_DIR = path.join(__dirname, '../data');
const WORKOUTS_FILE = path.join(DATA_DIR, 'workouts.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load workout data
function loadWorkouts() {
  if (fs.existsSync(WORKOUTS_FILE)) {
    return JSON.parse(fs.readFileSync(WORKOUTS_FILE, 'utf8'));
  }
  return {
    schedule: {
      Monday: { time: '18:00', type: 'CrossFit', description: 'Upper Body' },
      Tuesday: { time: '06:30', type: 'Gym', description: 'Leg Day' },
      Wednesday: { time: '18:00', type: 'CrossFit', description: 'WOD' },
      Thursday: { time: '06:30', type: 'Gym', description: 'Cardio' },
      Friday: { time: '18:00', type: 'CrossFit', description: 'Strength' },
      Saturday: { time: '08:00', type: 'CrossFit', description: 'Conditioning' },
      Sunday: { time: '09:00', type: 'Recovery', description: 'Yoga/Stretching' },
    },
    completed: {},
    log: {},
  };
}

function saveWorkouts(data) {
  fs.writeFileSync(WORKOUTS_FILE, JSON.stringify(data, null, 2));
}

// Schedule workout
function scheduleWorkout(day, time, type, description = '') {
  const data = loadWorkouts();
  
  if (!/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/.test(day)) {
    return `Invalid day. Use: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday`;
  }
  
  data.schedule[day] = {
    time: time,
    type: type, // 'CrossFit' or 'Gym'
    description: description,
  };
  
  saveWorkouts(data);
  return `Scheduled ${type} on ${day} at ${time}: ${description} ✓`;
}

// Check in to workout
function checkInWorkout(location_type = 'Gym') {
  const data = loadWorkouts();
  const today = new Date();
  const day = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toISOString().split('T')[0];
  
  if (!data.log[dateStr]) {
    data.log[dateStr] = [];
  }
  
  const checkin = {
    location: location_type,
    checked_in_at: new Date().toISOString(),
    status: 'in_progress',
  };
  
  data.log[dateStr].push(checkin);
  saveWorkouts(data);
  
  return `Checked in at ${location_type} 💪 Keep crushing it!`;
}

// Complete workout
function completeWorkout() {
  const data = loadWorkouts();
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  if (data.log[dateStr] && data.log[dateStr].length > 0) {
    const latest = data.log[dateStr][data.log[dateStr].length - 1];
    latest.status = 'completed';
    latest.completed_at = new Date().toISOString();
    
    saveWorkouts(data);
    return `Great workout! Session completed 🎉 Rest well!`;
  }
  
  return `No active workout session found for today`;
}

// Get weekly schedule
function getWeeklySchedule() {
  const data = loadWorkouts();
  
  const schedule = {
    week_starting: getMonday(new Date()).toISOString().split('T')[0],
    workouts: {},
    total_sessions: 0,
  };
  
  Object.entries(data.schedule).forEach(([day, details]) => {
    schedule.workouts[day] = {
      time: details.time,
      type: details.type,
      description: details.description,
    };
    schedule.total_sessions++;
  });
  
  return schedule;
}

// Get today's workout
function getTodayWorkout() {
  const data = loadWorkouts();
  const today = new Date();
  const day = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toISOString().split('T')[0];
  
  const planned = data.schedule[day];
  const completed = data.log[dateStr] || [];
  
  return {
    date: dateStr,
    day: day,
    planned_workout: planned,
    completed_sessions: completed,
    status: completed.length > 0 ? 'logged' : 'pending',
  };
}

// Get performance stats
function getPerformanceStats(days = 30) {
  const data = loadWorkouts();
  const stats = {
    period: `Last ${days} days`,
    total_sessions: 0,
    by_type: {},
    consistency: 0,
  };
  
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (data.log[dateStr]) {
      const day_sessions = data.log[dateStr];
      stats.total_sessions += day_sessions.length;
      
      day_sessions.forEach(session => {
        const type = session.location;
        stats.by_type[type] = (stats.by_type[type] || 0) + 1;
      });
    }
  }
  
  stats.consistency = ((stats.total_sessions / 30) * 100).toFixed(1) + '%';
  
  return stats;
}

// Helper function
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

module.exports = {
  name: 'Workout Scheduler',
  description: 'Manage gym and CrossFit schedules with performance tracking',
  commands: {
    schedule: scheduleWorkout,
    checkin: checkInWorkout,
    complete: completeWorkout,
    weekly: getWeeklySchedule,
    today: getTodayWorkout,
    stats: getPerformanceStats,
  },
};
