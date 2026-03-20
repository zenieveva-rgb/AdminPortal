/* ============================================
   SECRETARYWEB ADMIN PORTAL - COMPLETE CSS
   ============================================ */

/* CSS Variables */
:root {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --secondary: #64748b;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --info: #06b6d4;
    
    --bg-dark: #0f172a;
    --bg-card: #1e293b;
    --bg-hover: #334155;
    --bg-light: #f1f5f9;
    
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    
    --border: #334155;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
    
    --radius: 8px;
    --radius-lg: 12px;
    --transition: all 0.3s ease;
}

/* Reset & Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: var(--bg-dark);
    color: var(--text-primary);
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
}

/* ============================================
   LOGIN STYLES
   ============================================ */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--bg-dark) 0%, #1e293b 100%);
    padding: 20px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
}

.login-card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    animation: slideUp 0.5s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-logo {
    text-align: center;
    margin-bottom: 32px;
}

.logo-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    font-size: 36px;
    color: white;
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.login-logo h1 {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.login-logo h1 span {
    color: var(--primary);
}

.login-logo p {
    color: var(--text-secondary);
    font-size: 14px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.input-group {
    position: relative;
    display: flex;
    align-items: center;
}

.input-group i {
    position: absolute;
    left: 16px;
    color: var(--text-muted);
    font-size: 16px;
}

.input-group input {
    width: 100%;
    padding: 14px 16px 14px 48px;
    background: var(--bg-dark);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-primary);
    font-size: 15px;
    transition: var(--transition);
}

.input-group input:focus {
    outline: none;
    border-color: var(--primary);
    background: var(--bg-card);
}

.input-group input::placeholder {
    color: var(--text-muted);
}

.toggle-password {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    font-size: 16px;
    transition: var(--transition);
}

.toggle-password:hover {
    color: var(--text-primary);
}

.login-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border: none;
    border-radius: var(--radius);
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    margin-top: 8px;
    position: relative;
    overflow: hidden;
}

.login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-loader {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.login-footer {
    text-align: center;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
}

.login-footer p {
    color: var(--text-muted);
    font-size: 13px;
}

/* ============================================
   DASHBOARD LAYOUT
   ============================================ */
.dashboard-container {
    display: flex;
    min-height: 100vh;
    background: var(--bg-dark);
}

/* Sidebar */
.sidebar {
    width: 280px;
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    z-index: 100;
    transition: var(--transition);
}

.sidebar-header {
    padding: 24px;
    border-bottom: 1px solid var(--border);
}

.sidebar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
}

.sidebar-logo i {
    color: var(--primary);
    font-size: 24px;
}

.sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: var(--radius);
    color: var(--text-secondary);
    text-decoration: none;
    transition: var(--transition);
    font-size: 15px;
}

.nav-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.nav-item.active {
    background: var(--primary);
    color: white;
}

.nav-item i {
    width: 20px;
    text-align: center;
}

.sidebar-footer {
    padding: 16px;
    border-top: 1px solid var(--border);
}

.admin-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    padding: 12px;
    background: var(--bg-dark);
    border-radius: var(--radius);
}

.admin-avatar {
    width: 40px;
    height: 40px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.admin-details {
    display: flex;
    flex-direction: column;
}

.admin-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 14px;
}

.admin-role {
    font-size: 12px;
    color: var(--text-muted);
}

.logout-btn {
    width: 100%;
    padding: 10px;
    background: transparent;
    border: 1px solid var(--danger);
    color: var(--danger);
    border-radius: var(--radius);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: var(--transition);
    font-size: 14px;
}

.logout-btn:hover {
    background: var(--danger);
    color: white;
}

/* Main Content */
.main-content {
    flex: 1;
    margin-left: 280px;
    padding: 24px 32px;
    min-height: 100vh;
}

.main-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
}

.menu-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
}

.header-actions {
    display: flex;
    gap: 12px;
}

.refresh-btn {
    width: 40px;
    height: 40px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.refresh-btn:hover {
    background: var(--bg-hover);
    color: var(--primary);
    border-color: var(--primary);
}

.refresh-btn.spinning i {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* ============================================
   STATS CARDS
   ============================================ */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
}

.stat-card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    border: 1px solid var(--border);
    transition: var(--transition);
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
}

.stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.stat-card.pending .stat-icon {
    background: rgba(245, 158, 11, 0.1);
    color: var(--warning);
}

.stat-card.approved .stat-icon {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success);
}

.stat-card.blocked .stat-icon {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger);
}

.stat-card.total .stat-icon {
    background: rgba(59, 130, 246, 0.1);
    color: var(--primary);
}

.stat-info h3 {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.stat-info p {
    color: var(--text-secondary);
    font-size: 14px;
}

/* ============================================
   USERS TABLE
   ============================================ */
.content-section {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
    gap: 16px;
}

.filter-tabs {
    display: flex;
    gap: 8px;
}

.filter-tab {
    padding: 8px 16px;
    border-radius: var(--radius);
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 14px;
    transition: var(--transition);
}

.filter-tab:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.filter-tab.active {
    background: var(--primary);
    color: white;
}

.search-box {
    position: relative;
    width: 280px;
}

.search-box i {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
}

.search-box input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    background: var(--bg-dark);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-primary);
    font-size: 14px;
}

.search-box input:focus {
    outline: none;
    border-color: var(--primary);
}

.table-container {
    overflow-x: auto;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
}

