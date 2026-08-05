import { auth } from "../firebase/firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const conversations = Array.from(document.querySelectorAll(".conversation"));
const searchInput = document.getElementById("searchInput");
const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const aiReplyBtn = document.getElementById("aiReplyBtn");
const refreshBtn = document.querySelector(".refresh-btn");
const logoutBtn = document.querySelector(".logout-btn");
const emojiButton = document.querySelector(".input-action");
const attachButton = document.querySelectorAll(".input-action")[1];
const imageButton = document.querySelectorAll(".input-action")[2];
const emojiPicker = document.getElementById("emojiPicker");
const emojiGrid = document.getElementById("emojiGrid");
const emojiTabs = Array.from(document.querySelectorAll(".emoji-tab"));
const emojiSearch = document.getElementById("emojiSearch");

const platformLabels = {
    linkedin: "LinkedIn",
    instagram: "Instagram",
    facebook: "Facebook",
    twitter: "X",
    threads: "Threads"
};

const conversationMessages = {
    "Rahul Sharma": [
        ["incoming", "Hi Ahmad 👋\nI saw your AI TITANS SOCIAL project on GitHub.", "10:20 AM"],
        ["outgoing", "Thank you 😊\nI'm currently building an AI powered Social Media Dashboard.", "10:23 AM"],
        ["incoming", "Looks impressive. Can it generate LinkedIn, Instagram and X posts?", "10:25 AM"],
        ["outgoing", "Yes 🚀 AI Content Generator, Scheduler, Analytics and Inbox are all included.", "10:27 AM"],
        ["incoming", "Amazing. I would love to try the beta version.", "10:29 AM"]
    ],
    "Sneha Dhara": [
        ["incoming", "Your latest reel looks amazing 🔥", "09:14 AM"],
        ["outgoing", "Thank you! I am testing the new AI caption flow today.", "09:18 AM"]
    ],
    "Aman Verma": [
        ["incoming", "Meeting at 7 PM today.", "Yesterday"],
        ["outgoing", "Done. I will keep the scheduler demo ready.", "Yesterday"]
    ],
    "Elon Fan": [
        ["incoming", "Can you share your AI tool?", "Mon"],
        ["outgoing", "Sure. AI TITANS SOCIAL is built for content, scheduling, analytics and inbox management.", "Mon"]
    ],
    "Creative Studio": [
        ["incoming", "Interested in your AI content platform.", "Sun"],
        ["outgoing", "Great. Tell me which platform you post on most and I will suggest a workflow.", "Sun"]
    ]
};

const emojiData = {
    smileys: ["😀", "😁", "😂", "🤣", "😅", "😊", "😍", "🥰", "😘", "😎", "🤓", "😇", "😜", "🤩", "🥳"],
    hearts: ["❤️", "💙", "💚", "💛", "🧡", "💜", "🖤", "🤍", "🤎", "💖", "💕", "💓"],
    gestures: ["👍", "👎", "👏", "🙌", "🤝", "👌", "✌️", "🤞", "🤟", "👊", "🙏", "💪"],
    tech: ["🚀", "💻", "🖥️", "📱", "⚡", "🤖", "🧠", "🌐", "📡", "⌨️", "🖱️"]
};

let activeFilter = "all";
let currentCategory = "smileys";
let activeConversation = conversations.find((item) => item.classList.contains("active")) || conversations[0];

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2400);
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function autoScroll() {
    chatMessages?.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: "smooth"
    });
}

function getConversationName(conversation) {
    return conversation?.querySelector("h4")?.textContent.trim() || "AI TITANS";
}

function getConversationAvatar(conversation) {
    return conversation?.querySelector("img")?.src || "https://ui-avatars.com/api/?name=AI+Titans&background=4F46E5&color=fff";
}

function getConversationPlatform(conversation) {
    return conversation?.dataset.platform || "linkedin";
}

function createMessageElement(type, text, time, avatarSrc) {
    const message = document.createElement("div");
    message.className = `message ${type}`;

    if (type === "incoming") {
        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        const image = document.createElement("img");
        image.src = avatarSrc;
        image.alt = "Avatar";
        avatar.appendChild(image);
        message.appendChild(avatar);
    }

    const content = document.createElement("div");
    content.className = "message-content";

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    const stamp = document.createElement("span");
    stamp.textContent = time;

    content.append(paragraph, stamp);
    message.appendChild(content);

    return message;
}

