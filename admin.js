// DEBUG VERSION - Replace entire admin.js with this temporarily
console.log('=== STEP 1: Script starting ===');

try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js");
    console.log('=== STEP 2: Firebase App imported ===');
    
    const { getAuth } = await import("https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js");
    console.log('=== STEP 3: Firebase Auth imported ===');
    
    const { getDatabase } = await import("https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js");
    console.log('=== STEP 4: Firebase Database imported ===');
    
    // Show success message on page
    document.body.innerHTML = '<div style="color:green;padding:50px;font-size:24px;">✅ All Firebase modules loaded successfully!<br>Replace this debug script with full admin.js now.</div>';
    
} catch (error) {
    console.error('=== IMPORT FAILED ===', error);
    document.body.innerHTML = '<div style="color:red;padding:50px;font-size:18px;">❌ ERROR: ' + error.message + '<br><br>Check console (F12) for details.</div>';
}
