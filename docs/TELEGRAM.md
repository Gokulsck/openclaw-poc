# Telegram Integration Guide

## Overview

Telegram is the ideal interface for your daily routine bot because:
- Always available on your phone
- Instant notifications
- Natural conversational interface
- Group chat support for shared routines
- Message thread support for organized conversations

## Setting Up Your Bot

### Step 1: Create Bot with BotFather

```
1. Open Telegram
2. Search for @BotFather (official Telegram bot creator)
3. Press /start
4. Press /newbot
5. Follow instructions:
   - Bot name: "Daily Routine Assistant"
   - Bot username: "daily_routine_gokul_bot" (must be unique, ends with "bot")
6. Save the token BotFather provides
```

### Step 2: Get Your Chat ID

```bash
# Method 1: Using Telegram Web
# Replace BOT_TOKEN with your actual token
curl "https://api.telegram.org/botBOT_TOKEN/getMe"

# Method 2: Manual
# 1. Message your bot: /start
# 2. Go to: https://api.telegram.org/botBOT_TOKEN/getUpdates
# 3. Look for "id" in the JSON response
```

### Step 3: Configure OpenClaw

Create `.env` file in daily-routine-automation directory:

```bash
TELEGRAM_BOT_TOKEN="YOUR_BOT_TOKEN_HERE"
TELEGRAM_CHAT_ID="YOUR_CHAT_ID_HERE"
TELEGRAM_ADMIN_ID="YOUR_USER_ID_HERE"
```

## Telegram Commands

Your bot responds to these commands:

### General
- `/start` - Start conversation and show menu
- `/help` - Show available commands
- `/status` - Show current status and running skills
- `/settings` - Adjust preferences

### Supplements
- `/supplements_log` - Log supplement intake
- `/supplements_status` - Show today's compliance
- `/supplements_report` - Weekly/monthly report

### Sleep & Recovery
- `/sleep_log` - Log sleep hours
- `/sleep_status` - Get sleep score and recommendations
- `/recovery_check` - Get recovery status
- `/recovery_recommendation` - AI recommendations for today

### Workouts
- `/workout_schedule` - View workout schedule
- `/workout_checkin` - Check in at gym/CrossFit
- `/workout_complete` - Mark workout complete
- `/workout_stats` - Performance metrics

### Reminders
- `/reminders_today` - Show today's reminders
- `/reminders_complete` - Mark reminder done
- `/reminders_skip` - Skip a reminder
- `/reminders_adjust` - Change reminder times

### Data & Reports
- `/daily_report` - Get daily summary
- `/weekly_report` - Get weekly summary
- `/export_data` - Export your data
- `/clear_data` - Clear data (requires confirmation)

## Example Conversations

### Morning Routine

```
You: Good morning! 🌅
Bot: Good morning! ☀️ Ready for your day?

You: /supplements_status
Bot: Morning supplements:
    ✓ Vitamin D
    ✓ Magnesium  
    ✗ Omega-3
    ✗ Multivitamin
    
You: I just took my Omega-3 and Multivitamin
Bot: ✓ Great! All morning supplements logged.
     Your sleep score was 8.2/10 - excellent recovery!
     Ready for a solid workout today 💪

You: /workout_schedule
Bot: Today's Schedule:
    09:00 AM - CrossFit Class
    
You: /workout_checkin
Bot: ✓ Checked in at CrossFit
     Let's crush this workout! 🔥
```

### Evening Routine

```
You: Evening update
Bot: Evening routine time! 🌙

You: /sleep_log 7.5
Bot: ✓ Logged 7.5 hours sleep

You: /supplements_log evening
Bot: Evening supplements:
    ✓ Magnesium logged
    ✓ Zinc logged
    ✓ Melatonin logged
    
You: /sleep_status
Bot: Tonight you logged 7.5 hours.
     That's 0.5 hours below target.
     Recommendation: Try to get to bed 30 mins earlier tomorrow.
     
You: /recovery_recommendation
Bot: Recovery Level: GOOD (7/10)
     Recommendations for tomorrow:
     - Normal training intensity OK
     - Consider 30-min warm-up
     - Focus on compound movements
```

### Weekly Check-in

```
You: /weekly_report
Bot: 📊 Weekly Summary (Jan 27 - Feb 2)

     💊 Supplements:
     • Morning compliance: 85%
     • Evening compliance: 90%
     
     😴 Sleep:
     • Average: 7.8 hours (Target: 8h)
     • Quality: 7.6/10
     
     💪 Workouts:
     • Sessions: 5/6 planned
     • Avg duration: 60 min
     • Favorite: CrossFit WOD
     
     ⏰ Reminders:
     • Completed: 28/35 (80%)
```

