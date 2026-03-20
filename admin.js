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

// 🔥 Firebase config
const firebaseConfig = {
    apiKey: "YOUR_KEY",
    authDomain: "YOUR_DOMAIN",
    databaseURL: "YOUR_DB_URL",
    projectId: "YOUR_ID"
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
