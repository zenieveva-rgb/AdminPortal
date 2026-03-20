import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    onValue 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

import { 
    getAuth, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";


// ============================================
// FIREBASE CONFIG
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyBdlEvDlQ1qWr8xdL4bV25NW4RgcTajYqM",
    authDomain: "database-98a70.firebaseapp.com",
    databaseURL: "https://database-98a70-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "database-98a70",
    storageBucket: "database-98a70.appspot.com",
    messagingSenderId: "460345885965",
    appId: "1:460345885965:web:8484da766b979a0eaf9c44"
};

// ============================================
// INIT FIREBASE
// ============================================
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    loginContainer: document.getElementById('loginContainer'),
    dashboard: document.getElementById('dashboard'),
    loginForm: document.getElementById('adminLoginForm'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    logoutBtn: document.getElementById('logoutBtn'),
    adminName: document.getElementById('adminName')
};

// ============================================
// UI
// ============================================
function showLogin() {
    elements.loginContainer.style.display = 'flex';
    elements.dashboard.style.display = 'none';
}

function showDashboard() {
    elements.loginContainer.style.display = 'none';
    elements.dashboard.style.display = 'flex';
}

// ============================================
// TOAST
// ============================================
function showToast(msg) {
    alert(msg);
}

// ============================================
// LOGIN (FIREBASE)
// ============================================
function handleLogin(e) {
    e.preventDefault();

    const email = elements.emailInput.value;
    const password = elements.passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Logged in:", userCredential.user);
            showToast("Login successful");
        })
        .catch((error) => {
            console.error(error);
            showToast("Login failed: " + error.message);
        });
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    signOut(auth).then(() => {
        showToast("Logged out");
    });
}

// ============================================
// LOAD REQUESTS (REALTIME)
// ============================================
function loadRequests() {
    const requestsRef = ref(db, "pendingApprovals");

    onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        console.log("DATA:", data);

        const table = document.getElementById("usersTableBody");
        table.innerHTML = "";

        if (!data) {
            table.innerHTML = "<tr><td colspan='5'>No requests found</td></tr>";
            return;
        }

        Object.entries(data).forEach(([id, req]) => {
            table.innerHTML += `
                <tr>
                    <td>${req.name || "N/A"}</td>
                    <td>${req.email || "N/A"}</td>
                    <td>${req.status || "pending"}</td>
                    <td>${req.timestamp ? new Date(req.timestamp).toLocaleString() : ""}</td>
                    <td>
                        <button onclick="approve('${id}')">Approve</button>
                    </td>
                </tr>
            `;
        });
    });
}

// ============================================
// AUTH STATE LISTENER (IMPORTANT)
// ============================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User authenticated:", user.email);

        elements.adminName.textContent = user.email;

        showDashboard();
        loadRequests(); // 🔥 AUTO LOAD DATA
    } else {
        showLogin();
    }
});

// ============================================
// INIT
// ============================================
function init() {
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.logoutBtn.addEventListener('click', logout);
}

document.addEventListener('DOMContentLoaded', init);
