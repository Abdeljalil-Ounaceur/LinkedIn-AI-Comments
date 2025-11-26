// Load saved API key when options page opens
document.addEventListener('DOMContentLoaded', async () => {
    const apiKeyInput = document.getElementById('apiKey');
    const statusDiv = document.getElementById('status');

    // Load existing API key
    try {
        const result = await chrome.storage.sync.get(['geminiApiKey']);
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
        }
    } catch (error) {
        console.error('Error loading API key:', error);
    }
});

// Save API key when form is submitted
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const apiKeyInput = document.getElementById('apiKey');
    const statusDiv = document.getElementById('status');
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        showStatus('Please enter an API key', 'error');
        return;
    }

    // Basic validation for Gemini API key format
    if (!apiKey.startsWith('AIza')) {
        showStatus('Invalid API key format. Gemini API keys start with "AIza"', 'error');
        return;
    }

    try {
        // Save to Chrome storage
        await chrome.storage.sync.set({ geminiApiKey: apiKey });
        showStatus('✓ Settings saved successfully!', 'success');

        // Optional: Test the API key
        // You could add a test request here to validate the key works
    } catch (error) {
        console.error('Error saving API key:', error);
        showStatus('Error saving settings. Please try again.', 'error');
    }
});

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type} show`;

    // Hide status after 3 seconds
    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 3000);
}
