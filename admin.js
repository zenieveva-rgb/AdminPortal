// ============================================
// EXPANDED DEBUG - Step by step testing
// ============================================
console.log('=== STEP 1: Script starting ===');

try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js");
    console.log('=== STEP 2: Firebase App imported ===');
    
    const { getAuth, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js");
    console.log('=== STEP 3: Firebase Auth imported ===');
    
    const { getDatabase } = await import("https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js");
    console.log('=== STEP 4: Firebase Database imported ===');
    
    // STEP 5: Check Firebase Config
    console.log('=== STEP 5: Checking Firebase Config ===');
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY", // Replace with your actual config
        authDomain: "your-project.firebaseapp.com",
        databaseURL: "https://your-project-default-rtdb.firebaseio.com",
        projectId: "your-project",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abc123"
    };
    console.log('Config exists:', !!firebaseConfig.apiKey);
    
    // STEP 6: Initialize Firebase
    console.log('=== STEP 6: Initializing Firebase ===');
    const app = initializeApp(firebaseConfig);
    console.log('Firebase initialized:', !!app);
    
    // STEP 7: Get Services
    console.log('=== STEP 7: Getting Auth & Database ===');
    const auth = getAuth(app);
    const db = getDatabase(app);
    console.log('Auth exists:', !!auth);
    console.log('Database exists:', !!db);
    
    // STEP 8: Check DOM Elements
    console.log('=== STEP 8: Checking DOM Elements ===');
    const loginContainer = document.getElementById('loginContainer');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('adminLoginForm');
    
    console.log('loginContainer found:', !!loginContainer);
    console.log('dashboard found:', !!dashboard);
    console.log('adminLoginForm found:', !!loginForm);
    
    // STEP 9: Check Auth State
    console.log('=== STEP 9: Setting up Auth Listener ===');
    onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed. User:', user ? 'LOGGED IN' : 'NOT LOGGED IN');
        if (!user) {
            console.log('Should show login form');
            if (loginContainer) {
                loginContainer.style.display = 'flex';
                console.log('Login container display set to flex');
            }
        }
    });
    
    // STEP 10: Success
    console.log('=== STEP 10: ALL CHECKS PASSED ===');
    document.body.insertAdjacentHTML('beforeend', 
        '<div style="position:fixed;bottom:20px;right:20px;background:green;color:white;padding:20px;z-index:99999;">✅ DEBUG: All steps passed! Check console.</div>'
    );
    
} catch (error) {
    console.error('=== CRASH AT STEP ===', error);
    console.error('Error stack:', error.stack);
    document.body.innerHTML = '<div style="color:red;padding:50px;font-size:18px;">❌ CRASH: ' + error.message + '<br><br>Check console (F12) for full stack trace.</div>';
}
