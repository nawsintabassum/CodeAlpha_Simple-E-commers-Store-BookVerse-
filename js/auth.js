/**
 * BookVerse - Authentication Module
 * Handles Registration, Login, Session Management, and Password Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initAuthUI();
    setupLoginForm();
    setupRegisterForm();
});

// Checks active user state and updates top navbar links
function initAuthUI() {
    const authLinksContainer = document.getElementById('authLinks');
    if (!authLinksContainer) return;

    const currentUser = JSON.parse(localStorage.getItem('bv_user'));

    if (currentUser) {
        authLinksContainer.innerHTML = `
            <span class="user-greeting"><i class="fa-solid fa-user-circle"></i> Hi, <strong>${currentUser.username}</strong></span>
            <button id="logoutBtn" class="btn btn-outline btn-sm"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        `;

        document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    }
}

// User Registration Handler with Validation
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    const alertBox = document.getElementById('registerAlert');

    // Password Toggle Visibility
    const toggleRegPassword = document.getElementById('toggleRegPassword');
    if (toggleRegPassword) {
        toggleRegPassword.addEventListener('click', () => {
            const pwdInput = document.getElementById('regPassword');
            const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
            pwdInput.setAttribute('type', type);
            toggleRegPassword.classList.toggle('fa-eye-slash');
        });
    }

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Validation Rules
        if (password !== confirmPassword) {
            showAlert(alertBox, 'Passwords do not match!');
            return;
        }

        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            showAlert(alertBox, 'Password must be at least 8 characters long and contain both letters and numbers.');
            return;
        }

        // Check Existing Users in localStorage
        const users = JSON.parse(localStorage.getItem('bv_registered_users')) || [];
        const userExists = users.some(u => u.username === username || u.email === email);

        if (userExists) {
            showAlert(alertBox, 'Username or Email is already registered.');
            return;
        }

        // Save New User
        const newUser = { id: Date.now(), username, email, password };
        users.push(newUser);
        localStorage.setItem('bv_registered_users', JSON.stringify(users));

        // Auto Log In
        localStorage.setItem('bv_user', JSON.stringify({ username: newUser.username, email: newUser.email }));

        alert('Account registered successfully!');
        window.location.href = 'index.html';
    });
}

// User Login Handler
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const alertBox = document.getElementById('authAlert');

    // Password Toggle Visibility
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', () => {
            const pwdInput = document.getElementById('loginPassword');
            const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
            pwdInput.setAttribute('type', type);
            toggleLoginPassword.classList.toggle('fa-eye-slash');
        });
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById('loginUsername').value.trim();
        const passwordInput = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('bv_registered_users')) || [];

        // Validate Credentials
        const user = users.find(u => (u.username === usernameInput || u.email === usernameInput) && u.password === passwordInput);

        if (user) {
            localStorage.setItem('bv_user', JSON.stringify({ username: user.username, email: user.email }));
            window.location.href = 'index.html';
        } else {
            showAlert(alertBox, 'Invalid username/email or password.');
        }
    });
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem('bv_user');
    window.location.reload();
}

// Helper: Show Alert Box
function showAlert(element, message) {
    if (!element) return;
    element.textContent = message;
    element.style.display = 'block';
}