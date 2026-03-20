import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getDatabase, 
    ref, 
    onValue, 
    get, 
    set, 
    update,
    serverTimestamp,
    remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ==================== FIREBASE CONFIG ====================
const firebaseConfig = {
    apiKey: "AIzaSyBdlEvDlQ1qWr8xdL4bV25NW4RgcTajYqM",
    authDomain: "database-98a70.firebaseapp.com",
    databaseURL: "https://database-98a70-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "database-98a70",
    storageBucket: "database-98a70.firebasestorage.app",
    messagingSenderId: "460345885965",
    appId: "1:460345885965:web:8484da766b979a0eaf9c44"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ==================== STATE ====================
let currentAdmin = null;
let usersListener = null;
let pendingListener = null;
let scansListener = null;

// ==================== DOM ELEMENTS ====================
const elements = {
    loginContainer: document.getElementById('loginContainer'),
    dashboard: document.getElementById('dashboard'),
    loginForm: document.getElementById('adminLoginForm'),
    loginBtn: document.getElementById('loginBtn'),
    togglePass: document.getElementById('togglePass'),
    logoutBtn: document.getElementById('adminLogout'),
    refreshBtn: document.getElementById('refreshData'),
    notifBtn: document.getElementById('notifBtn'),
    pendingBadge: document.getElementById('approvalBadge'),
    notifBadge: document.getElementById('notifBadge'),
    pendingCount: document.getElementById('pendingCount'),
    approvedCount: document.getElementById('approvedCount'),
    blockedCount: document.getElementById('blockedCount'),
    totalCount: document.getElementById('totalCount'),
    pendingUsers: document.getElementById('pendingUsers'),
    allUsersTable: document.getElementById('allUsersTable'),
    adminScansList: document.getElementById('adminScansList'),
    searchUsers: document.getElementById('searchUsers'),
    scanDateFilter: document.getElementById('scanDateFilter'),
    scannerFilter: document.getElementById('scannerFilter'),
    userModal: document.getElementById('userModal'),
    closeUserModal: document.getElementById('closeUserModal'),
    userModalBody: document.getElementById('userModalBody'),
    userModalFooter: document.getElementById('userModalFooter'),
    toastContainer: document.getElementById('toastContainer'),
    pageTitle: document.getElementById('pageTitle')
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupEventListeners();
    checkAuthState();
    
    // Set today's date for scan filter
    if (elements.scanDateFilter) {
        elements.scanDateFilter.valueAsDate = new Date();
    }
});

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    container.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        container.appendChild(particle);
    }
}

function setupEventListeners() {
    elements.loginForm?.addEventListener('submit', handleLogin);
    elements.togglePass?.addEventListener('click', togglePassword);
    elements.logoutBtn?.addEventListener('click', handleLogout);
    
    elements.refreshBtn?.addEventListener('click', () => {
        elements.refreshBtn?.classList.add('spinning');
        refreshAllData();
        setTimeout(() => elements.refreshBtn?.classList.remove('spinning'), 1000);
    });
    
    elements.searchUsers?.addEventListener('input', (e) => filterUsers(e.target.value));
    elements.closeUserModal?.addEventListener('click', closeModal);
    elements.scanDateFilter?.addEventListener('change', loadScans);
    elements.scannerFilter?.addEventListener('change', loadScans);
    
    // Tab navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            switchTab(tab);
            
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Close modal on outside click
    elements.userModal?.addEventListener('click', (e) => {
        if (e.target === elements.userModal) closeModal();
    });
    
    // Notifications button
    elements.notifBtn?.addEventListener('click', () => {
        showToast('Notifications feature coming soon', 'info');
    });
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = elements.togglePass?.querySelector('i');
    
    if (!passwordInput || !icon) return;
    
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

// ==================== AUTHENTICATION ====================
function checkAuthState() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Check if this user is the designated admin
            if (user.email === 'depeddcp11@gmail.com') {
                currentAdmin = user;
                
                // Ensure admin record exists
                const adminRef = ref(db, `admins/${user.uid}`);
                const snapshot = await get(adminRef);
                
                if (!snapshot.exists()) {
                    await set(adminRef, {
                        email: user.email,
                        role: 'superadmin',
                        createdAt: serverTimestamp()
                    });
                }
                
                showDashboard();
                startListeners();
                showToast(`Welcome back, ${user.email}`, 'success');
            } else {
                // Not the authorized admin email
                await signOut(auth);
                showToast('Access Denied: Unauthorized email address', 'error');
                showLogin();
            }
        } else {
            showLogin();
        }
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
        showToast('Please enter email and password', 'error');
        return;
    }

    setLoading(elements.loginBtn, true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Verify admin email
        if (userCredential.user.email !== 'depeddcp11@gmail.com') {
            await signOut(auth);
            throw new Error('This email is not authorized for admin access');
        }
        
        // Success - dashboard will show via auth state listener
        
    } catch (err) {
        console.error('Login error:', err);
        let message = 'Login failed';
        
        if (err.code === 'auth/user-not-found') message = 'No account found with this email';
        else if (err.code === 'auth/wrong-password') message = 'Incorrect password';
        else if (err.code === 'auth/invalid-email') message = 'Invalid email address';
        else message = err.message;
        
        showToast(message, 'error');
        setLoading(elements.loginBtn, false);
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
        stopListeners();
        showToast('Logged out successfully', 'success');
        showLogin();
    } catch (err) {
        showToast('Error logging out', 'error');
    }
}

