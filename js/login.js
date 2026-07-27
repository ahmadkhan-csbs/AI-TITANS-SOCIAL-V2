// ==========================================
// AI TITANS SOCIAL
// Login System - Part 1
// ==========================================

// Form ko pakdo
const loginForm = document.getElementById("loginForm");

// Email input ko pakdo
const email = document.getElementById("email");

// Password input ko pakdo
const password = document.getElementById("password");

// Error Message
const errorMessage = document.getElementById("errorMessage");

// Form submit hone par
loginForm.addEventListener("submit", function(event){

    // Page reload hone se roko
    event.preventDefault();

    // Email aur Password ki value lo
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    // Error message clear karo
    errorMessage.innerText = "";

    // -----------------------------
    // Empty Email
    // -----------------------------

    if(emailValue === ""){

        errorMessage.innerText = "Please enter your email.";
        return;

    }

    // -----------------------------
    // Email Validation
    // -----------------------------

    if(!emailValue.includes("@")){

        errorMessage.innerText = "Please enter a valid email.";
        return;

    }

    // -----------------------------
    // Empty Password
    // -----------------------------

    if(passwordValue === ""){

        errorMessage.innerText = "Please enter your password.";
        return;

    }

    // -----------------------------
    // Password Length
    // -----------------------------

    if(passwordValue.length < 8){

        errorMessage.innerText = "Password must be at least 8 characters.";
        return;

    }

    // -----------------------------
    // Save User
    // -----------------------------

    localStorage.setItem("userEmail", emailValue);

    // Success

    alert("Login Successful 🚀");

    // Dashboard Open

    window.location.href = "dashboard.html";

});



