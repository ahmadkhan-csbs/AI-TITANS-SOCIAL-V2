import { auth, db } from "../firebase/firebase.js";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {

    // Create Account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update Firebase Auth Profile
    await updateProfile(userCredential.user, {
      displayName: name
    });

    // Save User in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      name: name,
      email: email,
      photoURL: "",
      provider: "email",
      verified: false,
      createdAt: serverTimestamp()
    });

    // Send Verification Email
    await sendEmailVerification(userCredential.user);

    alert("🎉 Account Created Successfully!\n\nPlease verify your email before logging in.");

    window.location.href = "login.html";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});