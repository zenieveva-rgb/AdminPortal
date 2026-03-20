import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    query, 
    where, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc,
    onSnapshot,
    orderBy,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration - Admin Portal
const firebaseConfig = {
    apiKey: "AIzaSyAdmnUvsdq-2wR1l11l5Yp0Qtn_m1E7RPM",
    authDomain: "secretaryweb-admin.firebaseapp.com",
    projectId: "secretaryweb-admin",
    storageBucket: "secretaryweb-admin.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global Variables
let currentAdmin = null;
let usersUnsubscribe = null;

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const usersTableBody = document.getElementById('usersTableBody');
const totalUsersEl = document.getElementById('totalUsers');
const pendingUsersEl = document.getElementById('pendingUsers');
const approvedUsersEl = document.getElementById('approvedUsers');
const blockedUsersEl = document.getElementById('blockedUsers');
const toastContainer = document.getElementById('toastContainer');

// Initialize
function init() {
    checkAuthState();
    setupEventListeners();
    createParticles();
}

// Check Authentication State
function checkAuthState() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Check if user is admin
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            if (adminDoc.exists()) {
                currentAdmin = user;
                showDashboard();
                startUsersListener();
            } else {
                await signOut(auth);
                showToast('Access Denied: Not an admin', 'error');
            }
        } else {
            showLogin();
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.classList.add('spinning');
            setTimeout(() => refreshBtn.classList.remove('spinning'), 1000);
            loadUsers();
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterUsers, 300));
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', filterUsers);
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('.submit-btn');
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    submitBtn.disabled = true;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
        
        if (!adminDoc.exists()) {
            await signOut(auth);
            throw new Error('Not authorized as admin');
        }
        
        showToast('Welcome back, Admin!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
        submitBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
        submitBtn.disabled = false;
    }
}

// Handle Logout
async function handleLogout() {
    try {
        await signOut(auth);
        if (usersUnsubscribe) {
            usersUnsubscribe();
        }
        showToast('Logged out successfully', 'success');
    } catch (error) {
        showToast('Error logging out', 'error');
    }
}

// Show/Hide Views
function showLogin() {
    loginContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
}

function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    document.getElementById('adminEmail').textContent = currentAdmin.email;
    animateCounters();
}

// Real-time Users Listener
function startUsersListener() {
    const usersQuery = query(
        collection(db, 'secretaryweb_users'),
        orderBy('createdAt', 'desc')
    );
    
    usersUnsubscribe = onSnapshot(usersQuery, (snapshot) => {
        const users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        window.allUsers = users;
        renderUsers(users);
        updateStats(users);
    }, (error) => {
        console.error('Listener error:', error);
        showToast('Error loading users', 'error');
    });
}

