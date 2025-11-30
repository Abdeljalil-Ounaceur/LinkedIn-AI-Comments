# LinkedIn AI Assistant - Chrome Extension

A Chrome extension that helps you write AI-powered replies to LinkedIn posts and comments using Google's Gemini API.

## Demo

![LinkedIn AI Assistant Demo](assets/demo.gif)

## Features

- 🤖 AI-powered reply suggestions for LinkedIn posts and comments
- 💬 Context-aware responses that match the tone and language of the original post
- 🔒 Secure API key storage in Chrome's sync storage
- ✨ Beautiful, modern options page for easy configuration

## Setup

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key (starts with `AIza...`)

### 2. Install the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the folder containing this extension

### 3. Configure Your API Key

1. Right-click the extension icon in Chrome
2. Select "Options"
3. Paste your Gemini API key
4. Click "Save Settings"

## Usage

1. Navigate to [LinkedIn](https://www.linkedin.com)
2. Open any post or comment
3. Click the suggestion icon (💬) in the comment box
4. The AI will generate a contextual reply for you
5. Edit as needed and post!

## Privacy

- Your API key is stored locally in Chrome's sync storage
- No data is sent to any third-party servers except Google's Gemini API
- All API calls are made directly from your browser to Google

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main content script that runs on LinkedIn
- `options.html` - Settings page UI
- `options.js` - Settings page logic

## Security Note

⚠️ **Never commit your API key to version control!** This extension stores your API key securely in Chrome's storage, not in the code.

## License

MIT
