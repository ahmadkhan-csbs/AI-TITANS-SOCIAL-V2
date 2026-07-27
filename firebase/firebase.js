import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAJuRnHkvTY9TDDYZlMgJ3ZyatOS5wyvyQ",
    authDomain: "ai-titans-social.firebaseapp.com",
    projectId: "ai-titans-social",
    storageBucket: "ai-titans-social.firebasestorage.app",
    messagingSenderId: "321974672162",
    appId: "1:321974672162:web:f75691fc14962e3b13e37b"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export {
    auth,
    db,
    provider
};