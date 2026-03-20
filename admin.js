import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { 
    getDatabase, ref, onValue 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

import { 
    getAuth, signInWithEmailAndPassword,
    onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "YOUR_KEY",
    authDomain: "YOUR_DOMAIN",
    databaseURL: "YOUR_DB_URL",
    projectId: "YOUR_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// DOM
const loginContainer = document.getElementById("loginContainer");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("adminLoginForm");
const logoutBtn = document.getElementById("logoutBtn");

// LOGIN
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
    )
    .then(() => alert("Login success"))
    .catch(err => alert(err.message));
});

// AUTH STATE
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginContainer.style.display = "none";
        dashboard.style.display = "block";
        loadRequests();
    } else {
        loginContainer.style.display = "block";
        dashboard.style.display = "none";
    }
});

// LOAD DATA
function loadRequests() {
    const table = document.getElementById("usersTableBody");
    const refData = ref(db, "pendingApprovals");

    onValue(refData, (snapshot) => {
        const data = snapshot.val();

        table.innerHTML = "";

        if (!data) return;

        Object.entries(data).forEach(([id, req]) => {
            table.innerHTML += `
                <tr>
                    <td>${req.firstName || ''}</td>
                    <td>${req.email}</td>
                    <td>${req.status || 'pending'}</td>
                    <td>${new Date(req.requestedAt || Date.now()).toLocaleString()}</td>
                    <td>
                        <button onclick="approveUser('${id}')">Approve</button>
                    </td>
                </tr>
            `;
        });
    });
}

// ✅ THIS WAS MISSING — REQUIRED
window.approveUser = function(id) {
    console.log("Approve:", id);
};

// LOGOUT
logoutBtn.addEventListener("click", () => {
    signOut(auth);
});
