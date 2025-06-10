let prompt = document.querySelector("#prompt");
let container = document.querySelector(".container");
let btn = document.querySelector("#text");
let chatContainer = document.querySelector(".chat-container");
let userMessage = null;

let Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCHZBKixnz-8E-m6hoFgE3odHsyADUc1xw" // Replace YOUR_API_KEY with a valid key

function createChatBox(html, className) { 
    let div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

// Function to get AI response
async function getApiResponse(aiChatBox) {
    let textElement = aiChatBox.querySelector(".text"); 

    try { 
        let response = await fetch(Api_Url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }] // Ensure correct JSON structure
            })
        });

        let data = await response.json();
        
        // ✅ Debugging: Log the entire API response
        console.log("API Response:", data);

        // ✅ Check if there's an error in the response
        if (data.error) {
            console.error("API Error:", data.error);
            textElement.innerText = `Error: ${data.error.message}`;
            return;
        }

        // ✅ Extract AI's response correctly
        let apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";

        textElement.innerText = apiResponse;
    } catch (error) {
        console.error("Network/API Error:", error);
        textElement.innerText = "Network error. Check API key and internet connection.";
    } finally {
        aiChatBox.querySelector(".loading").style.display = "none";
    }
}


// Function to show loading animation
function showLoading() {
    let html = `
        <div class="img">
            <img src="ai.jpg" alt="AI" width="50">
        </div>
        <p class="text"></p>
        <img class="loading" src="loading.gif" alt="loading" height="50">
    `;

    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);

    getApiResponse(aiChatBox); // Fetch response after showing loading
}

// Button click event
btn.addEventListener("click", () => {
    userMessage = prompt.value.trim(); // Trim to avoid empty spaces
    if (!userMessage) return; // Prevent empty submissions

    let html = `
        <div class="img">
            <img src="user.png" alt="User" width="50">
        </div>
        <p class="text">${userMessage}</p>
    `;

    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);
    prompt.value = ""; // Clear input after sending message

    setTimeout(showLoading, 500);
});

// Allow sending messages with the Enter key
prompt.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        btn.click();
    }
});
