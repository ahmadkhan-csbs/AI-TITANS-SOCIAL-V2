import { auth } from "../firebase/firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Authentication Check
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

});

// Elements
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

// ===============================
// Generate AI Content
// ===============================

generateBtn.addEventListener("click", async () => {

    if (topic.value.trim() === "") {

        alert("Please enter topic");
        return;

    }

    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";

    output.value = "";

    const prompt = `
Generate a ${length.value} ${tone.value} social media post.

Platform: ${platform.value}

Topic: ${topic.value}

Emoji: ${emoji.checked ? "Yes" : "No"}

Hashtags: ${hashtags.checked ? "Yes" : "No"}
`;

    try {

        const response = await fetch("/api/generate", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                prompt

            })

        });

        const data = await response.json();

        output.value = data.result;

    }

    catch (error) {

        console.log(error);

        output.value = "Something went wrong.";

    }

    generateBtn.disabled = false;
    generateBtn.innerText = "Generate Content";

});

// ===============================
// Copy
// ===============================

copyBtn.addEventListener("click", async () => {

    if (output.value === "") return;

    await navigator.clipboard.writeText(output.value);

    alert("Copied");

});

// ===============================
// Download
// ===============================

downloadBtn.addEventListener("click", () => {

    if (output.value === "") return;

    const blob = new Blob([output.value], {

        type: "text/plain"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "AI-Content.txt";

    a.click();

});

// ===============================
// Save Draft
// ===============================

saveBtn.addEventListener("click", () => {

    if (output.value === "") return;

    localStorage.setItem("draft", output.value);

    alert("Draft Saved");

});

// Load Draft
const draft = localStorage.getItem("draft");

if (draft) {

    output.value = draft;

}

// ===============================
// Logout
// ===============================

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});