## Advanced Features

### Group Chats

Add your bot to a group for shared routines:

```
1. Add bot to group
2. Grant admin permissions
3. Use commands in group chat
4. Bot responds with group-specific messages

Example:
@daily_routine_gokul_bot, what's everyone's workout for today?
Bot: Tomorrow's workouts:
     • Gokul: CrossFit 6 PM
     • Sarah: Gym 7 AM
     • Mike: Rest day
```

### Inline Queries

Quick access without commands:

```
Type in any chat:
@daily_routine_gokul_bot what's my recovery

Bot shows suggestion cards you can click
```

### Message Threads

Organize conversations by date or routine type:

```
Thread: Monday Morning
├─ Morning routine check-in
├─ Supplement log
├─ Pre-workout prep

Thread: Weekly Reports
├─ Mon-Sun summary
├─ Compliance metrics
├─ AI recommendations
```

## Customizing Messages

Edit `config/telegram.config.json`:

```json
{
  "message_templates": {
    "supplement_logged": "✓ {supplement} logged successfully",
    "workout_scheduled": "📅 Workout scheduled: {type} on {day} at {time}",
    "reminder_sent": "🔔 Reminder: {message}",
    "daily_summary": "📊 Daily Summary:\n{report}",
    "recovery_check": "💪 Recovery Status: {level}\n{tips}"
  },
  "emoji_set": {
    "success": "✓",
    "warning": "⚠️",
    "info": "ℹ️",
    "supplement": "💊",
    "sleep": "😴",
    "workout": "💪",
    "calendar": "📅"
  }
}
```

## Notification Settings

### Quiet Hours

```json
{
  "notifications": {
    "quiet_hours": {
      "enabled": true,
      "start": "22:00",  // 10 PM
      "end": "08:00",    // 8 AM
      "important_only": true  // Only urgent notifications
    }
  }
}
```

### Notification Types

```json
{
  "notification_levels": {
    "reminders": "normal",      // Always notify
    "completed": "silent",       // No notification
    "achievements": "normal",    // Celebrate wins
    "urgent": "always",         // Even during quiet hours
    "health_alert": "always"    // Recovery/sleep alerts
  }
}
```

## Webhook Setup (Advanced)

For running OpenClaw on a server, set up webhooks:

```bash
# Generate SSL certificate
openssl req -x509 -newkey rsa:2048 -nodes -out cert.pem -keyout key.pem -days 365

# Configure webhook
curl -X POST "https://api.telegram.org/botBOT_TOKEN/setWebhook" \
  -F "url=https://your-domain.com/webhook" \
  -F "certificate=@cert.pem"

# Verify
curl "https://api.telegram.org/botBOT_TOKEN/getWebhookInfo"
```

## Privacy & Security

### Data Privacy
- All messages stored locally on your machine
- Telegram uses end-to-end encryption for cloud messages
- Personal health data never leaves your computer

### Security Best Practices
```bash
# Rotate bot token if exposed
# Go to @BotFather → /mybots → Select bot → API Token → Regenerate

# Restrict bot to specific users
# Set admin_ids in config to limit access

# Use strong environment variable secrets
# Never commit tokens to version control
```

## Troubleshooting

### Bot not responding
```bash
# Check bot is working
curl "https://api.telegram.org/botBOT_TOKEN/getMe"

# Should return:
# {"ok":true,"result":{"id":123456789,"is_bot":true,"first_name":"Your Bot"}}

# If error, regenerate token in @BotFather
```

### Messages not being delivered
```bash
# Check chat ID is correct
curl "https://api.telegram.org/botBOT_TOKEN/getUpdates"

# Verify OpenClaw process
claw status

# Check Telegram API status
curl https://api.telegram.org/botBOT_TOKEN/getMe
```

### Slow responses
```bash
# Check network connection
# Verify API rate limits (100 messages/second)
# Consider batching updates
```

## Bot Menu Setup

Set up a persistent menu in Telegram:

```bash
curl -X POST "https://api.telegram.org/botBOT_TOKEN/setChatMenuButton" \
  -H "Content-Type: application/json" \
  -d '{
    "menu_button": {
      "type": "commands"
    }
  }'
```

This shows:
- `/supplements_log` - Log supplements
- `/workout_checkin` - Check in
- `/sleep_status` - Sleep info
- `/daily_report` - Summary

## Resources

- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [Telegram Bot Examples](https://core.telegram.org/bots/samples)
- [Bot Security Best Practices](https://core.telegram.org/bots/faq)
