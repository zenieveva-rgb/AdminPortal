import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

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
// ADMIN LOGIN (TEMP ONLY)
// ============================================
const ADMIN_CREDENTIALS = {
    email: "developer@admin.com",
    password: "developer1245"
};

// ============================================
// INIT FIREBASE
// ============================================
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    loginContainer: document.getElementById('loginContainer'),
    dashboard: document.getElementById('dashboard'),
    loginForm: document.getElementById('adminLoginForm'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    loginBtn: document.getElementById('loginBtn'),
    togglePassword: document.getElementById('togglePassword'),
    logoutBtn: document.getElementById('logoutBtn'),
    adminName: document.getElementById('adminName')
};

// ============================================
// GLOBAL STATE
// ============================================
let isAuthenticated = false;
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

// ============================================
// TOAST (SIMPLE)
// ============================================
function showToast(message, type = "info") {
    alert(message); // Replace with custom UI if needed
}

// ============================================
// SHOW/HIDE UI
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
// SESSION HANDLING
// ============================================
function startSessionTimer() {
    setTimeout(() => {
        logout();
        showToast("Session expired");
    }, SESSION_TIMEOUT);
}

function checkAuth() {
    const session = localStorage.getItem('admin_session');

    if (!session) return false;

    try {
        const data = JSON.parse(session);

        if (Date.now() < data.expiry) {
            isAuthenticated = true;
            elements.adminName.textContent = data.username;
            showDashboard();
            startSessionTimer();
            return true;
        } else {
            localStorage.removeItem('admin_session');
        }
    } catch (e) {
        localStorage.removeItem('admin_session');
    }

    return false;
}

// ============================================
// LOGIN
// ============================================
function handleLogin(e) {
    e.preventDefault();

    const email = elements.emailInput.value.trim();
    const password = elements.passwordInput.value;

    if (!email || !password) {
        showToast("Enter credentials");
        return;
    }

    setLoginLoading(true);

    setTimeout(() => {
        if (
            email === ADMIN_CREDENTIALS.email &&
            password === ADMIN_CREDENTIALS.password
        ) {
            const session = {
                username: "Developer Admin",
                expiry: Date.now() + SESSION_TIMEOUT
            };

            localStorage.setItem('admin_session', JSON.stringify(session));

            isAuthenticated = true;
            elements.adminName.textContent = "Developer Admin";

            showDashboard();
            startSessionTimer();

            showToast("Login successful");

            elements.emailInput.value = "";
            elements.passwordInput.value = "";
        } else {
            showToast("Invalid credentials");
        }

        setLoginLoading(false);
    }, 500);
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    localStorage.removeItem('admin_session');
    isAuthenticated = false;
    showLogin();
    showToast("Logged out");
}

// ============================================
// BUTTON LOADING
// ============================================
function setLoginLoading(loading) {
    if (!elements.loginBtn) return;

    elements.loginBtn.disabled = loading;
    elements.loginBtn.textContent = loading ? "Logging in..." : "Login";
}

// ============================================
// PASSWORD TOGGLE
// ============================================
function setupPasswordToggle() {
    elements.togglePassword.addEventListener('click', () => {
        const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
        elements.passwordInput.type = type;
    });
}

// ============================================
// INIT
// ============================================
function init() {
    console.log("Admin system ready");

    // Login submit
    elements.loginForm.addEventListener('submit', handleLogin);

    // Logout
    elements.logoutBtn.addEventListener('click', logout);

    // Password toggle
    setupPasswordToggle();

    // Check session
    if (!checkAuth()) {
        showLogin();
    }
}

// ============================================
// START
// ============================================
document.addEventListener('DOMContentLoaded', init);