// Render Users Table
function renderUsers(users) {
    if (users.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No users found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    usersTableBody.innerHTML = users.map(user => `
        <tr data-user-id="${user.id}" class="status-${user.status || 'pending'}">
            <td>
                <div class="user-info">
                    <div class="user-avatar">${user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}</div>
                    <div class="user-details">
                        <div class="user-name">${user.fullName || 'Unknown'}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>
            </td>
            <td><span class="badge badge-${user.role || 'user'}">${user.role || 'User'}</span></td>
            <td><span class="status-badge status-${user.status || 'pending'}">${user.status || 'Pending'}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td>${user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
            <td>
                <div class="action-btns">
                    ${getActionButtons(user)}
                </div>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', handleUserAction);
    });
}

// Get Action Buttons based on user status
function getActionButtons(user) {
    const buttons = [];
    
    if (user.status === 'pending') {
        buttons.push(`
            <button class="action-btn approve" data-action="approve" data-user-id="${user.id}" title="Approve User">
                <i class="fas fa-check"></i>
            </button>
            <button class="action-btn reject" data-action="reject" data-user-id="${user.id}" title="Reject User">
                <i class="fas fa-times"></i>
            </button>
        `);
    } else if (user.status === 'approved') {
        buttons.push(`
            <button class="action-btn block" data-action="block" data-user-id="${user.id}" title="Block User">
                <i class="fas fa-ban"></i>
            </button>
        `);
    } else if (user.status === 'blocked') {
        buttons.push(`
            <button class="action-btn unblock" data-action="unblock" data-user-id="${user.id}" title="Unblock User">
                <i class="fas fa-unlock"></i>
            </button>
        `);
    }
    
    buttons.push(`
        <button class="action-btn delete" data-action="delete" data-user-id="${user.id}" title="Delete User">
            <i class="fas fa-trash"></i>
        </button>
    `);
    
    return buttons.join('');
}

// Handle User Actions
async function handleUserAction(e) {
    const btn = e.currentTarget;
    const action = btn.dataset.action;
    const userId = btn.dataset.userId;
    
    btn.classList.add('loading');
    
    try {
        const userRef = doc(db, 'secretaryweb_users', userId);
        
        switch(action) {
            case 'approve':
                await updateDoc(userRef, {
                    status: 'approved',
                    approvedAt: new Date().toISOString(),
                    approvedBy: currentAdmin.uid
                });
                showToast('User approved successfully', 'success');
                break;
                
            case 'reject':
                await updateDoc(userRef, {
                    status: 'rejected',
                    rejectedAt: new Date().toISOString(),
                    rejectedBy: currentAdmin.uid
                });
                showToast('User rejected', 'success');
                break;
                
            case 'block':
                await updateDoc(userRef, {
                    status: 'blocked',
                    blockedAt: new Date().toISOString(),
                    blockedBy: currentAdmin.uid
                });
                showToast('User blocked', 'success');
                break;
                
            case 'unblock':
                await updateDoc(userRef, {
                    status: 'approved',
                    unblockedAt: new Date().toISOString(),
                    unblockedBy: currentAdmin.uid
                });
                showToast('User unblocked', 'success');
                break;
                
            case 'delete':
                if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                    await deleteDoc(userRef);
                    showToast('User deleted', 'success');
                }
                break;
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        btn.classList.remove('loading');
    }
}

// Filter Users
function filterUsers() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterStatus = filterSelect.value;
    
    let filtered = window.allUsers || [];
    
    if (searchTerm) {
        filtered = filtered.filter(user => 
            (user.fullName && user.fullName.toLowerCase().includes(searchTerm)) ||
            (user.email && user.email.toLowerCase().includes(searchTerm))
        );
    }
    
    if (filterStatus !== 'all') {
        filtered = filtered.filter(user => user.status === filterStatus);
    }
    
    renderUsers(filtered);
}

// Update Statistics
function updateStats(users) {
    const total = users.length;
    const pending = users.filter(u => u.status === 'pending').length;
    const approved = users.filter(u => u.status === 'approved').length;
    const blocked = users.filter(u => u.status === 'blocked').length;
    
    animateValue(totalUsersEl, parseInt(totalUsersEl.textContent), total, 1000);
    animateValue(pendingUsersEl, parseInt(pendingUsersEl.textContent), pending, 1000);
    animateValue(approvedUsersEl, parseInt(approvedUsersEl.textContent), approved, 1000);
    animateValue(blockedUsersEl, parseInt(blockedUsersEl.textContent), blocked, 1000);
}

// Utility Functions
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Animation Functions
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    counters.forEach(counter => {
        counter.style.opacity = '0';
        counter.style.transform = 'translateY(20px)';
        setTimeout(() => {
            counter.style.transition = 'all 0.6s ease';
            counter.style.opacity = '1';
            counter.style.transform = 'translateY(0)';
        }, 100);
    });
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime > 0 ? stepTime : 10);
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Particle Animation
function createParticles() {
    const particles = document.getElementById('particles');
    if (!particles) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particles.appendChild(particle);
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', init);

// Create initial admin (run this once in console)
window.createInitialAdmin = async function(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'admins', userCredential.user.uid), {
            email: email,
            role: 'superadmin',
            createdAt: new Date().toISOString()
        });
        console.log('Admin created:', userCredential.user.uid);
    } catch (error) {
        console.error('Error:', error);
    }
};
