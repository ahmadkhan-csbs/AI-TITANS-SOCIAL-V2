// ==========================================
// AI TITANS SOCIAL
// Dashboard JS
// ==========================================
import { auth } from "../firebase/firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// -------------------------------
// Active Sidebar Menu
// -------------------------------

const menuItems = document.querySelectorAll(".menu li");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(i => i.classList.remove("active"));

        item.classList.add("active");

    });

});

// -------------------------------
// Hero Button
// -------------------------------

const heroButton = document.querySelector(".hero-box button");

if(heroButton){

heroButton.addEventListener("click",()=>{

alert("🚀 AI Content Generator will be available soon!");

});

}

// -------------------------------
// Notification Bell
// -------------------------------

const bell = document.querySelector(".fa-bell");

if(bell){

bell.addEventListener("click",()=>{

alert("🔔 No New Notifications");

});

}

// -------------------------------
// Mail
// -------------------------------

const mail = document.querySelector(".fa-envelope");

if(mail){

mail.addEventListener("click",()=>{

alert("📧 Inbox is empty");

});

}

// -------------------------------
// Animated Counter
// -------------------------------

const counters=document.querySelectorAll(".card h2");

counters.forEach(counter=>{

let target=counter.innerText;

if(target.includes("K")){

let num=parseFloat(target);

let count=0;

let interval=setInterval(()=>{

count+=0.2;

counter.innerText=count.toFixed(1)+"K";

if(count>=num){

counter.innerText=target;

clearInterval(interval);

}

},30);

}

else if(target.includes("%")){

let num=parseInt(target);

let count=0;

let interval=setInterval(()=>{

count++;

counter.innerText=count+"%";

if(count>=num){

counter.innerText=target;

clearInterval(interval);

}

},20);

}

else{

let num=parseInt(target);

let count=0;

let step=Math.ceil(num/60);

let interval=setInterval(()=>{

count+=step;

counter.innerText=count;

if(count>=num){

counter.innerText=target;

clearInterval(interval);

}

},20);

}

});

// -------------------------------
// Cards Hover Animation
// -------------------------------

const cards=document.querySelectorAll(".card");

cards.forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.transform="translateY(-10px) scale(1.03)";

});

card.addEventListener("mouseleave",()=>{

card.style.transform="translateY(0px) scale(1)";

});

});

// -------------------------------
// Panels Animation
// -------------------------------

const panels=document.querySelectorAll(".panel");

panels.forEach(panel=>{

panel.addEventListener("mouseenter",()=>{

panel.style.boxShadow="0 25px 60px rgba(37,99,235,.25)";

});

panel.addEventListener("mouseleave",()=>{

panel.style.boxShadow="none";

});

});

// -------------------------------
// Welcome Message
// -------------------------------

const hour=new Date().getHours();

let greeting="Welcome 👋";

if(hour<12){

greeting="🌅 Good Morning";

}

else if(hour<18){

greeting="☀️ Good Afternoon";

}

else{

greeting="🌙 Good Evening";

}

const heading=document.querySelector(".topbar h1");

if(heading){

heading.innerText=greeting;

}

// -------------------------------
// Console
// -------------------------------

console.log("AI TITANS SOCIAL Dashboard Loaded 🚀");




// ===============================
// Firebase User
// ===============================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    const welcomeText = document.querySelector(".welcome-text");

    if (welcomeText) {

        welcomeText.innerHTML =
        `Welcome back, ${user.displayName || user.email} 👋`;

    }

});

// ===============================
// Logout
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

    const confirmLogout = confirm("Logout?");

    if (!confirmLogout) return;

    await signOut(auth);

    window.location.href = "login.html";

});

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (confirmLogout) {


            window.location.href = "login.html";

        }

    });

}

// ==========================================
// FIREBASE AUTH
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    // Welcome Text
    const welcomeText = document.querySelector(".welcome-text");

    if (welcomeText) {

        welcomeText.innerHTML =
        `Welcome back, ${user.displayName || "User"} 👋`;

    }

    // Profile Name
    const profileName = document.querySelector(".profile span");

    if (profileName) {

        profileName.textContent =
        user.displayName || "User";

    }

    // Profile Image
    const profileImage =
    document.querySelector(".profile img");

    if (profileImage && user.photoURL) {

        profileImage.src = user.photoURL;

    }

});

const hour = new Date().getHours();

let greet = "Good Evening";

if (hour < 12) {

    greet = "Good Morning";

} else if (hour < 18) {

    greet = "Good Afternoon";

}

const heading = document.querySelector(".topbar h1");

if (heading) {

    heading.innerHTML = `${greet} ☀️`;

}

const email = document.querySelector(".user-email");

if (email) {

    email.innerHTML = `📧 ${user.email}`;

}

const loginTime = document.querySelector(".login-time");

if (loginTime) {

    loginTime.innerHTML = `🕒 ${new Date().toLocaleString()}`;

}

const heroTitle = document.querySelector(".hero-title");

if (heroTitle) {

    heroTitle.innerHTML = `Welcome ${user.displayName || "User"} 🚀`;

}


// ==========================================
// FIREBASE LOGOUT
// ==========================================

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click", async ()=>{

    const ok =
    confirm("Are you sure you want to logout?");

    if(!ok) return;

    try{

        await signOut(auth);

        window.location.href =
        "login.html";

    }

    catch(error){

        console.log(error);

        alert("Logout Failed");

    }

});

}