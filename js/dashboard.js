import { auth } from "../firebase/firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ================= Sidebar =================

const menuItems = document.querySelectorAll(".menu li");

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    const text = item.innerText.trim();

    if (text === "AI Content") {
      window.location.href = "ai-content.html";
    }
  });
});

// ================= Hero Button =================

const heroButton = document.querySelector(".hero-box button");

if (heroButton) {
  heroButton.addEventListener("click", () => {
    window.location.href = "ai-content.html";
  });
}

// ================= Notifications =================

const bell = document.querySelector(".fa-bell");

if (bell) {
  bell.onclick = () => alert("🔔 No new notifications");
}

const mail = document.querySelector(".fa-envelope");

if (mail) {
  mail.onclick = () => alert("📧 Inbox is empty");
}

// ================= Counter Animation =================

document.querySelectorAll(".card h2").forEach((counter) => {

  const target = counter.innerText;

  if (target.includes("K")) {

    let end = parseFloat(target);

    let value = 0;

    const timer = setInterval(() => {

      value += 0.2;

      counter.innerText = value.toFixed(1) + "K";

      if (value >= end) {

        counter.innerText = target;

        clearInterval(timer);

      }

    }, 30);

  }

  else if (target.includes("%")) {

    let end = parseInt(target);

    let value = 0;

    const timer = setInterval(() => {

      value++;

      counter.innerText = value + "%";

      if (value >= end) {

        counter.innerText = target;

        clearInterval(timer);

      }

    }, 20);

  }

  else {

    let end = parseInt(target);

    let value = 0;

    let step = Math.ceil(end / 60);

    const timer = setInterval(() => {

      value += step;

      counter.innerText = value;

      if (value >= end) {

        counter.innerText = target;

        clearInterval(timer);

      }

    }, 20);

  }

});

// ================= Greeting =================

const hour = new Date().getHours();

let greet = "🌙 Good Evening";

if (hour < 12) {

  greet = "🌅 Good Morning";

}

else if (hour < 18) {

  greet = "☀️ Good Afternoon";

}

const heading = document.querySelector(".topbar h1");

if (heading) {

  heading.textContent = greet;

}

// ================= Firebase =================

onAuthStateChanged(auth, (user) => {

  if (!user) {

    window.location.href = "login.html";

    return;

  }

  const welcome = document.querySelector(".welcome-text");

  if (welcome) {

    welcome.textContent = `Welcome back ${user.displayName || user.email} 👋`;

  }

  const email = document.querySelector(".user-email");

  if (email) {

    email.textContent = user.email;

  }

  const profileName = document.querySelector(".profile span");

  if (profileName) {

    profileName.textContent = user.displayName || "User";

  }

  const profileImage = document.querySelector(".profile img");

  if (profileImage && user.photoURL) {

    profileImage.src = user.photoURL;

  }

});

// ================= Logout =================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.onclick = async () => {

    const ok = confirm("Logout?");

    if (!ok) return;

    await signOut(auth);

    window.location.href = "login.html";

  };

}

console.log("Dashboard Loaded ✅");
