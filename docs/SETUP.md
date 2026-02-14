# OpenClaw Setup Guide

## Prerequisites

- macOS, Windows, or Linux
- Node.js 16+ (installed automatically by OpenClaw)
- Claude API key (or OpenAI/local models)
- Telegram account for bot integration

## Step 1: Install OpenClaw

```bash
# One-liner installation
curl -fsSL https://openclaw.ai/install.sh | bash

# Verify installation
claw --version
```

## Step 2: Create Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Save it securely - you'll need it next

## Step 3: Initialize OpenClaw

```bash
# Start OpenClaw (first run will guide you through setup)
claw start

# You'll be prompted for:
# - Model provider (Claude, GPT, or Local)
# - API key
# - Personal details/preferences
```

## Step 4: Set Up Telegram Integration

### 4.1 Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/start`
3. Send `/newbot`
4. Follow the prompts:
   - Give your bot a name (e.g., "DailyRoutineBot")
   - Give it a username (e.g., "daily_routine_gokul_bot")
5. BotFather will give you a **token** - save it!

Example token: `123456789:ABCDefGHIjklMNOpqrsTUvwxyz`

### 4.2 Get Your Chat ID

1. Start a chat with your new bot
2. Send `/start` or any message
3. Go to: `https://api.telegram.org/bot{BOT_TOKEN}/getUpdates`
4. Replace `{BOT_TOKEN}` with your actual token
5. Look for your `"id"` in the response - this is your Chat ID

Example response:
```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456789,
      "message": {
        "message_id": 1,
        "from": {
          "id": 987654321,
          "first_name": "Your Name"
        }
      }
    }
  ]
}
```

## Step 5: Configure Daily Routine Automation

```bash
# Navigate to POC directory
cd /Users/gokulsuresh/Development/learning-projects/openclaw-poc/daily-routine-automation

# Update Telegram config
# Edit config/telegram.config.json
# Replace:
# - YOUR_BOT_TOKEN_HERE → your bot token
# - YOUR_CHAT_ID_HERE → your numeric Chat ID (e.g., 987654321)
# - YOUR_USER_ID → your numeric Telegram User ID (same as Chat ID for private chats)
#
# NOTE: These are numeric IDs, NOT your Telegram username (@your_username)
# Find them in the getUpdates API response: https://api.telegram.org/bot{BOT_TOKEN}/getUpdates
```

## Step 6: Load Custom Skills

OpenClaw skills are loaded automatically. The skills are located in:
```
daily-routine-automation/skills/
├── supplement-tracker.js
├── sleep-recovery.js
├── workout-scheduler.js
└── daily-reminders.js
```

### Manually load skills via Telegram:

```
You: @YourBot load skill supplement-tracker
Bot: ✓ Loaded supplement-tracker skill

You: @YourBot status
Bot: Running skills:
  - supplement-tracker
  - sleep-recovery
  - workout-scheduler
  - daily-reminders
```

## Step 7: Test the Setup

```bash
# In Telegram, message your bot:

You: "Good morning!"
Bot: "Good morning! Ready to start your day? Your morning routine includes: Vitamin D, Magnesium, Omega-3"

You: "I took my morning supplements"
Bot: "✓ Logged supplements successfully"

You: "Schedule me for 9 AM CrossFit"
Bot: "✓ Added CrossFit session at 9 AM"

You: "What's my sleep score?"
Bot: "Sleep score: 8.2/10 - Excellent recovery. Ready for intense training today!"
```

## Step 8: Enable Persistent Memory

OpenClaw uses persistent memory to remember your preferences and context.

```bash
# In Telegram or directly:
You: "Here's my typical schedule:
- Morning workout: 6:30 AM
- CrossFit classes: 6 PM Monday, Wednesday, Friday, Saturday
- Sleep target: 8 hours
- Supplements: Vitamin D, Magnesium, Omega-3, Zinc"

Bot: ✓ Remembered! I'll use this for future recommendations
```

## Step 9: Set Up Heartbeats (Proactive Reminders)

Heartbeats allow OpenClaw to proactively check in with you.

```bash
# Edit your OpenClaw config to enable heartbeats:
# Usually in ~/.openclaw/config.json or similar

{
  "heartbeat": {
    "enabled": true,
    "interval_minutes": 30,  # Check every 30 minutes
    "quiet_hours": {
      "start": "22:00",
      "end": "08:00"
    }
  }
}
```

## Step 10: Optional - Health Data Integration

### Connect WHOOP (Sleep/Recovery)

```bash
# In Telegram:
You: "Connect my WHOOP data"
Bot: [sends authentication link]
Bot: ✓ WHOOP connected! Syncing your recovery metrics...
```

### Connect Apple Health

- OpenClaw can read from Apple Health on macOS
- Configure in OpenClaw settings

## Troubleshooting

### Bot not responding
- Check that bot token is correct in config
- Verify Chat ID matches
- Ensure OpenClaw process is running: `claw status`

### Skills not loading
- Check skill file syntax: `node skills/supplement-tracker.js`
- Verify skills directory path
- Restart OpenClaw: `claw restart`

### Telegram integration issues
- Test bot directly: `https://t.me/your_bot_username`
- Check API endpoint: `https://api.telegram.org/bot{TOKEN}/getMe`

## Running OpenClaw 24/7

### macOS (using launchd)

```bash
# Create launch agent
mkdir -p ~/Library/LaunchAgents
cat > ~/Library/LaunchAgents/com.openclaw.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.openclaw</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/claw</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# Load it
launchctl load ~/Library/LaunchAgents/com.openclaw.plist

# Verify it's running
launchctl list | grep openclaw
```

### Linux (using systemd)

```bash
# Create systemd service
sudo cat > /etc/systemd/user/openclaw.service << 'EOF'
[Unit]
Description=OpenClaw Daily Routine Assistant
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/claw start
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
EOF

# Enable and start
systemctl --user enable openclaw
systemctl --user start openclaw
```

## Next Steps

1. Create your supplement tracking routine
2. Connect your health data (WHOOP, Apple Health)
3. Set up workout schedule
4. Configure daily reminders
5. Test end-to-end workflow
6. Deploy for continuous operation

## Resources

- [OpenClaw Docs](https://docs.openclaw.ai/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [ClawHub Skills](https://clawhub.com/)
- [Discord Community](https://discord.com/invite/clawd)
