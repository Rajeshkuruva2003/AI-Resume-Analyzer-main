// Authentication state
let isAuthenticated = false;
let currentUser = null;

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

// Tab switching functionality for recommendations
const recTabs = document.querySelectorAll('.rec-tab');
const recContents = document.querySelectorAll('.tab-content');

recTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Update active tab
        recTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding content
        recContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
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
document.getElementById('signup-password').addEventListener('input', function() {
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

document.getElementById('signup-confirm').addEventListener('input', function() {
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

document.getElementById('signup-email').addEventListener('input', function() {
    const email = this.value;
    
    if (email && !validateEmail(email)) {
        showError('signup-email-error', 'Please enter a valid email address');
        this.classList.add('error');
    } else {
        hideError('signup-email-error');
        this.classList.remove('error');
    }
});

// Form submission handlers
document.getElementById('signin-submit').addEventListener('click', function() {
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
    
    // Simulate authentication (in a real app, you would send this data to a server)
    currentUser = {
        name: email.split('@')[0],
        email: email
    };
    isAuthenticated = true;
    
    // Update UI
    document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    
    showMessage(message, 'Sign in successful!', 'success');
});

document.getElementById('signup-submit').addEventListener('click', function() {
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
    
    // Simulate account creation (in a real app, you would send this data to a server)
    currentUser = {
        name: name,
        email: email
    };
    isAuthenticated = true;
    
    // Update UI
    document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    
    showMessage(message, 'Account created successfully!', 'success');
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    isAuthenticated = false;
    currentUser = null;
    
    // Reset forms
    document.getElementById('signin-form').reset();
    document.getElementById('signup-form').reset();
    
    // Switch to sign in tab
    authTabs.forEach(t => t.classList.remove('active'));
    authTabs[0].classList.add('active');
    
    authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === 'signin-form') {
            form.classList.add('active');
        }
    });
    
    // Update UI
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('app-section').classList.add('hidden');
    
    // Clear any messages
    clearMessages();
});

// Resume Analyzer Functionality
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const fileName = document.getElementById('fileName');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const analysisResults = document.getElementById('analysisResults');
const recommendationsSection = document.getElementById('recommendationsSection');
const overallScore = document.getElementById('overallScore');
const scoreFeedback = document.getElementById('scoreFeedback');
const jobLocationFilter = document.getElementById('jobLocationFilter');
const jobCount = document.getElementById('jobCount');
const filteredJobCount = document.getElementById('filteredJobCount');

// Filter functionality (only location filter now)
function applyFilters() {
    const locationValue = jobLocationFilter.value;
    
    const jobCards = document.querySelectorAll('.job-card');
    let visibleCount = 0;
    
    jobCards.forEach(card => {
        const cardLocation = card.getAttribute('data-location');
        
        const locationMatch = locationValue === 'all' || cardLocation === locationValue;
        
        if (locationMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update job count badges
    jobCount.textContent = visibleCount;
    filteredJobCount.textContent = `Showing ${visibleCount} of ${jobCards.length} jobs`;
}

// Add event listener to location filter
jobLocationFilter.addEventListener('change', applyFilters);

// File upload handling
browseBtn.addEventListener('click', function() {
    fileInput.click();
});

uploadArea.addEventListener('click', function() {
    fileInput.click();
});

uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
    uploadArea.style.borderColor = 'var(--secondary)';
});

uploadArea.addEventListener('dragleave', function() {
    uploadArea.style.backgroundColor = '';
    uploadArea.style.borderColor = 'var(--primary)';
});

uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.style.backgroundColor = '';
    uploadArea.style.borderColor = 'var(--primary)';
    
    if (e.dataTransfer.files.length) {
        handleFileSelection(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', function() {
    if (fileInput.files.length) {
        handleFileSelection(fileInput.files[0]);
    }
});

function handleFileSelection(file) {
    const validTypes = ['application/pdf', 'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                       'text/plain'];
    
    if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, DOCX, or TXT file.');
        return;
    }
    
    fileName.textContent = file.name;
}

// Analyze button click
analyzeBtn.addEventListener('click', function() {
    if (fileName.textContent === 'No file selected') {
        alert('Please select a resume file to analyze.');
        return;
    }
    
    // Show loading indicator
    loadingIndicator.style.display = 'block';
    analysisResults.style.display = 'none';
    recommendationsSection.style.display = 'none';
    
    // Simulate AI analysis (in a real app, this would be an API call)
    setTimeout(function() {
        loadingIndicator.style.display = 'none';
        analysisResults.style.display = 'block';
        recommendationsSection.style.display = 'block';
        
        // Generate a random score between 60-95 for demo purposes
        const randomScore = Math.floor(Math.random() * 36) + 60;
        overallScore.textContent = randomScore;
        
        // Set feedback based on score
        if (randomScore >= 90) {
            scoreFeedback.textContent = 'Excellent resume! Ready to send to employers.';
        } else if (randomScore >= 80) {
            scoreFeedback.textContent = 'Strong resume with minor areas for improvement.';
        } else if (randomScore >= 70) {
            scoreFeedback.textContent = 'Good resume with room for improvement.';
        } else {
            scoreFeedback.textContent = 'Resume needs significant improvements.';
        }
        
        // Apply initial filters
        applyFilters();
        
        // Scroll to results
        analysisResults.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
});

// Job action buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('job-save')) {
        const jobTitle = e.target.closest('.job-card').querySelector('.job-title').textContent;
        alert(`Saved job: ${jobTitle}`);
        e.target.textContent = 'Saved';
        e.target.disabled = true;
    }
    
    if (e.target.classList.contains('job-apply')) {
        const jobTitle = e.target.closest('.job-card').querySelector('.job-title').textContent;
        const company = e.target.closest('.job-card').querySelector('.job-company').textContent;
        alert(`Applying to: ${jobTitle} at ${company}\n\nIn a real application, this would redirect to the job application page.`);
    }
});

// Utility functions
function showMessage(element, text, type) {
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
    element.textContent = text;
    element.style.display = 'block';
}

function hideError(elementId) {
    const element = document.getElementById(elementId);
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