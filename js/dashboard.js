// ==========================================
// AI TITANS SOCIAL
// Dashboard JS
// ==========================================

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
// USER WELCOME
// ===============================

// LocalStorage se email uthao
const userEmail = localStorage.getItem("userEmail");

// Welcome text wala element
const welcomeText = document.querySelector(".welcome-text");

// Agar email mila
if (userEmail && welcomeText) {

    // Email ka username nikalo
    const userName = userEmail.split("@")[0];

    // First letter Capital
    const finalName =
        userName.charAt(0).toUpperCase() +
        userName.slice(1);

    welcomeText.innerHTML = `
        Welcome back, ${finalName} 👋
    `;

}    


// ===============================
// Logout
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (confirmLogout) {

            localStorage.removeItem("userEmail");

            window.location.href = "login.html";

        }

    });

}