function renderConversationMessages(conversation) {
    if (!chatMessages) return;

    const name = getConversationName(conversation);
    const avatar = getConversationAvatar(conversation);
    const messages = conversationMessages[name] || [["incoming", "Thanks for reaching out to AI TITANS SOCIAL.", getCurrentTime()]];

    chatMessages.innerHTML = "";

    const date = document.createElement("div");
    date.className = "message-date";
    date.textContent = "Today";
    chatMessages.appendChild(date);

    messages.forEach(([type, text, time]) => {
        chatMessages.appendChild(createMessageElement(type, text, time, avatar));
    });

    addTypingIndicator(conversation);
    autoScroll();
}

function addTypingIndicator(conversation) {
    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    indicator.innerHTML = `
        <div class="typing-avatar">
            <img src="${getConversationAvatar(conversation)}" alt="Avatar">
        </div>
        <div class="typing-box"><span></span><span></span><span></span></div>
    `;
    chatMessages.appendChild(indicator);
}

function updateChatHeader(conversation) {
    const name = getConversationName(conversation);
    const avatar = getConversationAvatar(conversation);
    const platform = platformLabels[getConversationPlatform(conversation)] || "Inbox";

    const headerName = document.querySelector(".user-details h3");
    const headerAvatar = document.querySelector(".chat-user img");
    const headerStatus = document.querySelector(".user-details span");

    if (headerName) headerName.textContent = name;
    if (headerAvatar) headerAvatar.src = avatar;
    if (headerStatus) {
        headerStatus.innerHTML = `<i class="fa-solid fa-circle"></i> Online • ${platform}`;
    }
}

function selectConversation(conversation) {
    conversations.forEach((item) => item.classList.remove("active"));
    conversation.classList.add("active");
    conversation.querySelector(".badge.unread")?.remove();
    activeConversation = conversation;
    updateChatHeader(conversation);
    renderConversationMessages(conversation);
}

function conversationMatchesSearch(conversation, keyword) {
    if (!keyword) return true;
    const haystack = [
        conversation.querySelector("h4")?.textContent,
        conversation.querySelector("p")?.textContent,
        platformLabels[getConversationPlatform(conversation)]
    ].join(" ").toLowerCase();
    return haystack.includes(keyword);
}

function conversationMatchesFilter(conversation) {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return Boolean(conversation.querySelector(".badge.unread"));
    return getConversationPlatform(conversation) === activeFilter;
}

function applyConversationFilters() {
    const keyword = searchInput?.value.trim().toLowerCase() || "";

    conversations.forEach((conversation) => {
        const isVisible = conversationMatchesSearch(conversation, keyword) && conversationMatchesFilter(conversation);
        conversation.style.display = isVisible ? "flex" : "none";
    });
}

function appendOutgoingMessage(text) {
    const sentAt = getCurrentTime();
    chatMessages?.querySelector(".typing-indicator")?.remove();
    chatMessages?.appendChild(createMessageElement("outgoing", text, sentAt));
    conversationMessages[getConversationName(activeConversation)] = [
        ...(conversationMessages[getConversationName(activeConversation)] || []),
        ["outgoing", text, sentAt]
    ];
    autoScroll();
}

function appendIncomingReply(text) {
    const reply = text || "Thanks for your message. Our team will get back to you shortly.";
    chatMessages?.querySelector(".typing-indicator")?.remove();
    chatMessages?.appendChild(createMessageElement("incoming", reply, getCurrentTime(), getConversationAvatar(activeConversation)));
    addTypingIndicator(activeConversation);
    autoScroll();
}

function sendMessage() {
    const text = messageInput?.value.trim();
    if (!text) return;

    appendOutgoingMessage(text);
    messageInput.value = "";

    setTimeout(() => {
        appendIncomingReply("Thanks for the update. This looks useful for the AI TITANS SOCIAL workflow.");
    }, 900);
}