.users-table th {
    text-align: left;
    padding: 16px 24px;
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: var(--bg-dark);
    border-bottom: 1px solid var(--border);
}

.users-table td {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    color: var(--text-primary);
    font-size: 14px;
}

.users-table tr:hover {
    background: var(--bg-hover);
}

.users-table tr:last-child td {
    border-bottom: none;
}

/* User Cell */
.user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--info) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: white;
    font-size: 16px;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-weight: 600;
    color: var(--text-primary);
}

.user-id {
    font-size: 12px;
    color: var(--text-muted);
    font-family: monospace;
}

/* Status Badge */
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
}

.status-badge::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
}

.status-pending {
    background: rgba(245, 158, 11, 0.1);
    color: var(--warning);
}

.status-pending::before {
    background: var(--warning);
}

.status-approved {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success);
}

.status-approved::before {
    background: var(--success);
}

.status-blocked {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger);
}

.status-blocked::before {
    background: var(--danger);
}

/* Action Buttons */
.action-btns {
    display: flex;
    gap: 8px;
}

.action-btn {
    width: 32px;
    height: 32px;
    border-radius: var(--radius);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    font-size: 14px;
}

.action-btn.approve {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success);
}

.action-btn.approve:hover {
    background: var(--success);
    color: white;
}

.action-btn.block {
    background: rgba(245, 158, 11, 0.1);
    color: var(--warning);
}

.action-btn.block:hover {
    background: var(--warning);
    color: white;
}

.action-btn.unblock {
    background: rgba(59, 130, 246, 0.1);
    color: var(--primary);
}

.action-btn.unblock:hover {
    background: var(--primary);
    color: white;
}

.action-btn.delete {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger);
}

.action-btn.delete:hover {
    background: var(--danger);
    color: white;
}

.action-btn.view {
    background: rgba(100, 116, 139, 0.1);
    color: var(--secondary);
}

.action-btn.view:hover {
    background: var(--secondary);
    color: white;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted);
}

.empty-state i {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
}

/* ============================================
   MODALS
   ============================================ */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    animation: modalSlide 0.3s ease;
}

@keyframes modalSlide {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
}

.modal-header h3 {
    font-size: 18px;
    font-weight: 600;
}

.modal-close {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    transition: var(--transition);
}

.modal-close:hover {
    color: var(--danger);
}

.modal-body {
    padding: 24px;
}

.confirm-content {
    text-align: center;
    padding: 40px 24px;
    max-width: 400px;
}

.confirm-icon {
    width: 64px;
    height: 64px;
    background: rgba(245, 158, 11, 0.1);
    color: var(--warning);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 20px;
}

.confirm-content h3 {
    margin-bottom: 12px;
    color: var(--text-primary);
}

.confirm-content p {
    color: var(--text-secondary);
    margin-bottom: 24px;
}

.confirm-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.btn-secondary {
    padding: 10px 20px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition);
}

.btn-secondary:hover {
    background: var(--bg-hover);
}

.btn-danger {
    padding: 10px 20px;
    border-radius: var(--radius);
    border: none;
    background: var(--danger);
    color: white;
    cursor: pointer;
    transition: var(--transition);
}

.btn-danger:hover {
    background: #dc2626;
}

/* User Details in Modal */
.user-detail-grid {
    display: grid;
    gap: 16px;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-label {
    font-size: 12px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.detail-value {
    color: var(--text-primary);
    font-weight: 500;
}

.detail-value.code {
    font-family: monospace;
    background: var(--bg-dark);
    padding: 8px 12px;
    border-radius: var(--radius);
    font-size: 13px;
}

/* ============================================
   TOAST NOTIFICATIONS
   ============================================ */
.toast-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.toast {
    background: var(--bg-card);
    border-radius: var(--radius);
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 300px;
    max-width: 400px;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    animation: toastSlide 0.3s ease;
    border-left: 4px solid;
}

@keyframes toastSlide {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.toast.success {
    border-left-color: var(--success);
}

.toast.error {
    border-left-color: var(--danger);
}

.toast.warning {
    border-left-color: var(--warning);
}

.toast.info {
    border-left-color: var(--primary);
}

.toast-icon {
    font-size: 20px;
}

.toast.success .toast-icon {
    color: var(--success);
}

.toast.error .toast-icon {
    color: var(--danger);
}

.toast.warning .toast-icon {
    color: var(--warning);
}

.toast.info .toast-icon {
    color: var(--primary);
}

.toast-message {
    flex: 1;
    color: var(--text-primary);
    font-size: 14px;
}

.toast-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    transition: var(--transition);
}

.toast-close:hover {
    color: var(--text-primary);
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 1024px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
    }
    
    .sidebar.active {
        transform: translateX(0);
    }
    
    .main-content {
        margin-left: 0;
    }
    
    .menu-toggle {
        display: block;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .section-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .search-box {
        width: 100%;
    }
    
    .users-table {
        font-size: 13px;
    }
    
    .users-table th,
    .users-table td {
        padding: 12px 16px;
    }
    
    .action-btns {
        flex-wrap: wrap;
    }
}

/* Loading State */
.loading-skeleton {
    background: linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-card) 50%, var(--bg-hover) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: var(--radius);
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Utility Classes */
.hidden {
    display: none !important;
}

.text-success { color: var(--success); }
.text-danger { color: var(--danger); }
.text-warning { color: var(--warning); }
.text-primary { color: var(--primary); }
