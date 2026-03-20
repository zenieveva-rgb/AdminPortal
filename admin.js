import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    set,
    remove,
    get,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

console.log("JS loaded");

/* 🔹 Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyBdlEvDlQ1qWr8xdL4bV25NW4RgcTajYqM",
  authDomain: "database-98a70.firebaseapp.com",
  databaseURL: "https://database-98a70-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "database-98a70",
  storageBucket: "database-98a70.appspot.com", // ✅ comma added
  messagingSenderId: "460345885965",
  appId: "1:460345885965:web:890fb3653f670101af9c44"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
window.db = db;
const auth = getAuth(app);

/* 🔹 DOM */
const loginContainer = document.getElementById("loginContainer");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("adminLoginForm");
const logoutBtn = document.getElementById("logoutBtn");

const email = document.getElementById("email");
const password = document.getElementById("password");

/* 🔹 LOGIN */
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const userCred = await signInWithEmailAndPassword(auth, email.value, password.value);
        const uid = userCred.user.uid;

        // 🔐 Check if admin
        const snap = await get(ref(db, `users/${uid}`));
        if (!snap.exists() || snap.val().role !== "admin") {
            alert("Access denied: Not an admin");
            await signOut(auth);
            return;
        }

        // ✅ Show dashboard
        loginContainer.classList.add("hidden");
        dashboard.classList.remove("hidden");

        loadRequests();

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        alert(err.message);
    }
});
/* 🔹 AUTH STATE */
onAuthStateChanged(auth, (user) => {
    if (!user) {
        loginContainer.classList.remove("hidden");
        dashboard.classList.add("hidden");
    }
});

/* 🔹 LOAD REQUESTS */
function loadRequests() {
    const table = document.getElementById("usersTableBody");

    onValue(ref(db, "pendingApprovals"), (snapshot) => {
        table.innerHTML = "";

        snapshot.forEach((child) => {
            const data = child.val();

            table.innerHTML += `
                <tr>
                    <td>${data.email}</td>
                    <td>${data.status}</td>
                    <td>
                        <button class="approve-btn" onclick="approveUser('${child.key}', '${data.email}')">
                            Approve
                        </button>
                    </td>
                </tr>
            `;
        });
    });
}

/* 🔹 APPROVE USER */
window.approveUser = async function(requestId, userEmail) {
    try {
        console.log("Approving:", requestId, userEmail);

        const tempPassword = "Temp12345";

        // Create Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, userEmail, tempPassword);
        const uid = userCredential.user.uid;

        // Save to database
        await set(ref(db, `users/${uid}`), {
            email: userEmail,
            role: "user",
            createdAt: Date.now()
        });

        // Remove from pending
        await remove(ref(db, `pendingApprovals/${requestId}`));

        alert("User approved!");

    } catch (err) {
        console.error("Approval error:", err);
        alert(err.message);
    }
}; // ✅ THIS WAS MISSING
/* 🔹 LOGOUT */
logoutBtn.addEventListener("click", () => {
    signOut(auth);
});