function showLogin() {
    if (elements.loginContainer) elements.loginContainer.style.display = 'flex';
    if (elements.dashboard) elements.dashboard.style.display = 'none';
    setLoading(elements.loginBtn, false);
}

function showDashboard() {
    if (elements.loginContainer) elements.loginContainer.style.display = 'none';
    if (elements.dashboard) {
        elements.dashboard.style.display = 'flex';
        elements.dashboard.style.flexDirection = 'row';
    }
}

// ==================== DATA LISTENERS ====================
function startListeners() {
    // Listen for pending approvals
    const pendingRef = ref(db, 'pendingApprovals');
    pendingListener = onValue(pendingRef, (snapshot) => {
        const count = snapshot.exists() ? Object.keys(snapshot.val() || {}).length : 0;
        if (elements.pendingBadge) elements.pendingBadge.textContent = count;
        if (elements.pendingCount) elements.pendingCount.textContent = count;
        renderPendingUsers(snapshot);
    });
    
    // Listen for all users
    loadUsers();
    
    // Load scans for today
    loadScans();
    
    // Load scanner list for filter
    loadScannerFilter();
}

function stopListeners() {
    if (usersListener) usersListener();
    if (pendingListener) pendingListener();
    if (scansListener) scansListener();
}

function refreshAllData() {
    loadUsers();
    loadScans();
    showToast('Data refreshed', 'success');
}

// ==================== USERS MANAGEMENT ====================
function loadUsers() {
    const usersRef = ref(db, 'users');
    usersListener = onValue(usersRef, (snapshot) => {
        let approved = 0;
        let blocked = 0;
        let total = 0;
        const users = [];
        
        if (snapshot.exists()) {
            snapshot.forEach((child) => {
                const user = { id: child.key, ...child.val() };
                users.push(user);
                total++;
                
                if (user.status === 'approved') approved++;
                if (user.status === 'blocked') blocked++;
            });
        }
        
        if (elements.approvedCount) elements.approvedCount.textContent = approved;
        if (elements.blockedCount) elements.blockedCount.textContent = blocked;
        if (elements.totalCount) elements.totalCount.textContent = total;
        
        renderAllUsers(users);
        updateScannerFilter(users);
    });
}

function renderPendingUsers(snapshot) {
    const container = elements.pendingUsers;
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!snapshot || !snapshot.exists()) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>No pending approvals</p>
                <span>All caught up!</span>
            </div>
        `;
        return;
    }
    
    const data = snapshot.val();
    Object.entries(data).forEach(([uid, user]) => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <div class="user-card-header">
                <div class="user-avatar">${(user.firstName || '?')[0]}${(user.lastName || '')[0]}</div>
                <div class="user-info">
                    <h4>${user.firstName || 'Unknown'} ${user.lastName || ''}</h4>
                    <span>${user.email || 'No email'}</span>
                </div>
            </div>
            <div class="user-details">
                <div class="detail-row">
                    <span>Department</span>
                    <span>${user.department || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span>Employee ID</span>
                    <span>${user.employeeId || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span>Requested</span>
                    <span>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </div>
            </div>
            <div class="user-actions">
                <button class="btn-approve" onclick="approveUser('${uid}')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-reject" onclick="rejectUser('${uid}')">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderAllUsers(users) {
    const tbody = elements.allUsersTable;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-table">No users found</td></tr>';
        return;
    }
    
    // Sort by created date, newest first
    users.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="user-info">
                    <div class="user-avatar" style="width:40px;height:40px;font-size:1rem;">
                        ${(user.firstName || '?')[0]}${(user.lastName || '')[0]}
                    </div>
                    <div>
                        <div style="font-weight:600;">${user.firstName || 'Unknown'} ${user.lastName || ''}</div>
                        <div style="font-size:0.85rem;color:var(--admin-text-muted);">${user.email || 'No email'}</div>
                    </div>
                </div>
            </td>
            <td>${user.department || 'N/A'}</td>
            <td><span class="status-badge ${user.status || 'pending'}">${user.status || 'pending'}</span></td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</td>
            <td>
                <div class="action-btns">
                    ${user.status === 'pending' ? `
                        <button class="action-btn approve" onclick="approveUser('${user.id}')" title="Approve">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    ${user.status === 'approved' ? `
                        <button class="action-btn block" onclick="blockUser('${user.id}')" title="Block">
                            <i class="fas fa-ban"></i>
                        </button>
                    ` : ''}
                    ${user.status === 'blocked' ? `
                        <button class="action-btn unblock" onclick="unblockUser('${user.id}')" title="Unblock">
                            <i class="fas fa-unlock"></i>
                        </button>
                    ` : ''}
                    <button class="action-btn view" onclick="viewUser('${user.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==================== USER ACTIONS ====================
