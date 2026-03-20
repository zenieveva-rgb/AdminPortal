import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
window.ref = ref;
window.get = get;
import {
    getDatabase,
    ref,
    onValue,
    set,
    remove,
    get, // ✅ MISSING
    serverTimestamp // ✅ MISSING
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
    e.preventDefault(); // stops refresh

    try {
        console.log("Logging in...");

        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        alert("Login successful");

    } catch (err) {
        alert(err.message);
    }
});

/* 🔹 AUTH STATE */
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Admin UID logged in:", user.uid);
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

        // ✅ Create Auth user FIRST
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, tempPassword);
const uid = userCredential.user.uid;

const requestRef = ref(db, `pendingApprovals/${requestId}`);
const snapshot = await get(requestRef);

await set(ref(db, `users/${uid}`), { ... });
await remove(requestRef);
    } catch (err) {
        console.error("Approval error:", err);
        alert(err.message);
    }
};
/* 🔹 LOGOUT */
logoutBtn.addEventListener("click", () => {
    signOut(auth);
});
