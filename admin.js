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

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBdlEvDlQ1qWr8xdL4bV25NW4RgcTajYqM",
  authDomain: "database-98a70.firebaseapp.com",
  databaseURL: "https://database-98a70-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "database-98a70",
  storageBucket: "database-98a70.firebasestorage.app",
  messagingSenderId: "460345885965",
  appId: "1:460345885965:web:890fb3653f670101af9c44"
};

// 🔹 Initialize
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// 🔹 DOM
const loginContainer = document.getElementById("loginContainer");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("adminLoginForm");
const logoutBtn = document.getElementById("logoutBtn");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const tableBody = document.getElementById("usersTableBody");

// 🔹 LOGIN
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
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

// 🔹 LOAD PENDING USERS
function loadRequests() {
    const refData = ref(db, "pendingApprovals");

    onValue(refData, (snapshot) => {
        tableBody.innerHTML = "";

        const data = snapshot.val();

        if (!data) {
            tableBody.innerHTML = "<tr><td>No requests found</td></tr>";
            return;
        }

        Object.entries(data).forEach(([id, req]) => {
            tableBody.innerHTML += `
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

// 🔹 APPROVE USER
window.approveUser = async function(id, email) {
    try {
        const tempPassword = "Temp12345";

        const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
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

console.log("Admin JS fixed and running");
