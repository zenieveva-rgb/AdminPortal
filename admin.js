import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { 
    getDatabase, ref, onValue, set, remove 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

import { 
    getAuth, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const db = getDatabase();

const tableBody = document.getElementById("usersTableBody");

onValue(ref(db, "pendingApprovals"), (snapshot) => {
    tableBody.innerHTML = "";

    snapshot.forEach((child) => {
        const user = child.val();

        const row = `
            <tr>
                <td>${user.firstName}</td>
                <td>${user.email}</td>
                <td>${user.status}</td>
            </tr>
        `;

        tableBody.innerHTML += row;
    });
});
const firebaseConfig = {
    apiKey: "YOUR_KEY", // ❌ replace this
    authDomain: "database-98a70.firebaseapp.com",
    databaseURL: "https://database-98a70-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "database-98a70",
    storageBucket: "database-98a70.appspot.com",
    messagingSenderId: "460345885965",
    appId: "1:460345885965:web:8484da766b9790eaf9c44"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// 🔹 DOM
const loginContainer = document.getElementById("loginContainer");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("adminLoginForm");
const logoutBtn = document.getElementById("logoutBtn");

// 🔹 LOGIN
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email.value, password.value)
        .then(() => alert("Login success"))
        .catch(err => alert(err.message));
});

// 🔹 AUTH STATE
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

// 🔹 LOAD REQUESTS
function loadRequests() {
    const table = document.getElementById("usersTableBody");
    const refData = ref(db, "pendingApprovals");

    onValue(refData, (snapshot) => {
        const data = snapshot.val();

        table.innerHTML = "";

        if (!data) {
            table.innerHTML = "<tr><td>No requests</td></tr>";
            return;
        }

        Object.entries(data).forEach(([id, req]) => {
            table.innerHTML += `
                <tr>
                    <td>${req.email}</td>
                    <td>${req.status}</td>
                    <td>
                        <button onclick="approveUser('${id}', '${req.email}')">
                            Approve
                        </button>
                    </td>
                </tr>
            `;
        });
    });
}

// 🔹 APPROVE USER (IMPORTANT)
window.approveUser = async function(id, email) {
    try {
        const password = "Temp12345";

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        await set(ref(db, "users/" + uid), {
            email,
            role: "secretary",
            status: "approved"
        });

        await remove(ref(db, "pendingApprovals/" + id));

        alert("User approved!");
    } catch (error) {
        alert(error.message);
    }
};

// 🔹 LOGOUT
logoutBtn.addEventListener("click", () => {
    signOut(auth);
});
console.log("Admin JS loaded");
