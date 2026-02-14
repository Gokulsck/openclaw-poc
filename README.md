# OpenClaw Daily Routine Automation POC

Automate your daily routine (supplements, sleep/recovery, gym/crossfit schedule) using OpenClaw AI with Telegram integration.

## Setup Steps

### 1. Install OpenClaw
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 2. Configure Telegram Integration
- Create a Telegram bot via @BotFather on Telegram
- Get your bot token and chat ID
- Add to OpenClaw config (see docs below)

### 3. Create Custom Skills
OpenClaw allows you to create skills for your daily routines:
- **Supplement Tracker** - Log daily supplements
- **Sleep/Recovery Monitor** - Track sleep and recovery metrics
- **Workout Scheduler** - Manage gym and crossfit schedules
- **Daily Reminders** - Automated prompts via Telegram

## Project Structure

```
daily-routine-automation/
├── skills/                    # Custom OpenClaw skills
│   ├── supplement-tracker.js
│   ├── sleep-recovery.js
│   ├── workout-scheduler.js
│   └── daily-reminders.js
├── config/                    # Configuration files
│   ├── telegram.config.json
│   ├── schedule.config.json
│   └── skills.config.json
├── integrations/              # API integrations
│   ├── whoop-integration.js   # For sleep/recovery data
│   ├── calendar-integration.js
│   └── notification-service.js
└── docs/                      # Documentation
    ├── SETUP.md
    ├── SKILLS.md
    └── TELEGRAM.md
```

## Key Features

### 1. Daily Supplement Tracking
- Log supplements via Telegram
- Set reminders for doses
- Track compliance
- View weekly/monthly reports

### 2. Sleep & Recovery Monitoring
- Integrate with WHOOP, Oura Ring, or Apple Health
- Daily sleep quality scores
- Recovery recommendations
- AI-powered insights

### 3. Workout Management
- Gym and CrossFit schedule sync
- Automatic check-ins
- Performance tracking
- Rest day recommendations

### 4. Automated Reminders
- Morning routine reminders (6:30 AM)
- Lunch supplement reminder
- Evening workout reminder
- Recovery/sleep prep reminder

## OpenClaw Concepts

### Skills
Reusable workflows that OpenClaw can execute. You can:
- Create custom skills for your specific needs
- Ask OpenClaw to build skills autonomously
- Share skills via ClawHub

### Persistent Memory
- OpenClaw remembers your preferences
- Context persists across conversations
- Learns your routine patterns

### Browser Control
- Fill forms automatically
- Extract data from websites
- Schedule workouts online

### Full System Access
- Run shell commands
- Execute scripts
- Read/write files locally

## Integration Architecture

```
Telegram User
    ↓
Telegram Bot
    ↓
OpenClaw (Your Computer)
    ├→ Skills (Supplement, Sleep, Workout)
    ├→ Integrations (WHOOP, Calendar, etc)
    ├→ Browser (Auto-fill, scrape data)
    └→ Local Files (Store data, logs)
```

## Example Workflow

1. **User**: "I took my morning supplements today"
   - OpenClaw logs supplement in local database
   - Updates compliance tracking
   
2. **OpenClaw** (automatic check-in): "Good morning! Time for your morning routine. Your sleep score is 8.2/10. Ready to workout?"
   
3. **User**: "Schedule me for 9 AM CrossFit class"
   - OpenClaw accesses calendar
   - Fills CrossFit gym booking
   - Sends confirmation to Telegram

4. **OpenClaw** (proactive): "Recovery reminder: You've hit your sleep target. Good recovery window today for heavy lifts."

## Getting Started

### Step 1: Install OpenClaw
See [SETUP.md](./docs/SETUP.md)

### Step 2: Configure Telegram
See [TELEGRAM.md](./docs/TELEGRAM.md)

### Step 3: Create Your First Skill
See [SKILLS.md](./docs/SKILLS.md)

### Step 4: Set Up Automations
- Schedule daily reminders
- Configure WHOOP/health data sync
- Set up calendar integrations

## Technologies Used

- **OpenClaw**: Personal AI assistant
- **Claude AI**: LLM backend
- **Telegram Bot API**: Chat interface
- **Node.js**: Skill runtime
- **WHOOP API**: Sleep/recovery data
- **Google Calendar API**: Workout scheduling

## Next Steps

1. Clone/setup the POC structure
2. Create your Telegram bot
3. Build your first custom skill
4. Test end-to-end workflow
5. Deploy to your machine for continuous operation

## Resources

- [OpenClaw Docs](https://docs.openclaw.ai/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [ClawHub Skills](https://clawhub.com/)
- [OpenClaw Discord Community](https://discord.com/invite/clawd)

## Tips

- OpenClaw is proactive - it can check in with you periodically
- You can ask it to create skills autonomously
- The more context you provide, the better it learns
- It runs locally on your machine for privacy
- All your data stays under your control

---

Built for automating daily wellness routines with AI 🦞
