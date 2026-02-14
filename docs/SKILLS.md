# Creating and Managing Skills

## What is a Skill?

A skill is a reusable, self-contained workflow that OpenClaw can execute. Skills are how you extend OpenClaw's capabilities beyond the basics.

### Built-in Skills for Your Routine

1. **Supplement Tracker** - Log and track daily supplement intake
2. **Sleep & Recovery Monitor** - Track sleep and get recovery recommendations  
3. **Workout Scheduler** - Manage gym and CrossFit schedule
4. **Daily Reminders** - Automated proactive reminders

## How Skills Work

```
User Message
    ↓
OpenClaw (Claude AI) interprets intent
    ↓
Matches to appropriate skill
    ↓
Skill executes (reads/writes files, makes API calls)
    ↓
Returns result to user
    ↓
Message sent to Telegram
```

## Using Your First Skill

### Supplement Tracker

```bash
# Basic usage
You: I took my morning vitamins
Bot: ✓ Logged vitamins successfully

You: Show me my supplement report
Bot: 📊 Supplement Compliance Report:
     Last 7 days: 85% compliance
     
You: What did I miss today?
Bot: Missing supplements:
     - Iron
     - Vitamin C

You: Update my evening routine to include Zinc
Bot: ✓ Updated evening routine to include Zinc
```

### Sleep & Recovery Monitor

```bash
You: I slept 8 hours with great quality
Bot: ✓ Logged 8h sleep with excellent quality score
     
You: What are my recovery recommendations?
Bot: 💪 Recovery Level: EXCELLENT
     - You can handle intense training today
     - Good day for heavy lifting
     - Consider pushing harder in WOD

You: Connect my WHOOP data
Bot: ✓ WHOOP integration enabled
     Now automatically syncing your recovery metrics
```

### Workout Scheduler

```bash
You: Schedule me for 6 AM gym tomorrow
Bot: ✓ Scheduled gym session at 6 AM

You: What's my workout plan?
Bot: This week's schedule:
     Mon 6 AM - Gym (Upper body)
     Wed 6 PM - CrossFit
     Fri 6 AM - Gym
     Sat 8 AM - CrossFit

You: I'm at the gym now
Bot: ✓ Checked in at gym 💪
     Keep crushing it!
```

### Daily Reminders

```bash
You: What reminders do I have?
Bot: Today's reminders:
     🔔 6:30 AM - Morning routine
     🔔 5:30 PM - Pre-workout prep
     🔔 9 PM - Evening wind-down
     🔔 10:30 PM - Sleep prep

You: Skip my morning reminder
Bot: ✓ Skipped morning reminder for today

You: Move my pre-workout reminder to 4 PM
Bot: ✓ Updated pre-workout reminder to 4:00 PM
```

## Creating a Custom Skill

### Anatomy of a Skill

```javascript
// skills/my-custom-skill.js
const fs = require('fs');
const path = require('path');

// Data storage
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'my-skill.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
  return { items: [] };
}

// Save data
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Skill functions
function addItem(name) {
  const data = loadData();
  data.items.push({ name, added: new Date().toISOString() });
  saveData(data);
  return `Added ${name} ✓`;
}

function listItems() {
  const data = loadData();
  return data.items.map(i => i.name).join('\n');
}

// Export skill
module.exports = {
  name: 'My Custom Skill',
  description: 'A custom skill for tracking things',
  commands: {
    add: addItem,
    list: listItems,
  },
};
```

### Best Practices

1. **Keep skills focused** - One responsibility per skill
2. **Use persistent storage** - Save state to JSON files
3. **Error handling** - Gracefully handle invalid inputs
4. **Clear commands** - Return user-friendly messages
5. **Add logging** - Track what your skill does

## Asking OpenClaw to Build Skills

One of OpenClaw's superpowers is that it can **write its own skills**:

### Via Telegram

```
You: I want to track my calorie intake daily. Can you create a skill for that?

Bot: I'll create a calorie tracking skill for you. 
     [Bot builds the skill autonomously]
     ✓ Created CalorieTracker skill
     
     You can now:
     - Log calories: "I had 1800 calories today"
     - Get stats: "Show me my calorie report"
     - Set targets: "My daily target is 2000 calories"

You: I took 1800 calories today
Bot: ✓ Logged 1800 calories
     That's 200 calories under your 2000 target 🎯
```