window.approveUser = async function(userId) {
    try {
        const updates = {};
        const now = Date.now();
        
        // Update user status
        updates[`users/${userId}/status`] = 'approved';
        updates[`users/${userId}/approvedAt`] = now;
        updates[`users/${userId}/approvedBy`] = currentAdmin.uid;
        
        // Remove from pending
        updates[`pendingApprovals/${userId}`] = null;
        
        // Mark notification as read
        updates[`adminNotifications/${userId}/read`] = true;
        updates[`adminNotifications/${userId}/approvedAt`] = now;
        
        await update(ref(db), updates);
        showToast('User approved successfully', 'success');
        
    } catch (err) {
        console.error('Approve error:', err);
        showToast('Failed to approve user: ' + err.message, 'error');
    }
};

window.rejectUser = async function(userId) {
    if (!confirm('Are you sure you want to reject this user? They will need to sign up again.')) return;
    
    try {
        const updates = {};
        updates[`users/${userId}/status`] = 'rejected';
        updates[`users/${userId}/rejectedAt`] = Date.now();
        updates[`users/${userId}/rejectedBy`] = currentAdmin.uid;
        updates[`pendingApprovals/${userId}`] = null;
        
        await update(ref(db), updates);
        showToast('User rejected', 'info');
        
    } catch (err) {
        showToast('Failed to reject user: ' + err.message, 'error');
    }
};

window.blockUser = async function(userId) {
    if (!confirm('Block this user? They will not be able to scan until unblocked.')) return;
    
    try {
        await update(ref(db, `users/${userId}`), {
            status: 'blocked',
            blockedAt: Date.now(),
            blockedBy: currentAdmin.uid
        });
        showToast('User blocked', 'success');
    } catch (err) {
        showToast('Failed to block user: ' + err.message, 'error');
    }
};

window.unblockUser = async function(userId) {
    try {
        await update(ref(db, `users/${userId}`), {
            status: 'approved',
            unblockedAt: Date.now(),
            unblockedBy: currentAdmin.uid
        });
        showToast('User unblocked', 'success');
    } catch (err) {
        showToast('Failed to unblock user: ' + err.message, 'error');
    }
};

window.viewUser = async function(userId) {
    try {
        const snapshot = await get(ref(db, `users/${userId}`));
        if (!snapshot.exists()) {
            showToast('User not found', 'error');
            return;
        }
        
        const user = snapshot.val();
        
        elements.userModalBody.innerHTML = `
            <div class="user-detail-view">
                <div class="detail-section">
                    <h4>Personal Information</h4>
                    <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Department:</strong> ${user.department || 'N/A'}</p>
                    <p><strong>Employee ID:</strong> ${user.employeeId || 'N/A'}</p>
                </div>
                <div class="detail-section">
                    <h4>Account Status</h4>
                    <p><strong>Status:</strong> <span class="status-badge ${user.status}">${user.status}</span></p>
                    <p><strong>Role:</strong> ${user.role || 'scanner'}</p>
                    <p><strong>Joined:</strong> ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unknown'}</p>
                    ${user.approvedAt ? `<p><strong>Approved:</strong> ${new Date(user.approvedAt).toLocaleString()}</p>` : ''}
                    ${user.lastLogin ? `<p><strong>Last Login:</strong> ${new Date(user.lastLogin).toLocaleString()}</p>` : ''}
                </div>
            </div>
        `;
        
        elements.userModalFooter.innerHTML = `
            ${user.status === 'pending' ? `
                <button class="btn-approve" onclick="approveUser('${userId}'); closeModal();">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-reject" onclick="rejectUser('${userId}'); closeModal();">
                    <i class="fas fa-times"></i> Reject
                </button>
            ` : ''}
            ${user.status === 'approved' ? `
                <button class="btn-reject" onclick="blockUser('${userId}'); closeModal();">
                    <i class="fas fa-ban"></i> Block
                </button>
            ` : ''}
            ${user.status === 'blocked' ? `
                <button class="btn-approve" onclick="unblockUser('${userId}'); closeModal();">
                    <i class="fas fa-unlock"></i> Unblock
                </button>
            ` : ''}
            <button class="btn-secondary" onclick="closeModal()">Close</button>
        `;
        
        elements.userModal.classList.add('active');
        
    } catch (err) {
        showToast('Error loading user details', 'error');
    }
};

