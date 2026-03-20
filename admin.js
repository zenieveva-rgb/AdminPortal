import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config (update your actual config here)
const firebaseConfig = {
    apiKey: "AIzaSyAdmnUvsdq-2wR1l11l5Yp0Qtn_m1E7RPM",
    authDomain: "secretaryweb-admin.firebaseapp.com",
    projectId: "secretaryweb-admin",
    storageBucket: "secretaryweb-admin.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById('adminLoginForm');
const loginBtn = document.getElementById('loginBtn');
const togglePassBtn = document.getElementById('togglePass');

let currentAdmin = null;
let usersUnsubscribe = null;

// Initialize
function init() {
    checkAuthState();
    setupEventListeners();
    createParticles(); // optional, for particle background
}

// Setup event listeners
function setupEventListeners() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (togglePassBtn) {
        togglePassBtn.addEventListener('click', togglePassword);
    }
    // Add logout button event if exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = document.querySelector('#togglePass i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Check auth state
function checkAuthState() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Verify admin role
            const adminRef = doc(db, 'admins', user.uid);
            const adminSnap = await getDoc(adminRef);
            if (adminSnap.exists()) {
                currentAdmin = user;
                showDashboard();
                startUsersListener(); // your existing function
            } else {
                await signOut(auth);
                showLogin();
                showToast('Access Denied: Not an admin', 'error');
            }
        } else {
            showLogin();
        }
    });
}

// Show login view
function showLogin() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

// Show dashboard view
function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    // Update email display if needed
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    loginBtn.disabled = true;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const adminRef = doc(db, 'admins', userCredential.user.uid);
        const adminSnap = await getDoc(adminRef);
        if (!adminSnap.exists()) {
            await signOut(auth);
            throw new Error('Not authorized as admin');
        }
        showToast('Welcome back, Admin!', 'success');
        showDashboard();
        startUsersListener();
    } catch (err) {
        showToast(err.message, 'error');
        loginBtn.innerHTML = '<span class="btn-text">Secure Login</span><span class="btn-loader"><i class="fa-solid fa-circle-notch fa-spin"></i></span>';
        loginBtn.disabled = false;
    }
}

// Handle logout
async function handleLogout() {
    try {
        await signOut(auth);
        if (usersUnsubscribe) usersUnsubscribe();
        showToast('Logged out successfully', 'success');
        showLogin();
    } catch (err) {
        showToast('Error logging out', 'error');
    }
}

// Utility: show toast
function showToast(message, type='info') {
    // your existing toast code
    // Make sure to include your existing showToast implementation here
}

// You can keep your existing startUsersListener() and other functions

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', init);
