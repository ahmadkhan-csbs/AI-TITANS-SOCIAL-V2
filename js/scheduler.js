import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const storageKey = "aiTitansSocialScheduledPosts";
const form = document.getElementById("scheduleForm");
const platform = document.getElementById("schedulePlatform");
const content = document.getElementById("postContent");
const dateInput = document.getElementById("scheduleDate");
const timeInput = document.getElementById("scheduleTime");
const scheduledList = document.getElementById("scheduledList");
const emptyState = document.getElementById("emptyState");
const postCount = document.getElementById("postCount");
const logoutBtn = document.getElementById("logoutBtn");

function getPosts() {
    try {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
        return [];
    }
}

function savePosts(posts) {
    localStorage.setItem(storageKey, JSON.stringify(posts));
}

function formatDate(dateTime) {
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(dateTime));
}

function renderPosts() {
    const posts = getPosts().sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    scheduledList.innerHTML = "";
    postCount.textContent = `${posts.length} post${posts.length === 1 ? "" : "s"} scheduled`;
    emptyState.classList.toggle("hidden", posts.length > 0);

    posts.forEach((post) => {
        const card = document.createElement("article");
        card.className = "scheduled-card";

        const meta = document.createElement("div");
        meta.className = "post-meta";
        const badge = document.createElement("span");
        badge.className = "platform-badge";
        badge.textContent = post.platform;
        const date = document.createElement("span");
        date.className = "post-date";
        date.textContent = formatDate(post.scheduledAt);
        meta.append(badge, date);

        const postText = document.createElement("p");
        postText.className = "post-content";
        postText.textContent = post.content;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";
        deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i> Remove';
        deleteButton.addEventListener("click", () => {
            savePosts(getPosts().filter((item) => item.id !== post.id));
            renderPosts();
        });

        card.append(meta, postText, deleteButton);
        scheduledList.appendChild(card);
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const scheduledAt = new Date(`${dateInput.value}T${timeInput.value}`);

    if (scheduledAt <= new Date()) {
        alert("Please choose a future date and time.");
        return;
    }

    const posts = getPosts();
    posts.push({
        id: crypto.randomUUID(),
        platform: platform.value,
        content: content.value.trim(),
        scheduledAt: scheduledAt.toISOString()
    });

    savePosts(posts);
    form.reset();
    setDefaultDateTime();
    renderPosts();
});

function setDefaultDateTime() {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    dateInput.min = new Date().toISOString().split("T")[0];
    dateInput.value = nextHour.toISOString().split("T")[0];
    timeInput.value = nextHour.toTimeString().slice(0, 5);
}

onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = "login.html";
});

logoutBtn.addEventListener("click", async () => {
    if (!window.confirm("Do you want to log out?")) return;
    await signOut(auth);
    window.location.href = "login.html";
});

setDefaultDateTime();
renderPosts();