function closeModal() {
    elements.userModal?.classList.remove('active');
}

// ==================== SCANS / ATTENDANCE ====================
function loadScannerFilter() {
    // Populate scanner filter dropdown
    const select = elements.scannerFilter;
    if (!select) return;
    
    // Keep "All Scanners" option
    select.innerHTML = '<option value="">All Scanners</option>';
    
    // Users will be added when loadUsers runs
}

function updateScannerFilter(users) {
    const select = elements.scannerFilter;
    if (!select) return;
    
    const currentValue = select.value;
    const approvedUsers = users.filter(u => u.status === 'approved');
    
    select.innerHTML = '<option value="">All Scanners</option>';
    
    approvedUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.firstName} ${user.lastName} (${user.email})`;
        select.appendChild(option);
    });
    
    // Restore selection if still valid
    if (currentValue && approvedUsers.find(u => u.id === currentValue)) {
        select.value = currentValue;
    }
}

function loadScans() {
    const dateFilter = elements.scanDateFilter?.value;
    const scannerFilter = elements.scannerFilter?.value;
    
    const scansRef = ref(db, 'attendance');
    
    if (scansListener) scansListener();
    
    scansListener = onValue(scansRef, (snapshot) => {
        const container = elements.adminScansList;
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!snapshot.exists()) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-barcode"></i>
                    <p>No scan records found</p>
                </div>
            `;
            return;
        }
        
        const scans = [];
        snapshot.forEach((child) => {
            const scan = { id: child.key, ...child.val() };
            
            // Apply date filter
            if (dateFilter) {
                const scanDate = new Date(scan.time || scan.timestamp).toISOString().split('T')[0];
                if (scanDate !== dateFilter) return;
            }
            
            // Apply scanner filter
            if (scannerFilter && scan.scannedBy !== scannerFilter) return;
            
            scans.push(scan);
        });
        
        // Sort by time, newest first
        scans.sort((a, b) => new Date(b.time || b.timestamp) - new Date(a.time || a.timestamp));
        
        if (scans.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-filter"></i>
                    <p>No scans match your filters</p>
                </div>
            `;
            return;
        }
        
        scans.forEach(scan => {
            const item = document.createElement('div');
            item.className = 'scan-item';
            item.innerHTML = `
                <div class="scan-icon">
                    <i class="fas fa-qrcode"></i>
                </div>
                <div class="scan-details">
                    <div class="scan-student">${scan.studentName || 'Unknown Student'}</div>
                    <div class="scan-meta">
                        <span><i class="fas fa-graduation-cap"></i> ${scan.grade || 'N/A'}</span>
                        <span><i class="fas fa-clock"></i> ${new Date(scan.time || scan.timestamp).toLocaleTimeString()}</span>
                    </div>
                </div>
                <div class="scan-status success">
                    <i class="fas fa-check"></i>
                </div>
            `;
            container.appendChild(item);
        });
    });
}

// ==================== UTILITY FUNCTIONS ====================
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) targetTab.classList.add('active');
    
    const titles = {
        approvals: 'Pending Approvals',
        users: 'All Users',
        scans: 'Scan Activity',
        settings: 'Settings'
    };
    
    if (elements.pageTitle) {
        elements.pageTitle.textContent = titles[tabName] || 'Dashboard';
    }
    
    // Load data for specific tabs
    if (tabName === 'scans') {
        loadScans();
    }
}

function filterUsers(searchTerm) {
    const rows = elements.allUsersTable?.querySelectorAll('tr');
    if (!rows) return;
    
    const term = searchTerm.toLowerCase().trim();
    
    rows.forEach(row => {
        if (term === '') {
            row.style.display = '';
            return;
        }
        
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

function setLoading(btn, isLoading) {
    if (!btn) return;
    
    btn.disabled = isLoading;
    const text = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');
    
    if (text) text.style.opacity = isLoading ? '0' : '1';
    if (loader) loader.style.opacity = isLoading ? '1' : '0';
    
    if (isLoading) {
        btn.classList.add('loading');
    } else {
        btn.classList.remove('loading');
    }
}

function showToast(message, type = 'info') {
    const container = elements.toastContainer;
    if (!container) {
        console.log(`[${type}] ${message}`);
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
