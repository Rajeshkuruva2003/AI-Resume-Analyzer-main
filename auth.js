// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth script loaded successfully');
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        console.log('User already logged in, redirecting to dashboard');
        window.location.href = 'dashboard.html';
        return;
    }

    // Tab switching functionality for authentication
    const authTabs = document.querySelectorAll('.tab');
    const authForms = document.querySelectorAll('.form');
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabId}-form`) {
                    form.classList.add('active');
                }
            });
            
            // Clear any messages
            clearMessages();
        });
    });
    
    // Form validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePassword(password) {
        return password.length >= 8;
    }
    
    function checkPasswordStrength(password) {
        let strength = 0;
        const bar = document.getElementById('password-strength-bar');
        if (!bar) return 0;
        
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        
        bar.style.width = `${strength}%`;
        
        if (strength < 50) {
            bar.style.backgroundColor = '#e74c3c';
        } else if (strength < 75) {
            bar.style.backgroundColor = '#f39c12';
        } else {
            bar.style.backgroundColor = '#2ecc71';
        }
        
        return strength;
    }
    
    // Real-time validation
    const signupPassword = document.getElementById('signup-password');
    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            const password = this.value;
            checkPasswordStrength(password);
            
            if (password && !validatePassword(password)) {
                showError('signup-password-error', 'Password must be at least 8 characters');
                this.classList.add('error');
            } else {
                hideError('signup-password-error');
                this.classList.remove('error');
            }
            
            // Also validate confirm password if it has value
            const confirmPassword = document.getElementById('signup-confirm').value;
            if (confirmPassword && password !== confirmPassword) {
                showError('signup-confirm-error', 'Passwords do not match');
                document.getElementById('signup-confirm').classList.add('error');
            } else if (confirmPassword) {
                hideError('signup-confirm-error');
                document.getElementById('signup-confirm').classList.remove('error');
            }
        });
    }
    
    const signupConfirm = document.getElementById('signup-confirm');
    if (signupConfirm) {
        signupConfirm.addEventListener('input', function() {
            const password = document.getElementById('signup-password').value;
            const confirmPassword = this.value;
            
            if (confirmPassword && password !== confirmPassword) {
                showError('signup-confirm-error', 'Passwords do not match');
                this.classList.add('error');
            } else {
                hideError('signup-confirm-error');
                this.classList.remove('error');
            }
        });
    }
    
    const signupEmail = document.getElementById('signup-email');
    if (signupEmail) {
        signupEmail.addEventListener('input', function() {
            const email = this.value;
            
            if (email && !validateEmail(email)) {
                showError('signup-email-error', 'Please enter a valid email address');
                this.classList.add('error');
            } else {
                hideError('signup-email-error');
                this.classList.remove('error');
            }
        });
    }
    
    // Form submission handlers
    const signinSubmit = document.getElementById('signin-submit');
    if (signinSubmit) {
        signinSubmit.addEventListener('click', function() {
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            const message = document.getElementById('signin-message');
            
            let isValid = true;
            
            if (!email) {
                showError('signin-email-error', 'Please enter your email or username');
                document.getElementById('signin-email').classList.add('error');
                isValid = false;
            } else {
                hideError('signin-email-error');
                document.getElementById('signin-email').classList.remove('error');
            }
            
            if (!password) {
                showError('signin-password-error', 'Please enter your password');
                document.getElementById('signin-password').classList.add('error');
                isValid = false;
            } else {
                hideError('signin-password-error');
                document.getElementById('signin-password').classList.remove('error');
            }
            
            if (!isValid) return;
            
            // Store user data and redirect to dashboard
            const userData = {
                name: email.split('@')[0],
                email: email,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('User signed in successfully:', userData);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    const signupSubmit = document.getElementById('signup-submit');
    if (signupSubmit) {
        signupSubmit.addEventListener('click', function() {
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;
            const terms = document.getElementById('terms').checked;
            const message = document.getElementById('signup-message');
            
            let isValid = true;
            
            if (!name) {
                showError('signup-name-error', 'Please enter your full name');
                document.getElementById('signup-name').classList.add('error');
                isValid = false;
            } else {
                hideError('signup-name-error');
                document.getElementById('signup-name').classList.remove('error');
            }
            
            if (!email || !validateEmail(email)) {
                showError('signup-email-error', 'Please enter a valid email address');
                document.getElementById('signup-email').classList.add('error');
                isValid = false;
            } else {
                hideError('signup-email-error');
                document.getElementById('signup-email').classList.remove('error');
            }
            
            if (!password || !validatePassword(password)) {
                showError('signup-password-error', 'Password must be at least 8 characters');
                document.getElementById('signup-password').classList.add('error');
                isValid = false;
            } else {
                hideError('signup-password-error');
                document.getElementById('signup-password').classList.remove('error');
            }
            
            if (!confirm || password !== confirm) {
                showError('signup-confirm-error', 'Passwords do not match');
                document.getElementById('signup-confirm').classList.add('error');
                isValid = false;
            } else {
                hideError('signup-confirm-error');
                document.getElementById('signup-confirm').classList.remove('error');
            }
            
            if (!terms) {
                showMessage(message, 'Please accept the terms and conditions', 'error');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Store user data and redirect to dashboard
            const userData = {
                name: name,
                email: email,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('User signed up successfully:', userData);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    // Utility functions
    function showMessage(element, text, type) {
        if (!element) return;
        element.textContent = text;
        element.className = `message ${type}`;
        element.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
    
    function showError(elementId, text) {
        const element = document.getElementById(elementId);
        if (!element) return;
        element.textContent = text;
        element.style.display = 'block';
    }
    
    function hideError(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        element.style.display = 'none';
    }
    
    function clearMessages() {
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => {
            message.style.display = 'none';
        });
        
        const errors = document.querySelectorAll('.error-text');
        errors.forEach(error => {
            error.style.display = 'none';
        });
        
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }
});