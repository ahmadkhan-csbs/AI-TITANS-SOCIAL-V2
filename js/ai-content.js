import { auth } from "../firebase/firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const platform = document.getElementById("platform");
const topic = document.getElementById("topic");
const tone = document.getElementById("tone");
const length = document.getElementById("length");
const emoji = document.getElementById("emoji");
const hashtags = document.getElementById("hashtags");
const output = document.getElementById("output");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

const draftKey = "aiTitansSocialDraft";

function buildFallbackPost(topicValue) {
    const platformValue = platform.value;
    const toneValue = tone.value.toLowerCase();
    const lengthValue = length.value.toLowerCase();
    const emojiText = emoji.checked ? " 🚀" : "";
    const hashtagText = hashtags.checked
        ? `\n\n#${topicValue.replace(/[^a-z0-9]+/gi, "").slice(0, 28) || "AITitans"} #SocialMedia #AI`
        : "";

    const openers = {
        professional: `Here is a practical update on ${topicValue}.`,
        friendly: `Let's talk about ${topicValue}.`,
        motivational: `${topicValue} is a reminder that progress compounds when you stay consistent.`,
        funny: `${topicValue} sounds simple until your content calendar asks for five versions by lunch.`,
        educational: `Quick breakdown: ${topicValue} can become stronger content when it is clear, useful, and audience-first.`
    };

    const platformAdvice = {
        LinkedIn: "Focus on the problem, share a clear insight, and end with a thoughtful question.",
        Instagram: "Keep the hook visual, make the caption skimmable, and invite people to save or share it.",
        Facebook: "Use a conversational angle and make the next action easy for your audience.",
        X: "Lead with the sharpest idea, keep every word useful, and make it repost-worthy.",
        Threads: "Write it like a real conversation and keep the momentum easy to reply to."
    };

    const body = [
        openers[toneValue] || openers.professional,
        platformAdvice[platformValue] || platformAdvice.LinkedIn
    ];

    if (lengthValue !== "short") {
        body.push("The best posts do not just describe a feature. They show why it matters, how it helps, and what someone can do next.");
    }

    if (lengthValue === "long") {
        body.push("Start with one specific pain point, add a concrete example, then close with a call to action that feels natural instead of forced.");
    }

    return `${body.join("\n\n")}${emojiText}${hashtagText}`;
}

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

generateBtn.addEventListener("click", async () => {
    const topicValue = topic.value.trim();

    if (!topicValue) {
        alert("Please enter a topic first.");
        topic.focus();
        return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";
    output.value = "";

    const prompt = `Generate a ${length.value.toLowerCase()}, ${tone.value.toLowerCase()} social media post.

Platform: ${platform.value}
Topic: ${topicValue}
Include emojis: ${emoji.checked ? "Yes" : "No"}
Include hashtags: ${hashtags.checked ? "Yes" : "No"}`;

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        if (!response.ok) {
            console.warn("AI service returned an error:", data.error || data);
            output.value = buildFallbackPost(topicValue);
            return;
        }

        output.value = data.result || "No content was generated. Please try again.";
    } catch (error) {
        console.error("Content generation failed:", error);
        output.value = buildFallbackPost(topicValue);
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate Content";
    }
});

copyBtn.addEventListener("click", async () => {
    if (!output.value.trim()) {
        alert("Generate or enter content before copying.");
        return;
    }

    try {
        await navigator.clipboard.writeText(output.value);
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
            copyBtn.textContent = "Copy";
        }, 1500);
    } catch (error) {
        console.error("Copy failed:", error);
        alert("Copy failed. Please select the content and copy it manually.");
    }
});

downloadBtn.addEventListener("click", () => {
    if (!output.value.trim()) {
        alert("Generate or enter content before downloading.");
        return;
    }

    const blob = new Blob([output.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ai-titans-social-post.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
});

saveBtn.addEventListener("click", () => {
    if (!output.value.trim()) {
        alert("Generate or enter content before saving a draft.");
        return;
    }

    localStorage.setItem(draftKey, JSON.stringify({
        platform: platform.value,
        topic: topic.value,
        tone: tone.value,
        length: length.value,
        emoji: emoji.checked,
        hashtags: hashtags.checked,
        content: output.value,
        savedAt: new Date().toISOString()
    }));

    saveBtn.textContent = "Saved!";
    setTimeout(() => {
        saveBtn.textContent = "Save Draft";
    }, 1500);
});

function loadDraft() {
    const storedDraft = localStorage.getItem(draftKey);

    if (!storedDraft) return;

    try {
        const draft = JSON.parse(storedDraft);
        platform.value = draft.platform || platform.value;
        topic.value = draft.topic || "";
        tone.value = draft.tone || tone.value;
        length.value = draft.length || length.value;
        emoji.checked = draft.emoji ?? emoji.checked;
        hashtags.checked = draft.hashtags ?? hashtags.checked;
        output.value = draft.content || "";
    } catch (error) {
        console.error("Draft could not be loaded:", error);
        localStorage.removeItem(draftKey);
    }
}

loadDraft();

logoutBtn.addEventListener("click", async () => {
    const confirmed = window.confirm("Do you want to log out?");

    if (!confirmed) return;

    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout failed:", error);
        alert("Could not log out. Please try again.");
    }
});