function renderEmojis() {
    if (!emojiGrid) return;

    const keyword = emojiSearch?.value.trim() || "";
    emojiGrid.innerHTML = "";

    emojiData[currentCategory]
        .filter((emoji) => !keyword || emoji.includes(keyword))
        .forEach((emoji) => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "emoji";
            item.textContent = emoji;
            item.addEventListener("click", () => {
                messageInput.value += emoji;
                messageInput.focus();
            });
            emojiGrid.appendChild(item);
        });
}

function createUploadInput() {
    const input = document.createElement("input");
    input.type = "file";
    input.id = "fileUploader";
    input.multiple = true;
    input.hidden = true;
    document.body.appendChild(input);

    input.addEventListener("change", () => {
        handleFiles(Array.from(input.files || []));
        input.value = "";
    });

    return input;
}

function ensurePreviewContainer() {
    let container = document.getElementById("filePreviewContainer");
    if (container) return container;

    container = document.createElement("div");
    container.id = "filePreviewContainer";
    container.className = "file-preview-container";
    document.querySelector(".chat-input-area")?.before(container);
    return container;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function handleFiles(files) {
    if (!files.length) return;

    const container = ensurePreviewContainer();

    files.forEach((file) => {
        const preview = document.createElement("div");
        preview.className = "file-preview";
        preview.innerHTML = `
            <div class="file-left">
                <div class="file-icon ${file.type.startsWith("image") ? "image" : "doc"}">
                    <i class="fa-solid ${file.type.startsWith("image") ? "fa-image" : "fa-file"}"></i>
                </div>
                <div class="file-info">
                    <div class="file-name"></div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                    <div class="upload-progress"><span></span></div>
                </div>
            </div>
            <button class="remove-file" type="button"><i class="fa-solid fa-xmark"></i></button>
        `;

        preview.querySelector(".file-name").textContent = file.name;
        preview.querySelector(".remove-file").addEventListener("click", () => preview.remove());
        container.appendChild(preview);

        requestAnimationFrame(() => {
            preview.querySelector(".upload-progress span").style.width = "100%";
        });
    });

    showToast(`${files.length} file${files.length === 1 ? "" : "s"} attached.`);
}

const fileUploader = createUploadInput();

conversations.forEach((conversation) => {
    conversation.addEventListener("click", () => selectConversation(conversation));
});

searchInput?.addEventListener("input", applyConversationFilters);

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        activeFilter = button.dataset.filter || "all";
        applyConversationFilters();
    });
});

sendBtn?.addEventListener("click", sendMessage);

messageInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

aiReplyBtn?.addEventListener("click", () => {
    const text = messageInput?.value.trim();
    messageInput.value = text
        ? `Thanks for sharing this. ${text} sounds interesting, and I would be happy to help you explore the next step.`
        : "Thanks for reaching out. I would be happy to help. Could you share a little more detail?";
    messageInput.focus();
});

refreshBtn?.addEventListener("click", () => {
    const original = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Refreshing';
    refreshBtn.disabled = true;

    setTimeout(() => {
        refreshBtn.innerHTML = original;
        refreshBtn.disabled = false;
        showToast("Inbox refreshed successfully.");
    }, 800);
});

emojiButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    emojiPicker?.classList.toggle("show");
});

emojiTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        emojiTabs.forEach((item) => item.classList.remove("active"));
        tab.classList.add("active");
        currentCategory = tab.dataset.category || "smileys";
        renderEmojis();
    });
});

emojiSearch?.addEventListener("input", renderEmojis);

document.addEventListener("click", (event) => {
    if (!emojiPicker || !emojiButton) return;
    if (!emojiPicker.contains(event.target) && !emojiButton.contains(event.target)) {
        emojiPicker.classList.remove("show");
    }
});

attachButton?.addEventListener("click", () => fileUploader.click());
imageButton?.addEventListener("click", () => {
    fileUploader.accept = "image/*";
    fileUploader.click();
    setTimeout(() => {
        fileUploader.accept = "";
    }, 0);
});

logoutBtn?.addEventListener("click", async () => {
    if (!window.confirm("Do you want to log out?")) return;
    await signOut(auth);
    window.location.href = "login.html";
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

if (activeConversation) {
    updateChatHeader(activeConversation);
    renderConversationMessages(activeConversation);
}

renderEmojis();

window.addEventListener("load", () => {
    setTimeout(() => showToast("Welcome to AI TITANS SOCIAL Inbox."), 500);
});
