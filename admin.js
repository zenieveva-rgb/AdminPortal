// ============================================
// SECRETARYWEB ADMIN PORTAL
// Compatible with existing Firebase Rules
// Database: database-98a70 (Asia Southeast)
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
    push,
    child
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// ============================================
// YOUR FIREBASE CONFIG
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSy...", // Get from Firebase Console → Project Settings
    authDomain: "database-98a70.firebaseapp.com",
    databaseURL: "https://database-98a70-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "database-98a70",
    storageBucket: "database-98a70.appspot.com",
    messagingSenderId: "123456789", // Get from Console
    appId: "1:123456789:web:abc123" // Get from Console
};

// ============================================
// SUPER ADMIN CONFIG
// ============================================
const SUPER_ADMIN_EMAIL = 'depeddcp11@gmail.com';

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
setPersistence(auth, browserLocalPersistence);

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
    todayScans: document.getElementById('todayScans'),
    
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
// STATE
// ============================================
let currentUser = null;
let isSuperAdmin = false;
let usersData = {};
let attendanceData = {};
let scansData = {};
let currentFilter = 'all';
let currentTab = 'users';
let confirmCallback = null;

// ============================================
// AUTHENTICATION
// ============================================

onAuthStateChanged(auth, async (user) => {
    console.log('Auth state:', user ? user.email : 'null');
    
    if (user) {
        // Check if super admin or regular admin
        isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;
        
        if (isSuperAdmin) {
            // Super admin - auto access
            currentUser = user;
            setupAdminUI('Super Admin');
            showDashboard();
            loadAllData();
        } else {
            // Check if regular admin in database
            const adminRef = ref(db, `admins/${user.uid}`);
            const snapshot = await get(adminRef);
            
            if (snapshot.exists()) {
                currentUser = user;
                setupAdminUI('Admin');
                showDashboard();
                loadAllData();
            } else {
                await signOut(auth);
                showToast('Access denied. Not authorized.', 'error');
                showLogin();
            }
        }
    } else {
        currentUser = null;
        isSuperAdmin = false;
        showLogin();
    }
});

function setupAdminUI(role) {
    elements.adminName.textContent = currentUser.email.split('@')[0];
    elements.adminRole.textContent = role;
    
    // Show/hide super admin features
    if (!isSuperAdmin) {
        // Regular admins can't manage other admins
        document.querySelectorAll('.super-admin-only').forEach(el => el.style.display = 'none');
    }
}

// Login
elements.loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = elements.emailInput.value.trim();
    const password = elements.passwordInput.value;
    
    if (!email || !password) {
        showToast('Please enter email and password', 'warning');
        return;
    }
    
    setLoading(true);
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showToast('Welcome back!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showToast(getErrorMessage(error.code), 'error');
    } finally {
        setLoading(false);
    }
});

// Toggle password
elements.togglePassword?.addEventListener('click', () => {
    const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
    elements.passwordInput.type = type;
    elements.togglePassword.innerHTML = type === 'password' 
        ? '<i class="fa-solid fa-eye"></i>' 
        : '<i class="fa-solid fa-eye-slash"></i>';
});

// Logout
elements.logoutBtn?.addEventListener('click', async () => {
    try {
        await signOut(auth);
        showToast('Logged out successfully', 'success');
    } catch (error) {
        showToast('Error logging out', 'error');
    }
});

// ============================================
// DATA LOADING
// ============================================

function loadAllData() {
    loadUsers();
    loadAttendance();
    loadScans();
}

function loadUsers() {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
        usersData = snapshot.val() || {};
        if (currentTab === 'users') renderUsers();
        updateStats();
    }, (error) => {
        console.error('Users load error:', error);
        showToast('Failed to load users', 'error');
    });
}

function loadAttendance() {
    const attendanceRef = ref(db, 'attendance');
    onValue(attendanceRef, (snapshot) => {
        attendanceData = snapshot.val() || {};
        if (currentTab === 'attendance') renderAttendance();
        updateTodayScans();
    });
}

