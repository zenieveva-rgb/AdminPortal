/* =========================
   ROOT VARIABLES
========================= */
:root {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --bg: #0f172a;
    --card: #1e293b;
    --text: #f8fafc;
    --muted: #94a3b8;
    --border: #334155;

    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;

    --radius: 10px;
    --transition: 0.3s ease;
}

/* =========================
   GLOBAL
========================= */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', sans-serif;
}

body {
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
}

/* =========================
   LOGIN PAGE
========================= */
.login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #020617, #1e293b);
    animation: fadeIn 0.6s ease;
}

.login-box {
    background: var(--card);
    padding: 40px;
    border-radius: var(--radius);
    width: 320px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    animation: slideUp 0.6s ease;
}

.login-box h2 {
    text-align: center;
    margin-bottom: 20px;
}

.login-box input {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: #0f172a;
    color: white;
    outline: none;
    transition: var(--transition);
}

.login-box input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 5px var(--primary);
}

.login-box button {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-weight: bold;
    transition: var(--transition);
}

.login-box button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(59,130,246,0.4);
}

/* =========================
   DASHBOARD
========================= */
#dashboard {
    padding: 20px;
    animation: fadeIn 0.5s ease;
}

.hidden {
    display: none;
}

/* =========================
   HEADER
========================= */
h2 {
    margin-bottom: 20px;
}

/* =========================
   BUTTON
========================= */
button {
    cursor: pointer;
    transition: var(--transition);
}

#logoutBtn {
    background: var(--danger);
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    color: white;
    margin-bottom: 20px;
}

#logoutBtn:hover {
    background: #dc2626;
    transform: scale(1.05);
}

/* =========================
   TABLE
========================= */
table {
    width: 100%;
    border-collapse: collapse;
    background: var(--card);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    animation: fadeIn 0.6s ease;
}

th, td {
    padding: 14px;
    text-align: left;
}

th {
    background: #0f172a;
    color: var(--muted);
    font-size: 12px;
    text-transform: uppercase;
}

tr {
    border-bottom: 1px solid var(--border);
    transition: var(--transition);
}

tr:hover {
    background: #334155;
}

/* =========================
   ACTION BUTTONS
========================= */
button {
    border-radius: 6px;
    padding: 6px 10px;
    border: none;
    font-size: 13px;
}

button:hover {
    transform: scale(1.05);
}

/* Approve Button */
button.approve {
    background: var(--success);
    color: white;
}

/* =========================
   ANIMATIONS
========================= */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 768px) {
    .login-box {
        width: 90%;
        padding: 25px;
    }

    table {
        font-size: 13px;
    }

    th, td {
        padding: 10px;
    }
}
