/**
 * OpenClaw Skill: Daily Reminders
 * Automated proactive reminders for daily routines
 * Works with OpenClaw's heartbeat feature for scheduled checks
 * 
 * Usage:
 * - "Set up my daily reminders"
 * - "What reminders do I have today?"
 * - "Skip morning reminder"
 * - "Adjust reminder times"
 */

const fs = require('fs');
const path = require('path');

// Data storage
const DATA_DIR = path.join(__dirname, '../data');
const REMINDERS_FILE = path.join(DATA_DIR, 'reminders.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load reminders
function loadReminders() {
  if (fs.existsSync(REMINDERS_FILE)) {
    return JSON.parse(fs.readFileSync(REMINDERS_FILE, 'utf8'));
  }
  return {
    enabled: true,
    reminders: {
      morning: {
        time: '06:30',
        message: 'Good morning! Time to take your morning supplements. Have you done your morning routine?',
        enabled: true,
      },
      pre_workout: {
        time: '17:30',
        message: 'Pre-workout reminder! Prepare for your evening training session. Drink water and get ready.',
        enabled: true,
      },
      evening: {
        time: '21:00',
        message: 'Evening wind-down time. Did you complete your evening supplements? Start preparing for bed.',
        enabled: true,
      },
      sleep_check: {
        time: '22:30',
        message: 'Sleep reminder: Aim for 8 hours tonight for optimal recovery. Lights out soon?',
        enabled: true,
      },
    },
    completed_today: {},
    skipped_today: {},
  };
}

function saveReminders(data) {
  fs.writeFileSync(REMINDERS_FILE, JSON.stringify(data, null, 2));
}

// Get today's reminders
function getTodayReminders() {
  const data = loadReminders();
  const today = new Date().toISOString().split('T')[0];
  
  const reminders = {
    date: today,
    reminders: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  
  Object.entries(data.reminders).forEach(([key, reminder]) => {
    if (reminder.enabled) {
      reminders.reminders.push({
        id: key,
        time: reminder.time,
        message: reminder.message,
        completed: data.completed_today[key] || false,
        skipped: data.skipped_today[key] || false,
      });
    }
  });
  
  reminders.reminders.sort((a, b) => a.time.localeCompare(b.time));
  
  return reminders;
}

// Mark reminder as completed
function completeReminder(reminder_id) {
  const data = loadReminders();
  const today = new Date().toISOString().split('T')[0];
  
  if (!data.completed_today[today]) {
    data.completed_today[today] = {};
  }
  
  data.completed_today[today][reminder_id] = new Date().toISOString();
  saveReminders(data);
  
  const reminder = data.reminders[reminder_id];
  return `✓ ${reminder_id} reminder completed! Great job staying on track!`;
}

// Skip reminder
function skipReminder(reminder_id) {
  const data = loadReminders();
  const today = new Date().toISOString().split('T')[0];
  
  if (!data.skipped_today[today]) {
    data.skipped_today[today] = {};
  }
  
  data.skipped_today[today][reminder_id] = new Date().toISOString();
  saveReminders(data);
  
  return `Skipped ${reminder_id} reminder for today`;
}

// Update reminder time
function updateReminderTime(reminder_id, new_time) {
  const data = loadReminders();
  
  if (!data.reminders[reminder_id]) {
    return `Reminder "${reminder_id}" not found`;
  }
  
  data.reminders[reminder_id].time = new_time;
  saveReminders(data);
  
  return `Updated ${reminder_id} reminder to ${new_time} ✓`;
}

// Add custom reminder
function addReminder(reminder_id, time, message) {
  const data = loadReminders();
  
  data.reminders[reminder_id] = {
    time: time,
    message: message,
    enabled: true,
  };
  
  saveReminders(data);
  return `Added reminder "${reminder_id}" at ${time} ✓`;
}

// Get reminder compliance
function getReminderCompliance(days = 7) {
  const data = loadReminders();
  const compliance = {
    period: `Last ${days} days`,
    stats: {},
  };
  
  Object.keys(data.reminders).forEach(reminder_id => {
    compliance.stats[reminder_id] = {
      completed: 0,
      skipped: 0,
      total_opportunities: days,
      compliance_rate: '0%',
    };
  });
  
  // In a real implementation, you'd check historical data
  // For now, returning placeholder data
  
  return compliance;
}

// Generate heartbeat message (OpenClaw calls this periodically)
function generateHeartbeatMessage() {
  const now = new Date();
  const current_time = now.toTimeString().slice(0, 5); // HH:MM format
  const data = loadReminders();
  
  // Check if any reminder should be triggered now
  for (const [key, reminder] of Object.entries(data.reminders)) {
    if (reminder.enabled && reminder.time === current_time) {
      return {
        type: 'reminder_trigger',
        reminder_id: key,
        message: reminder.message,
        time: current_time,
      };
    }
  }
  
  // Default proactive check-in messages
  const hour = now.getHours();
  
  if (hour === 6) {
    return {
      type: 'proactive_checkin',
      message: '🌅 Good morning! Ready to start your day? Your supplements are waiting!',
    };
  } else if (hour === 17) {
    return {
      type: 'proactive_checkin',
      message: '💪 Pre-workout energy check! Your training session is coming up. How are you feeling?',
    };
  } else if (hour === 21) {
    return {
      type: 'proactive_checkin',
      message: '🌙 Wind-down time. Did you get your evening supplements? Let\'s prepare for great sleep.',
    };
  } else if (hour === 22) {
    return {
      type: 'proactive_checkin',
      message: '😴 Sleep time approaching. Aim for 8 hours for optimal recovery. Sweet dreams!',
    };
  }
  
  return null;
}

module.exports = {
  name: 'Daily Reminders',
  description: 'Automated proactive reminders for your daily routine',
  commands: {
    today: getTodayReminders,
    complete: completeReminder,
    skip: skipReminder,
    update_time: updateReminderTime,
    add: addReminder,
    compliance: getReminderCompliance,
    heartbeat: generateHeartbeatMessage,
  },
};
