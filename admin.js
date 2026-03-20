import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    onValue, 
    get, 
    set, 
    update,
    remove,
    serverTimestamp,
    push,
    child
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// ============================================
// YOUR FIREBASE CONFIG
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyBdlEvDlQ1qWr8xdL4bV25NW4RgcTajYqM",
    authDomain: "database-98a70.firebaseapp.com",
    databaseURL: "https://database-98a70-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "database-98a70",
    storageBucket: "database-98a70.firebasestorage.app",
    messagingSenderId: "460345885965",
    appId: "1:460345885965:web:8484da766b979a0eaf9c44"
};

// ============================================
// BUILT-IN ADMIN CREDENTIALS
// ============================================
const ADMIN_CREDENTIALS = {
    email: "developer@admin.com",
    password: "developer1245"
};

// ============================================
// INITIALIZE FIREBASE
// ============================================
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    loginContainer: document.getElementById('loginContainer'),
    dashboard: document.getElementById('dashboard'),
    sidebar: document.getElementById('sidebar'),
    loginForm: document.getElementById('adminLoginForm'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    loginBtn: document.getElementById('loginBtn'),
    togglePassword: document.getElementById('togglePassword'),
    adminName: document.getElementById('adminName'),
    adminRole: document.getElementById('adminRole'),
    logoutBtn: document.getElementById('logoutBtn'),
    menuToggle: document.getElementById('menuToggle'),
    refreshBtn: document.getElementById('refreshBtn'),
    
    // Stats
    pendingCount: document.getElementById('pendingCount'),
    approvedCount: document.getElementById('approvedCount'),
    blockedCount: document.getElementById('blockedCount'),
    totalCount: document.getElementById('totalCount'),
    
    // Tables
    usersTableBody: document.getElementById('usersTableBody'),
    attendanceTableBody: document.getElementById('attendanceTableBody'),
    scansTableBody: document.getElementById('scansTableBody'),
    emptyState: document.getElementById('emptyState'),
    
    // Search & Filter
    searchUsers: document.getElementById('searchUsers'),
    filterTabs: document.querySelectorAll('.filter-tab'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    
    // Sections
    usersSection: document.getElementById('usersSection'),
    attendanceSection: document.getElementById('attendanceSection'),
    scansSection: document.getElementById('scansSection'),
    
    // Modals
    userModal: document.getElementById('userModal'),
    confirmModal: document.getElementById('confirmModal'),
    closeModal: document.getElementById('closeModal'),
    modalBody: document.getElementById('modalBody'),
    confirmTitle: document.getElementById('confirmTitle'),
    confirmMessage: document.getElementById('confirmMessage'),
    confirmCancel: document.getElementById('confirmCancel'),
    confirmAction: document.getElementById('confirmAction'),
    
    // Toast
    toastContainer: document.getElementById('toastContainer')
};

// ============================================
// GLOBAL VARIABLES
// ============================================
let isAuthenticated = false;
let sessionExpiry = null;
let usersData = {};
let attendanceData = {};
let scansData = {};
let currentFilter = 'all';
let currentTab = 'users';
let confirmCallback = null;
let currentUser = { uid: 'admin' }; // For tracking who performed actions

// Session timeout (8 hours)
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================
function checkAuth() {
    const session = localStorage.getItem('admin_session');
    if (session) {
        try {
            const { expiry, username } = JSON.parse(session);
            if (Date.now() < expiry) {
                isAuthenticated = true;
                setupAdminUI(username);
                showDashboard();
                loadAllData();
                startSessionTimer();
                return true;
            } else {
                localStorage.removeItem('admin_session');
                showToast('Session expired. Please login again.', 'warning');
            }
        } catch (error) {
            console.error('Session error:', error);
            localStorage.removeItem('admin_session');
        }
    }
    return false;
}

function setupLogin() {
    // Toggle password visibility
    elements.togglePassword?.addEventListener('click', () => {
        const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
        elements.passwordInput.type = type;
        elements.togglePassword.innerHTML = type === 'password' 
            ? '<i class="fa-solid fa-eye"></i>' 
            : '<i class="fa-solid fa-eye-slash"></i>';
    });
    
    // Login form submission
    elements.loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = elements.emailInput.value.trim();
        const password = elements.passwordInput.value;
        
        if (!email || !password) {
            showToast('Please enter credentials', 'warning');
            return;
        }
        
        // Show loading state
        const btnText = elements.loginBtn.querySelector('.btn-text');
        const btnLoader = elements.loginBtn.querySelector('.btn-loader');
        if (btnText && btnLoader) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
        }
        elements.loginBtn.disabled = true;
        
        // Simple hardcoded login
        setTimeout(() => {
            if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                // Set session
                const session = {
                    email: ADMIN_CREDENTIALS.email,
                    username: "Developer Admin",
                    expiry: Date.now() + SESSION_TIMEOUT
                };
                localStorage.setItem('admin_session', JSON.stringify(session));
                
                isAuthenticated = true;
                setupAdminUI("Developer Admin");
                showDashboard();
                loadAllData();
                startSessionTimer();
                showToast('Welcome, Developer Admin!', '
