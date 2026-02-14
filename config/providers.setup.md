# AI Provider Configuration Guide

This guide helps you set up API keys for different AI providers that OpenClaw can use.

## Quick Start

### 1. Using Claude (Recommended)

**Get your API key:**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in to your account
3. Click "API Keys" in the left sidebar
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-v1-`)

**Configure it:**
```bash
# Option A: Set environment variable (recommended)
export CLAUDE_API_KEY="sk-ant-v1-xxxxxxxxxxxxx"

# Option B: Add directly to providers.config.json
# Edit the "claude" section and paste your key in the "api_key" field
```

**Verify it works:**
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: sk-ant-v1-xxxxxxxxxxxxx" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model": "claude-3-5-sonnet-20241022", "max_tokens": 1024, "messages": [{"role": "user", "content": "Say hello"}]}'
```

---

### 2. Using OpenAI (Alternative)

**Get your API key:**
1. Go to [platform.openai.com/api/keys](https://platform.openai.com/api/keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-`)

**Configure it:**
```bash
# Option A: Set environment variable
export OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxx"

# Option B: Add directly to providers.config.json
# Edit the "openai" section, set "enabled": true, and paste your key
```

**Switch to OpenAI:**
In `providers.config.json`, change:
```json
{
  "active_provider": "openai",
  "claude": {
    "enabled": false,
    ...
  },
  "openai": {
    "enabled": true,
    ...
  }
}
```

---

### 3. Using Local Model (Ollama)

**Install Ollama:**
```bash
# On macOS with Homebrew
brew install ollama

# Or download from https://ollama.ai
```

**Run Ollama:**
```bash
# Start the Ollama service
ollama serve

# In another terminal, download a model
ollama pull llama2
```

**Configure it:**
In `providers.config.json`, change:
```json
{
  "active_provider": "local",
  "local": {
    "enabled": true,
    "base_url": "http://localhost:11434",
    ...
  }
}
```

---

## Environment Variables vs Config Files

| Method | Pros | Cons | Use Case |
|--------|------|------|----------|
| **Environment Variables** | Secure, not committed to git, works with CI/CD | Must be set for each terminal/session | Production, sensitive keys |
| **Config File** | Persistent, easy to switch providers | Keys visible in file, should be gitignored | Local development, testing |

### For Safety:
1. **Always** use environment variables for API keys in production
2. **Never** commit actual keys to git
3. Add `providers.config.json` to `.gitignore` (but keep `providers.example.json`)

---

## Using Environment Variables with OpenClaw

OpenClaw will automatically read from environment variables:

```bash
# Set your API key
export CLAUDE_API_KEY="sk-ant-v1-xxxxxxxxxxxxx"

# Start OpenClaw
claw start

# OpenClaw will use the environment variable automatically
```

---

## Switching Providers

### Quick Switch:
Edit `providers.config.json`:
```json
{
  "active_provider": "openai",  // Change from "claude" to "openai"
  ...
}
```

### With Environment Variables:
```bash
# Unset Claude, set OpenAI
unset CLAUDE_API_KEY
export OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxx"

claw restart
```

---

## Troubleshooting

### "Invalid API Key"
- Check the key starts with correct prefix (`sk-ant-v1-` for Claude, `sk-proj-` for OpenAI)
- Verify key is set in environment: `echo $CLAUDE_API_KEY`
- Check you copied the full key without spaces

### Provider not responding
- Test connectivity: `curl https://api.anthropic.com/v1/models` (Claude) or `curl https://api.openai.com/v1/models` (OpenAI)
- Check your internet connection
- Verify the API endpoint URL is correct

### Local model won't connect
- Ensure Ollama is running: `ollama serve`
- Check port 11434 is not blocked
- Try: `curl http://localhost:11434/api/tags`

---

## Configuration File Structure

```json
{
  "providers": {
    "active_provider": "claude",           // Which provider to use
    "claude": { ... },                     // Claude configuration
    "openai": { ... },                     // OpenAI configuration
    "local": { ... }                       // Local model configuration
  },
  "api_keys": {
    "claude_api_key": null,                // Can be set here or via env var
    "openai_api_key": null,
    "local_model_url": null
  },
  "fallback_provider": "claude",           // If active provider fails
  "retry_policy": {
    "max_retries": 3,                      // Retry failed requests
    "retry_delay_ms": 1000,
    "exponential_backoff": true
  }
}
```

---

## For OpenClaw Setup

When you run `claw start`, you'll be asked to choose a provider:

```
OpenClaw Setup
================

1. Claude (Recommended) - Advanced reasoning, multimodal
2. GPT-4o - Fast, versatile
3. Local Model (Ollama) - Privacy-focused, runs offline

Choose your provider [1-3]: 1

Enter your Claude API key: sk-ant-v1-xxxxxxxxxxxxx
```

The setup will update your configuration automatically.
