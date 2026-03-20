// ============================================
// SECRETARYWEB ADMIN PORTAL - COMPLETE SYSTEM
// Firebase 9.17.1 Compatible
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { 
    getDatabase, 
    ref, 
    onValue, 
    get, 
    set, 
    update,
    remove,
    serverTimestamp,
    query,
    orderByChild
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// ============================================
// CONFIGURATION - REPLACE WITH YOUR FIREBASE CONFIG
// ============================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ============================================
// INITIALIZE FIREBASE
// ============================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Set persistence to local (stay logged in)
setPersistence(auth, browserLocalPersistence);

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    // Containers
    loginContainer: document.getElementById('loginContainer'),
    dashboard: document.getElementById('dashboard'),
    sidebar: document.getElementById('sidebar'),
    
    // Login form
    loginForm: document.getElementById('adminLoginForm'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    loginBtn: document.getElementById('loginBtn'),
    togglePassword: document.getElementById('togglePassword'),
    
    // Dashboard
    adminName: document.getElementById('adminName'),
    logoutBtn: document.getElementById('logoutBtn'),
    menuToggle: document.getElementById('menuToggle'),
    refreshBtn: document.getElementById('refreshBtn'),
    
    // Stats
    pendingCount: document.getElementById('pendingCount'),
    approvedCount: document.getElementById('approvedCount'),
    blockedCount: document.getElementById('blockedCount'),
    totalCount: document.getElementById('totalCount'),
    
    // Table
    usersTableBody: document.getElementById('usersTableBody'),
    emptyState: document.getElementById('emptyState'),
    searchUsers: document.getElementById('searchUsers'),
    filterTabs: document.querySelectorAll('.filter-tab'),
    
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
// STATE MANAGEMENT
// ============================================
let currentUser = null;
let usersData = {};
let currentFilter = 'all';
let confirmCallback = null;

// ============================================
// AUTHENTICATION
// ============================================

// Auth State Listener
onAuthStateChanged(auth, async (user) => {
    console.log('Auth state changed:', user ? user.email : 'null');
    
    if (user) {
        // Verify admin status
        const isAdmin = await checkAdminStatus(user);
        
        if (isAdmin) {
            currentUser = user;
            elements.adminName.textContent = user.email.split('@')[0];
            showDashboard();
            loadUsers();
        } else {
            await signOut(auth);
            showToast('Access denied. Admin privileges required.', 'error');
            showLogin();
        }
    } else {
        currentUser = null;
        showLogin();
    }
});

// Check if user is admin
async function checkAdminStatus(user) {
    try {
        // Check if user email is in admin list or has admin role in database
        const adminRef = ref(db, `admins/${user.uid}`);
        const snapshot = await get(adminRef);
        
        if (snapshot.exists()) {
            return true;
        }
        
        // Alternative: Check by email domain or specific email
        const adminEmails = ['admin@secretaryweb.com', 'superadmin@secretaryweb.com']; // Add your admin emails
        if (adminEmails.includes(user.email)) {
            // Auto-add to admins node for future
            await set(adminRef, {
                email: user.email,
                addedAt: serverTimestamp(),
                role: 'admin'
            });
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Login Form Handler
if (elements.loginForm) {
    elements.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = elements.emailInput.value.trim();
        const password = elements.passwordInput.value;
        
        if (!email || !password) {
            showToast('Please enter both email and password', 'warning');
            return;
        }
        
        setLoading(true);
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            showToast('Login successful!', 'success');
        } catch (error) {
            console.error('Login error:', error);
            showToast(getErrorMessage(error.code), 'error');
        } finally {
            setLoading(false);
        }
    });
}

// Toggle Password Visibility
if (elements.togglePassword) {
    elements.togglePassword.addEventListener('click', () => {
        const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
        elements.passwordInput.type = type;
        
        elements.togglePassword.innerHTML = type === 'password' 
            ? '<i class="fa-solid fa-eye"></i>' 
            : '<i class="fa-solid fa-eye-slash"></i>';
    });
}

// Logout Handler
if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            showToast('Logged out successfully', 'success');
        } catch (error) {
            showToast('Logout failed', 'error');
        }
    });
}

// ============================================
// USER MANAGEMENT
// ============================================

// Load all users
function loadUsers() {
    const usersRef = ref(db, 'users');
    
    onValue(usersRef, (snapshot) => {
        usersData = snapshot.val() || {};
        renderUsers();
        updateStats();
    }, (error) => {
        console.error('Error loading users:', error);
        showToast('Failed to load users', 'error');
    });
}

