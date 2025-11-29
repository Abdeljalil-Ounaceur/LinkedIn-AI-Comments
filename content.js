const observer = new MutationObserver(() => {
    Array.from(document.getElementsByClassName("comments-comment-texteditor"))
        .filter(commentBox => !commentBox.hasAttribute("data-mutated"))
        .forEach(commentBox => {
            commentBox.setAttribute("data-mutated", "true");
            addSuggestionButton(commentBox);
        });
});

observer.observe(document.body, { subtree: true, childList: true });

const addSuggestionButton = (commentBox) => {
    const button = document.createElement("button");
    button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    <path d="M8 10h.01M12 10h.01M16 10h.01"></path></svg>`;
    button.style.cssText = "display: flex; align-items: center; justify-content: center; padding: 6px; border: none; background: transparent; cursor: pointer;";
    button.addEventListener("click", async () => {
        const editor = commentBox.querySelector(".ql-editor");

        // Save original button content
        const originalButtonHTML = button.innerHTML;

        // Change button to loading spinner
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"></path>
            </svg>
            <style>
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
        button.disabled = true;

        // Fetch response
        const response = await fetchResponse(createPrompt(commentBox));
        editor.innerHTML = response;

        // Restore original button icon
        button.innerHTML = originalButtonHTML;
        button.disabled = false;
    });
    commentBox.querySelector(".justify-space-between").prepend(button);
};



const fetchResponse = async (prompt) => {
    // Get API key from Chrome storage
    let API_KEY;
    try {
        const result = await chrome.storage.sync.get(['geminiApiKey']);
        API_KEY = result.geminiApiKey;
    } catch (error) {
        console.error('Error retrieving API key:', error);
        return 'Error: Could not retrieve API key from storage';
    }

    if (!API_KEY) {
        console.error('API key not set');
        return 'Please set your API key in extension settings (right-click extension icon → Options)';
    }

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + API_KEY;

    // Instructions as first user message
    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: "You are an assistant, that writes replies to LinkedIn posts. Use the same language as the incoming post. Sound human. sound like a busy person writing a quick polite and humble message. Don't repeat too many exact words. Never use expressions that require exclamation marks. Create a brief, positive reply and maybe add something to the discussion. Be creative! Do not mention the name of the author." }]
            },
            {
                role: "user",
                parts: [{ text: prompt }]
            }
        ]
    };

    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
            if (
                data &&
                data.candidates &&
                data.candidates.length &&
                data.candidates[0].content &&
                data.candidates[0].content.parts &&
                data.candidates[0].content.parts.length
            ) {
                return data.candidates[0].content.parts[0].text;
            } else {
                return 'No suitable response found';
            }
        })
        .catch(error => console.error(error));
}


const createPrompt = (commentBox) => {
    // Get post details
    const post =
        commentBox.closest(".feed-shared-update-v2") ||
        commentBox.closest(".reusable-search__result-container");

    const author = post?.querySelector('.update-components-header__text-view a')?.innerText.trim() || "";
    const text = post.querySelector(
        ".feed-shared-inline-show-more-text"
    )?.innerText;

    let prompt = `"${author ? author + " wrote : " : ""}"${text}`;

    // Optional: Get comment details
    const commentElement = commentBox.closest(".comments-comment-item");
    const commentAuthor = commentElement?.querySelector(
        ".comments-post-meta__name-text .visually-hidden"
    )?.innerText;
    const commentText = commentElement?.querySelector(
        ".comments-comment-item__main-content"
    )?.innerText;

    if (commentElement) {
        prompt += `\n${commentAuthor} replied: ${commentText}\nPlease write a reply to the reply with a maximum of 20 words.`;
    } else {
        prompt += `\nPlease write a reply to this post with a maximum of 40 words.`;
    }

    return prompt;
};