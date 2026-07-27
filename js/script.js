// ===============================
// AI TITANS SOCIAL
// script.js
// ===============================

// Navbar Background Change on Scroll

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        navbar.style.background = "#0F172A";
        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,.3)";

    } else {

        navbar.style.background = "rgba(15,23,42,.85)";
        navbar.style.boxShadow = "none";
    }
const ctaStart = document.getElementById("ctaStart");
});


// ===============================
// Fade-in Animation on Scroll
// ===============================

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: 0.2
});

cards.forEach(card => observer.observe(card));





// ===============================
// Hero Text Typing Effect
// ===============================


const heroTitle = document.querySelector(".hero h2");

if(heroTitle){

    const text = "Create Once.\nPublish Everywhere.";
    let index = 0;

    heroTitle.innerHTML = "";

    function typeText(){

        if(index < text.length){

            if(text[index] === "\n"){
                heroTitle.innerHTML += "<br>";
            }else{
                heroTitle.innerHTML += text[index];
            }

            index++;
            setTimeout(typeText,60);

        }

    }

    typeText();

}


// ===============================
// Navigation Buttons
// ===============================

const loginBtn = document.getElementById("loginBtn");
const startBtn = document.getElementById("startBtn");
const heroStart = document.getElementById("heroStart");
const watchDemo = document.getElementById("watchDemo");

// Login Button

if (loginBtn) {

    loginBtn.addEventListener("click", () => {

        window.location.href = "login.html";

    });

}

// Navbar Get Started

// Navbar Get Started

if (startBtn) {

    startBtn.addEventListener("click", () => {

        window.location.href = "signup.html";

    });

}

// Hero Get Started

if (heroStart) {

    heroStart.addEventListener("click", () => {

        window.location.href = "signup.html";

    });

}

// CTA Get Started

if (ctaStart) {

    ctaStart.addEventListener("click", () => {

        window.location.href = "signup.html";

    });

}

// Watch Demo

if (watchDemo) {

    watchDemo.addEventListener("click", () => {

        alert(
`🚀 AI TITANS SOCIAL

Demo Coming Soon!

Version 2 me Video Demo add hoga.`
        );

    });

}






