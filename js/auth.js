import {
    auth,
    provider
} from "../firebase/firebase.js";

import {
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    sendPasswordResetEmail,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// =====================================
// Elements
// =====================================

const form = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const errorMessage = document.getElementById("errorMessage");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");
const forgotBtn = document.getElementById("forgotPassword");
const googleBtn = document.getElementById("googleBtn");


// =====================================
// Login
// =====================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    errorMessage.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (email === "" || password === "") {

        errorMessage.textContent =
        "Please fill all fields.";

        return;

    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = "Logging in...";

    try {

        const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        // Latest Firebase data
        await user.reload();

        if (!auth.currentUser.emailVerified) {

            await sendEmailVerification(auth.currentUser);

            errorMessage.textContent =
            "Please verify your email first. Verification email has been sent again.";

            await signOut(auth);

            loginBtn.disabled = false;
            loginBtn.innerHTML = "Login";

            return;

        }

        alert(`Welcome ${user.displayName || "User"} 🎉`);

        window.location.href = "dashboard.html";

    }

    catch (error) {

        switch (error.code) {

            case "auth/invalid-credential":
                errorMessage.textContent =
                "Invalid email or password.";
                break;

            case "auth/user-not-found":
                errorMessage.textContent =
                "Account not found.";
                break;

            case "auth/wrong-password":
                errorMessage.textContent =
                "Wrong password.";
                break;

            case "auth/invalid-email":
                errorMessage.textContent =
                "Invalid email format.";
                break;

            case "auth/too-many-requests":
                errorMessage.textContent =
                "Too many attempts. Please try again later.";
                break;

            default:
                errorMessage.textContent =
                error.message;

        }

    }

    loginBtn.disabled = false;
    loginBtn.innerHTML = "Login";

});


// =====================================
// Show / Hide Password
// =====================================

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    }

    else {

        passwordInput.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});


// =====================================
// Forgot Password
// =====================================

forgotBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    const email = emailInput.value.trim();

    if (email === "") {

        alert("Please enter your email first.");

        return;

    }

    try {

        await sendPasswordResetEmail(auth, email);

        alert("Password reset link has been sent to your email.");

    }

    catch (error) {

        switch (error.code) {

            case "auth/user-not-found":
                alert("No account found with this email.");
                break;

            case "auth/invalid-email":
                alert("Please enter a valid email.");
                break;

            default:
                alert(error.message);

        }

    }

});


// =====================================
// Google Login
// =====================================

googleBtn.addEventListener("click", async () => {

    errorMessage.textContent = "";

    googleBtn.disabled = true;

    googleBtn.innerHTML = `
        <i class="fa-brands fa-google"></i>
        Signing in...
    `;

    try {

        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        alert(`Welcome ${user.displayName} 🎉`);

        window.location.href = "dashboard.html";

    }

    catch (error) {

        console.log(error);

        switch (error.code) {

            case "auth/popup-closed-by-user":

                errorMessage.textContent =
                "Google sign in cancelled.";

                break;

            default:

                errorMessage.textContent =
                error.message;

        }

    }

    googleBtn.disabled = false;

    googleBtn.innerHTML = `
        <i class="fa-brands fa-google"></i>
        Continue with Google
    `;

});