### Via Discord/Chat

OpenClaw can self-improve through conversation:

```
You: The calorie skill should also track macros

Bot: I'll update the skill to track macros (protein, carbs, fats)
     [Bot modifies the skill code]
     ✓ Updated! Now you can track:
     - "Log 1800 calories with 120g protein, 200g carbs, 50g fat"
     - "Show my macro breakdown"
```

## Sharing and Discovering Skills

### ClawHub

Skills can be shared and discovered via [ClawHub](https://clawhub.com/):

```bash
# Install a shared skill
claw skill install clawhub/meditation-timer

# Share your skill
claw skill publish my-custom-skill

# Browse available skills
claw skill search "health"
```

## Integration Patterns

### Reading External Data

```javascript
// Integrate with APIs
const https = require('https');

function getWHOOPData(accessToken) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.ouraring.com/v2/usercollection/sleep`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}
```

### Writing to External Services

```javascript
// Send data to external services
function logToGoogleSheets(data) {
  // OpenClaw can handle OAuth flows autonomously
  // It fills in forms and authenticates
  return {
    service: 'google_sheets',
    data: data,
    auto_fill: true  // OpenClaw handles authentication
  };
}
```

### Scheduling Tasks

```javascript
// Create scheduled tasks with cron syntax
const schedule = {
  name: 'Daily supplement reminder',
  cron: '0 6,13,21 * * *',  // 6 AM, 1 PM, 9 PM every day
  action: 'send_telegram_message',
  message: 'Time to take your supplements! 💊'
};
```

## Advanced: Multi-Agent Skills

Combine multiple skills for complex workflows:

```javascript
// Example: Workout + Recovery + Nutrition skill
module.exports = {
  name: 'Holistic Fitness Agent',
  dependencies: [
    'workout-scheduler',
    'sleep-recovery', 
    'supplement-tracker'
  ],
  workflow: {
    daily_check: async () => {
      // Get sleep data
      const sleep = await getSleepStats();
      
      // Get today's workout
      const workout = getTodayWorkout();
      
      // Get supplement compliance
      const supplements = getMissingSupplements();
      
      // Generate AI recommendation
      return generateRecommendation(sleep, workout, supplements);
    }
  }
};
```

## Debugging Skills

### Test a skill locally

```bash
# Run skill directly
node skills/supplement-tracker.js

# See what functions are available
console.log(require('./skills/supplement-tracker.js').commands)
```

### Check error logs

```bash
# OpenClaw logs all skill execution
claw logs | grep "supplement-tracker"

# Look for errors
claw logs --level error
```

### Add debug output

```javascript
function logSupplement(supplement) {
  console.log(`[DEBUG] Logging supplement: ${supplement}`);
  
  const data = loadSupplements();
  console.log(`[DEBUG] Current log size: ${Object.keys(data.log).length}`);
  
  // ... rest of function
}
```

## Performance Optimization

### Caching Data

```javascript
const cache = {};
const CACHE_TTL = 5 * 60 * 1000;  // 5 minutes

function getCachedData(key) {
  if (cache[key] && Date.now() - cache[key].timestamp < CACHE_TTL) {
    return cache[key].data;
  }
  return null;
}

function cacheData(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}
```

### Batch Operations

```javascript
// Instead of logging each supplement individually
function logSupplements(supplements) {
  const data = loadSupplements();
  const today = new Date().toISOString().split('T')[0];
  
  if (!data.log[today]) data.log[today] = [];
  
  // Batch add all at once
  data.log[today].push(...supplements.map(s => ({
    supplement: s,
    time: new Date().toISOString()
  })));
  
  saveSupplements(data);
}
```

## Resources

- [OpenClaw Skills Documentation](https://docs.openclaw.ai/skills)
- [Node.js Built-in Modules](https://nodejs.org/api/)
- [ClawHub Skill Examples](https://clawhub.com/)
- [Discord Community Skill Showcase](https://discord.com/invite/clawd)

## Next Steps

1. Try the built-in skills with real usage
2. Customize skills to match your exact routine
3. Ask OpenClaw to build new skills for your needs
4. Share your skills on ClawHub
5. Explore multi-agent workflows
