import { auth } from "../firebase/firebase.js";

import {
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const profileKey = "aiTitansSocialSettingsProfile";
const notificationKey = "aiTitansSocialNotificationPrefs";

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const logoutBtn = document.getElementById("logoutBtn");
const toastContainer = document.getElementById("toastContainer");
const avatar = document.getElementById("settingsAvatar");
const mobileAvatar = document.getElementById("mobileProfileImg");
const nameInput = document.getElementById("setName");
const emailInput = document.getElementById("setEmail");
const bioInput = document.getElementById("setBio");

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}"></i><span>${message}</span>`;
    toastContainer?.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2800);
}

function getStoredProfile() {
    try {
        return JSON.parse(localStorage.getItem(profileKey)) || {};
    } catch {
        localStorage.removeItem(profileKey);
        return {};
    }
}

function saveStoredProfile(profile) {
    localStorage.setItem(profileKey, JSON.stringify(profile));
}

function applyProfile(profile) {
    if (profile.name && nameInput) nameInput.value = profile.name;
    if (profile.email && emailInput) emailInput.value = profile.email;
    if (profile.bio && bioInput) bioInput.value = profile.bio;
    if (profile.photoURL && avatar) avatar.src = profile.photoURL;
    if (profile.photoURL && mobileAvatar) mobileAvatar.src = profile.photoURL;
}

document.querySelectorAll(".set-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".set-tab").forEach((item) => item.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add("active");
    });
});

menuToggle?.addEventListener("click", () => {
    sidebar?.classList.toggle("open");
});

document.addEventListener("click", (event) => {
    if (!sidebar?.classList.contains("open")) return;
    if (sidebar.contains(event.target) || menuToggle?.contains(event.target)) return;
    sidebar.classList.remove("open");
});

document.getElementById("saveProfile")?.addEventListener("click", async () => {
    const profile = {
        name: nameInput?.value.trim() || "Ahmad Khan",
        email: emailInput?.value.trim() || "",
        bio: bioInput?.value.trim() || "",
        photoURL: avatar?.src || ""
    };

    saveStoredProfile(profile);

    try {
        if (auth.currentUser && auth.currentUser.displayName !== profile.name) {
            await updateProfile(auth.currentUser, { displayName: profile.name });
        }
        showToast("Profile saved successfully.");
    } catch (error) {
        console.error("Profile update failed:", error);
        showToast("Profile saved locally. Firebase update failed.", "error");
    }
});

document.querySelector(".change-avatar")?.addEventListener("click", () => {
    const photoURL = window.prompt("Paste a profile image URL:");
    if (!photoURL) return;

    const profile = {
        ...getStoredProfile(),
        photoURL
    };
    saveStoredProfile(profile);
    applyProfile(profile);
    showToast("Profile photo updated.");
});

document.querySelectorAll(".btn-connect, .btn-disconnect").forEach((button) => {
    button.addEventListener("click", () => {
        const isConnected = button.classList.contains("btn-disconnect");
        button.classList.toggle("btn-disconnect", !isConnected);
        button.classList.toggle("btn-connect", isConnected);
        button.textContent = isConnected ? "Connect" : "Disconnect";
        showToast(isConnected ? "Account disconnected." : "Account connected.");
    });
});

const notificationToggles = document.querySelectorAll("#tab-notifications input[type='checkbox']");

function loadNotifications() {
    try {
        const saved = JSON.parse(localStorage.getItem(notificationKey));
        if (!Array.isArray(saved)) return;
        notificationToggles.forEach((toggle, index) => {
            toggle.checked = Boolean(saved[index]);
        });
    } catch {
        localStorage.removeItem(notificationKey);
    }
}

notificationToggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
        localStorage.setItem(
            notificationKey,
            JSON.stringify(Array.from(notificationToggles, (item) => item.checked))
        );
        showToast("Notification preference updated.");
    });
});

document.querySelector("#tab-security .save-btn")?.addEventListener("click", () => {
    showToast("Password update UI is ready. Connect Firebase password update before production.");
});

document.querySelector("#tab-billing .save-btn")?.addEventListener("click", () => {
    window.location.href = "index.html#pricing";
});

logoutBtn?.addEventListener("click", async () => {
    if (!window.confirm("Do you want to log out?")) return;

    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout failed:", error);
        showToast("Could not log out. Please try again.", "error");
    }
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const storedProfile = getStoredProfile();
    applyProfile({
        name: user.displayName || storedProfile.name || "Ahmad Khan",
        email: user.email || storedProfile.email || "",
        bio: storedProfile.bio || "AI enthusiast & Social Media Strategist",
        photoURL: user.photoURL || storedProfile.photoURL || avatar?.src || ""
    });
});

loadNotifications();
applyProfile(getStoredProfile());