// Render users table
function renderUsers() {
    const searchTerm = elements.searchUsers.value.toLowerCase();
    let html = '';
    let visibleCount = 0;
    
    const sortedUsers = Object.entries(usersData).sort((a, b) => {
        // Sort by creation date (newest first)
        return (b[1].createdAt || 0) - (a[1].createdAt || 0);
    });
    
    sortedUsers.forEach(([uid, user]) => {
        // Apply filters
        if (currentFilter !== 'all' && user.status !== currentFilter) {
            return;
        }
        
        // Apply search
        const searchFields = [
            user.name || '',
            user.email || '',
            uid
        ].join(' ').toLowerCase();
        
        if (searchTerm && !searchFields.includes(searchTerm)) {
            return;
        }
        
        visibleCount++;
        
        const status = user.status || 'pending';
        const statusClass = `status-${status}`;
        const createdDate = user.createdAt 
            ? new Date(user.createdAt).toLocaleDateString() 
            : 'N/A';
        const lastLogin = user.lastLogin 
            ? new Date(user.lastLogin).toLocaleDateString() 
            : 'Never';
        
        // Determine action buttons based on status
        let actionButtons = '';
        
        if (status === 'pending') {
            actionButtons = `
                <button class="action-btn approve" onclick="approveUser('${uid}')" title="Approve User">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button class="action-btn block" onclick="blockUser('${uid}')" title="Block User">
                    <i class="fa-solid fa-ban"></i>
                </button>
            `;
        } else if (status === 'approved') {
            actionButtons = `
                <button class="action-btn block" onclick="blockUser('${uid}')" title="Block User">
                    <i class="fa-solid fa-ban"></i>
                </button>
            `;
        } else if (status === 'blocked') {
            actionButtons = `
                <button class="action-btn unblock" onclick="unblockUser('${uid}')" title="Unblock User">
                    <i class="fa-solid fa-unlock"></i>
                </button>
            `;
        }
        
        html += `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-avatar">${(user.name || user.email || '?').charAt(0).toUpperCase()}</div>
                        <div class="user-info">
                            <span class="user-name">${user.name || 'Unknown'}</span>
                            <span class="user-id">${uid.substring(0, 8)}...</span>
                        </div>
                    </div>
                </td>
                <td>${user.email || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>${createdDate}</td>
                <td>${lastLogin}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view" onclick="viewUser('${uid}')" title="View Details">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ${actionButtons}
                        <button class="action-btn delete" onclick="confirmDeleteUser('${uid}')" title="Delete User">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    elements.usersTableBody.innerHTML = html || '';
    elements.emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
}

// Update statistics
function updateStats() {
    const users = Object.values(usersData);
    
    elements.pendingCount.textContent = users.filter(u => u.status === 'pending').length;
    elements.approvedCount.textContent = users.filter(u => u.status === 'approved').length;
    elements.blockedCount.textContent = users.filter(u => u.status === 'blocked').length;
    elements.totalCount.textContent = users.length;
}

// ============================================
// USER ACTIONS (Global functions for onclick)
// ============================================

window.approveUser = async function(uid) {
    try {
        await update(ref(db, `users/${uid}`), {
            status: 'approved',
            approvedAt: serverTimestamp(),
            approvedBy: currentUser.uid
        });
        showToast('User approved successfully', 'success');
    } catch (error) {
        console.error('Error approving user:', error);
        showToast('Failed to approve user', 'error');
    }
};

window.blockUser = async function(uid) {
    try {
        await update(ref(db, `users/${uid}`), {
            status: 'blocked',
            blockedAt: serverTimestamp(),
            blockedBy: currentUser.uid
        });
        showToast('User blocked', 'warning');
    } catch (error) {
        console.error('Error blocking user:', error);
        showToast('Failed to block user', 'error');
    }
};

window.unblockUser = async function(uid) {
    try {
        await update(ref(db, `users/${uid}`), {
            status: 'pending',
            unblockedAt: serverTimestamp(),
            unblockedBy: currentUser.uid
        });
        showToast('User unblocked. Status set to pending.', 'success');
    } catch (error) {
        console.error('Error unblocking user:', error);
        showToast('Failed to unblock user', 'error');
    }
};

window.viewUser = function(uid) {
    const user = usersData[uid];
    if (!user) return;
    
    const createdDate = user.createdAt 
        ? new Date(user.createdAt).toLocaleString() 
        : 'N/A';
    const lastLogin = user.lastLogin 
        ? new Date(user.lastLogin).toLocaleString() 
        : 'Never';
    
    elements.modalBody.innerHTML = `
        <div class="user-detail-grid">
            <div class="detail-item">
                <span class="detail-label">User ID</span>
                <span class="detail-value code">${uid}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Full Name</span>
                <span class="detail-value">${user.name || 'Not provided'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Email Address</span>
                <span class="detail-value">${user.email || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="detail-value">
                    <span class="status-badge status-${user.status || 'pending'}">${user.status || 'pending'}</span>
                </span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Account Created</span>
                <span class="detail-value">${createdDate}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Last Login</span>
                <span class="detail-value">${lastLogin}</span>
            </div>
            ${user.approvedAt ? `
                <div class="detail-item">
                    <span class="detail-label">Approved On</span>
                    <span class="detail-value">${new Date(user.approvedAt).toLocaleString()}</span>
                </div>
            ` : ''}
            ${user.blockedAt ? `
                <div class="detail-item">
                    <span class="detail-label">Blocked On</span>
                    <span class="detail-value">${new Date(user.blockedAt).toLocaleString()}</span>
                </div>
            ` : ''}
        </div>
    `;
    
    showModal(elements.userModal);
};

window.confirmDeleteUser = function(uid) {
    const user = usersData[uid];
    elements.confirmTitle.textContent = 'Delete User';
    elements.confirmMessage.textContent = `Are you sure you want to permanently delete ${user.name || user.email || 'this user'}? This action cannot be undone.`;
    
    confirmCallback = async () => {
        try {
            await remove(ref(db, `users/${uid}`));
            showToast('User deleted permanently', 'success');
            hideModal(elements.confirmModal);
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast('Failed to delete user', 'error');
        }
    };
    
    showModal(elements.confirmModal);
};

// ============================================
// UI HELPERS
// ============================================

function showLogin() {
    elements.loginContainer.style.display = 'flex';
    elements.dashboard.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showDashboard() {
    elements.loginContainer.style.display = 'none';
    elements.dashboard.style.display = 'flex';
    document.body.style.overflow = 'auto';
}

function setLoading(loading) {
    if (!elements.loginBtn) return;
    
    const btnText = elements.loginBtn.querySelector('.btn-text');
    const btnLoader = elements.loginBtn.querySelector('.btn-loader');
    
    elements.loginBtn.disabled = loading;
    
    if (btnText) btnText.style.display = loading ? 'none' : 'inline';
    if (btnLoader) btnLoader.style.display = loading ? 'inline' : 'none';
}

function showModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ============================================
// EVENT LISTENERS
// ============================================

// Filter tabs
elements.filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        elements.filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderUsers();
    });
});

// Search
if (elements.searchUsers) {
    elements.searchUsers.addEventListener('input', () => {
        renderUsers();
    });
}

// Refresh button
if (elements.refreshBtn) {
    elements.refreshBtn.addEventListener('click', () => {
        elements.refreshBtn.classList.add('spinning');
        loadUsers();
        setTimeout(() => {
            elements.refreshBtn.classList.remove('spinning');
            showToast('Data refreshed', 'success');
        }, 1000);
    });
}

// Mobile menu toggle
if (elements.menuToggle) {
    elements.menuToggle.addEventListener('click', () => {
        elements.sidebar.classList.toggle('active');
    });
}

// Modal close buttons
if (elements.closeModal) {
    elements.closeModal.addEventListener('click', () => hideModal(elements.userModal));
}

if (elements.confirmCancel) {
    elements.confirmCancel.addEventListener('click', () => hideModal(elements.confirmModal));
}

if (elements.confirmAction) {
    elements.confirmAction.addEventListener('click', () => {
        if (confirmCallback) confirmCallback();
    });
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === elements.userModal) hideModal(elements.userModal);
    if (e.target === elements.confirmModal) hideModal(elements.confirmModal);
});

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fa-solid ${icons[type]} toast-icon"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'toastSlide 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// ============================================
// ERROR HANDLING
// ============================================

function getErrorMessage(code) {
    const errors = {
        'auth/invalid-email': 'Invalid email address format',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later',
        'auth/network-request-failed': 'Network error. Check your connection',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/email-already-in-use': 'Email is already registered'
    };
    
    return errors[code] || 'An error occurred. Please try again';
}

// Global error handler
window.onerror = function(msg, url, line, col, error) {
    console.error('Global error:', { msg, url, line, col, error });
    return false;
};

// ============================================
// INITIALIZATION
// ============================================

console.log('✅ Admin Portal loaded successfully');
console.log('Firebase version: 9.17.1');

// Check if all critical elements exist
const criticalElements = ['loginContainer', 'dashboard', 'loginForm', 'usersTableBody'];
const missing = criticalElements.filter(id => !document.getElementById(id));

if (missing.length > 0) {
    console.error('Missing critical elements:', missing);
}
