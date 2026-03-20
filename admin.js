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

console.log("JS loaded");

/* 🔹 Firebase Config */
const firebaseConfig = {
    apiKey: "AIzaSyBdlEvDlQ1qWr8xdL4bV25NW4RgcTajYqM",
    authDomain: "database-98a70.firebaseapp.com",
    databaseURL: "https://database-98a70-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "database-98a70",
    storageBucket: "database-98a70.appspot.com", // FIXED
    messagingSenderId: "460345885965",
    appId: "1:460345885965:web:890fb3653f670101af9c44"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
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
        loginContainer.classList.add("hidden");
        dashboard.classList.remove("hidden");
        loadRequests();
    } else {
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
window.approveUser = async function(id, email) {
    try {
        let uid;

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                "Temp12345"
            );
            uid = userCredential.user.uid;

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert("User already exists.");
            } else {
                throw error;
            }
        }

        if (uid) {
            await set(ref(db, "users/" + uid), {
                email,
                role: "secretary",
                status: "approved"
            });
        }

        await remove(ref(db, "pendingApprovals/" + id));

        alert("User approved!");

    } catch (error) {
        alert(error.message);
    }
};

/* 🔹 LOGOUT */
logoutBtn.addEventListener("click", () => {
    signOut(auth);
});