function loadScans() {
    const scansRef = ref(db, 'scans');
    onValue(scansRef, (snapshot) => {
        scansData = snapshot.val() || {};
        if (currentTab === 'scans') renderScans();
    });
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderUsers() {
    const searchTerm = elements.searchUsers?.value.toLowerCase() || '';
    let html = '';
    let count = 0;
    
    // Sort by creation date (newest first)
    const sortedUsers = Object.entries(usersData).sort((a, b) => {
        return (b[1].createdAt || 0) - (a[1].createdAt || 0);
    });
    
    sortedUsers.forEach(([uid, user]) => {
        // Apply filter
        if (currentFilter !== 'all' && user.status !== currentFilter) return;
        
        // Apply search
        const searchStr = `${user.name || ''} ${user.email || ''} ${uid}`.toLowerCase();
        if (searchTerm && !searchStr.includes(searchTerm)) return;
        
        count++;
        const status = user.status || 'pending';
        const created = user.createdAt ? formatDate(user.createdAt) : 'N/A';
        const lastLogin = user.lastLogin ? formatDate(user.lastLogin) : 'Never';
        
        // Action buttons based on status
        let actions = '';
        if (status === 'pending') {
            actions = `
                <button class="action-btn approve" onclick="approveUser('${uid}')" title="Approve">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button class="action-btn block" onclick="blockUser('${uid}')" title="Block">
                    <i class="fa-solid fa-ban"></i>
                </button>
            `;
        } else if (status === 'approved') {
            actions = `
                <button class="action-btn block" onclick="blockUser('${uid}')" title="Block">
                    <i class="fa-solid fa-ban"></i>
                </button>
            `;
        } else if (status === 'blocked') {
            actions = `
                <button class="action-btn unblock" onclick="unblockUser('${uid}')" title="Unblock">
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
                <td><span class="status-badge status-${status}">${status}</span></td>
                <td>${created}</td>
                <td>${lastLogin}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view" onclick="viewUser('${uid}')" title="View Details">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ${actions}
                        <button class="action-btn delete" onclick="confirmDeleteUser('${uid}')" title="Delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    elements.usersTableBody.innerHTML = html;
    elements.emptyState.style.display = count === 0 ? 'block' : 'none';
}

function renderAttendance() {
    let html = '';
    let count = 0;
    
    // Sort by time (newest first)
    const sorted = Object.entries(attendanceData).sort((a, b) => {
        return (b[1].time || 0) - (a[1].time || 0);
    });
    
    sorted.forEach(([id, record]) => {
        count++;
        const time = record.time ? new Date(record.time).toLocaleString() : 'N/A';
        
        html += `
            <tr>
                <td>${record.studentName || 'Unknown'}</td>
                <td>${record.grade || 'N/A'}</td>
                <td>${record.section || 'N/A'}</td>
                <td>${time}</td>
                <td>${record.scannedBy || 'System'}</td>
            </tr>
        `;
    });
    
    elements.attendanceTableBody.innerHTML = html || '<tr><td colspan="5" class="empty-cell">No attendance records</td></tr>';
}

function renderScans() {
    let html = '';
    
    // Sort by timestamp
    const sorted = Object.entries(scansData).sort((a, b) => {
        return (b[1].timestamp || 0) - (a[1].timestamp || 0);
    }).slice(0, 100); // Last 100 scans
    
    sorted.forEach(([id, scan]) => {
        const time = scan.timestamp ? formatDate(scan.timestamp) : 'N/A';
        
        html += `
            <tr>
                <td>${scan.studentId || 'N/A'}</td>
                <td>${scan.studentName || 'Unknown'}</td>
                <td>${scan.type || 'Check-in'}</td>
                <td>${time}</td>
                <td><span class="status-badge status-${scan.status || 'success'}">${scan.status || 'success'}</span></td>
            </tr>
        `;
    });
    
    elements.scansTableBody.innerHTML = html || '<tr><td colspan="5" class="empty-cell">No scan records</td></tr>';
}

function updateStats() {
    const users = Object.values(usersData);
    elements.pendingCount.textContent = users.filter(u => u.status === 'pending').length;
    elements.approvedCount.textContent = users.filter(u => u.status === 'approved').length;
    elements.blockedCount.textContent = users.filter(u => u.status === 'blocked').length;
    elements.totalCount.textContent = users.length;
}

function updateTodayScans() {
    const today = new Date().toDateString();
    const todayCount = Object.values(attendanceData).filter(record => {
        return record.time && new Date(record.time).toDateString() === today;
    }).length;
    
    if (elements.todayScans) elements.todayScans.textContent = todayCount;
}

// ============================================
// USER ACTIONS
// ============================================

window.approveUser = async (uid) => {
    try {
        await update(ref(db, `users/${uid}`), {
            status: 'approved',
            approvedAt: serverTimestamp(),
            approvedBy: currentUser.uid
        });
        showToast('User approved successfully', 'success');
    } catch (error) {
        console.error('Approve error:', error);
        showToast('Failed to approve user', 'error');
    }
};

window.blockUser = async (uid) => {
    try {
        await update(ref(db, `users/${uid}`), {
            status: 'blocked',
            blockedAt: serverTimestamp(),
            blockedBy: currentUser.uid
        });
        showToast('User blocked', 'warning');
    } catch (error) {
        showToast('Failed to block user', 'error');
    }
};

window.unblockUser = async (uid) => {
    try {
        await update(ref(db, `users/${uid}`), {
            status: 'pending',
            unblockedAt: serverTimestamp(),
            unblockedBy: currentUser.uid
        });
        showToast('User unblocked - status set to pending', 'success');
    } catch (error) {
        showToast('Failed to unblock user', 'error');
    }
};

window.viewUser = (uid) => {
    const user = usersData[uid];
    if (!user) return;
    
    const details = `
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
                <span class="detail-label">Email</span>
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
                <span class="detail-value">${user.createdAt ? formatDate(user.createdAt, true) : 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Last Login</span>
                <span class="detail-value">${user.lastLogin ? formatDate(user.lastLogin, true) : 'Never'}</span>
            </div>
            ${user.approvedAt ? `
                <div class="detail-item">
                    <span class="detail-label">Approved On</span>
                    <span class="detail-value">${formatDate(user.approvedAt, true)}</span>
                </div>
            ` : ''}
            ${user.blockedAt ? `
                <div class="detail-item">
                    <span class="detail-label">Blocked On</span>
                    <span class="detail-value">${formatDate(user.blockedAt, true)}</span>
                </div>
            ` : ''}
        </div>
    `;
    
    elements.modalBody.innerHTML = details;
    showModal(elements.userModal);
};

window.confirmDeleteUser = (uid) => {
    const user = usersData[uid];
    elements.confirmTitle.textContent = 'Delete User?';
    elements.confirmMessage.textContent = `Permanently delete ${user.name || user.email || 'this user'}? This cannot be undone.`;
    
    confirmCallback = async () => {
        try {
            await remove(ref(db, `users/${uid}`));
            showToast('User deleted permanently', 'success');
            hideModal(elements.confirmModal);
        } catch (error) {
            showToast('Failed to delete user', 'error');
        }
    };
    
    showModal(elements.confirmModal);
};

// ============================================
// SUPER ADMIN FUNCTIONS
// ============================================

window.addAdmin = async (email) => {
    if (!isSuperAdmin) {
        showToast('Super admin only', 'error');
        return;
    }
    
    // Find user by email
    const userEntry = Object.entries(usersData).find(([uid, user]) => user.email === email);
    if (!userEntry) {
        showToast('User not found', 'error');
        return;
    }
    
    const [uid, user] = userEntry;
    
    try {
        await set(ref(db, `admins/${uid}`), {
            email: user.email,
            addedBy: currentUser.uid,
            addedAt: serverTimestamp(),
            role: 'admin'
        });
        showToast(`${email} is now an admin`, 'success');
    } catch (error) {
        showToast('Failed to add admin', 'error');
    }
};

window.removeAdmin = async (uid) => {
    if (!isSuperAdmin) return;
    
    try {
        await remove(ref(db, `admins/${uid}`));
        showToast('Admin removed', 'success');
    } catch (error) {
        showToast('Failed to remove admin', 'error');
    }
};

// ============================================
// UI HELPERS
// ============================================

function showLogin() {
    elements.loginContainer.style.display = 'flex';
    elements.dashboard.style.display = 'none';
}

function showDashboard() {
    elements.loginContainer.style.display = 'none';
    elements.dashboard.style.display = 'flex';
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

function formatDate(timestamp, includeTime = false) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    if (includeTime) {
        return date.toLocaleString();
    }
    return date.toLocaleDateString();
}

// ============================================
// EVENT LISTENERS
// ============================================

// Tab switching
elements.tabButtons?.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentTab = btn.dataset.tab;
        
        // Hide all sections
        elements.usersSection.style.display = 'none';
        elements.attendanceSection.style.display = 'none';
        elements.scansSection.style.display = 'none';
        
        // Show active section
        if (currentTab === 'users') {
            elements.usersSection.style.display = 'block';
            renderUsers();
        } else if (currentTab === 'attendance') {
            elements.attendanceSection.style.display = 'block';
            renderAttendance();
        } else if (currentTab === 'scans') {
            elements.scansSection.style.display = 'block';
            renderScans();
        }
    });
});

// Filter tabs
elements.filterTabs?.forEach(tab => {
    tab.addEventListener('click', () => {
        elements.filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderUsers();
    });
});

// Search
elements.searchUsers?.addEventListener('input', () => {
    renderUsers();
});

// Refresh
elements.refreshBtn?.addEventListener('click', () => {
    elements.refreshBtn.classList.add('spinning');
    loadAllData();
    setTimeout(() => elements.refreshBtn.classList.remove('spinning'), 1000);
    showToast('Data refreshed', 'success');
});

// Mobile menu
elements.menuToggle?.addEventListener('click', () => {
    elements.sidebar?.classList.toggle('active');
});

// Modal controls
elements.closeModal?.addEventListener('click', () => hideModal(elements.userModal));
elements.confirmCancel?.addEventListener('click', () => hideModal(elements.confirmModal));
elements.confirmAction?.addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
});

// Close on outside click
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
    
    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function getErrorMessage(code) {
    const errors = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'Account disabled',
        'auth/user-not-found': 'No account found',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/too-many-requests': 'Too many attempts. Try later',
        'auth/network-request-failed': 'Network error'
    };
    return errors[code] || 'An error occurred. Please try again';
}

// ============================================
// INIT
// ============================================

console.log('✅ SecretaryWeb Admin Portal loaded');
console.log('Database:', firebaseConfig.databaseURL);
console.log('Super Admin:', SUPER_ADMIN_EMAIL);

// Check for missing elements
const critical = ['loginContainer', 'dashboard', 'loginForm', 'usersTableBody'];
const missing = critical.filter(id => !document.getElementById(id));
if (missing.length > 0) {
    console.error('Missing elements:', missing);
}
