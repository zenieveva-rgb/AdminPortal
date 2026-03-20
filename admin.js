import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    onValue 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

import { 
    getAuth, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
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

// INIT
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ============================================
// DOM
// ============================================
const loginContainer = document.getElementById("loginContainer");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const logoutBtn = document.getElementById("logoutBtn");

// ============================================
// LOGIN
// ============================================
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Login successful");
        })
        .catch((error) => {
            alert("Login failed: " + error.message);
        });
});

// ============================================
// AUTH STATE
// ============================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        showDashboard();
        loadRequests();
    } else {
        showLogin();
    }
});

// ============================================
// LOAD REQUESTS (THIS IS THE IMPORTANT PART)
// ============================================
function loadRequests() {
    const requestsRef = ref(db, "pendingApprovals");

    onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        const table = document.getElementById("usersTableBody");

        table.innerHTML = "";

        if (!data) {
            table.innerHTML = "<tr><td colspan='5'>No requests found</td></tr>";
            return;
        }

        Object.entries(data).forEach(([id, req]) => {
            table.innerHTML += `
                <tr>
                    <td>${req.firstName || ''} ${req.lastName || ''}</td>
                    <td>${req.email}</td>
                    <td>${req.status}</td>
                    <td>${new Date(req.requestedAt).toLocaleString()}</td>
                    <td>
                        <button onclick="approveUser('${id}')">Approve</button>
                    </td>
                </tr>
            `;
        });
    });
}

// ============================================
// LOGOUT
// ============================================
logoutBtn.addEventListener("click", () => {
    signOut(auth);
});

// ============================================
// UI
// ============================================
function showDashboard() {
    loginContainer.style.display = "none";
    dashboard.style.display = "flex";
}

function showLogin() {
    loginContainer.style.display = "flex";
    dashboard.style.display = "none";
}
