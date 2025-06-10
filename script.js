// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Form elements
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    const successMessage = document.getElementById('successMessage');
    const backToTopBtn = document.getElementById('backToTop');

    // Error message elements
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[\+]?[\d\s\-\(\)]{10,}$/;

    // Real-time validation
    nameInput.addEventListener('input', validateName);
    phoneInput.addEventListener('input', validatePhone);
    emailInput.addEventListener('input', validateEmail);
    messageInput.addEventListener('input', validateMessage);

    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);

    // Back to top functionality
    window.addEventListener('scroll', toggleBackToTopButton);
    backToTopBtn.addEventListener('click', scrollToTop);

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);

    // Individual validation functions
    function validateName() {
        const name = nameInput.value.trim();
        const formGroup = nameInput.parentElement;

        if (name.length < 2) {
            showError(nameError, 'Name must be at least 2 characters long');
            setFieldState(formGroup, 'error');
            return false;
        } else if (name.length > 50) {
            showError(nameError, 'Name must not exceed 50 characters');
            setFieldState(formGroup, 'error');
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            showError(nameError, 'Name should only contain letters and spaces');
            setFieldState(formGroup, 'error');
            return false;
        } else {
            hideError(nameError);
            setFieldState(formGroup, 'success');
            return true;
        }
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const formGroup = phoneInput.parentElement;

        if (!phone) {
            showError(phoneError, 'Phone number is required');
            setFieldState(formGroup, 'error');
            return false;
        } else if (!phonePattern.test(phone)) {
            showError(phoneError, 'Please enter a valid phone number');
            setFieldState(formGroup, 'error');
            return false;
        } else {
            hideError(phoneError);
            setFieldState(formGroup, 'success');
            return true;
        }
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const formGroup = emailInput.parentElement;

        if (!email) {
            showError(emailError, 'Email address is required');
            setFieldState(formGroup, 'error');
            return false;
        } else if (!emailPattern.test(email)) {
            showError(emailError, 'Please enter a valid email address');
            setFieldState(formGroup, 'error');
            return false;
        } else {
            hideError(emailError);
            setFieldState(formGroup, 'success');
            return true;
        }
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        const formGroup = messageInput.parentElement;

        if (message.length < 10) {
            showError(messageError, 'Message must be at least 10 characters long');
            setFieldState(formGroup, 'error');
            return false;
        } else if (message.length > 500) {
            showError(messageError, 'Message must not exceed 500 characters');
            setFieldState(formGroup, 'error');
            return false;
        } else {
            hideError(messageError);
            setFieldState(formGroup, 'success');
            return true;
        }
    }

    // Utility functions for validation
    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function hideError(errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    function setFieldState(formGroup, state) {
        formGroup.classList.remove('error', 'success');
        if (state) {
            formGroup.classList.add(state);
        }
    }

async function handleFormSubmit(e) {
    e.preventDefault();

    const isNameValid = validateName();
    const isPhoneValid = validatePhone();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isPhoneValid || !isEmailValid || !isMessageValid) {
        contactForm.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => { contactForm.style.animation = ''; }, 500);
        return;
    }

    setLoadingState(true);

    try {
        await addDoc(collection(db, 'messages'), {
            name: nameInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            message: messageInput.value,
            timestamp: serverTimestamp()
        });

        showSuccessMessage();
        resetForm();

    } catch (error) {
        console.error('Firestore error:', error);
        alert('There was an error sending your message. Please try again.');
    } finally {
        setLoadingState(false);
    }
}



        

    // Simulate form submission (replace with actual implementation)
    function simulateFormSubmission() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form Data:', {
                    name: nameInput.value,
                    phone: phoneInput.value,
                    email: emailInput.value,
                    message: messageInput.value
                });
                resolve();
            }, 2000);
        });
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-flex';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }

    function showSuccessMessage() {
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Auto-hide success message and show form again after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
            contactForm.style.display = 'flex';
        }, 5000);
    }

    function resetForm() {
        contactForm.reset();
        
        // Remove all validation states
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });
        
        // Hide all error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
    }

    // Back to top functionality
    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    }
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Navbar scroll effect
    function handleNavbarScroll() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            nav.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    }

    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .contact-form {
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Create floating particles
    function createParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 15}s;
            `;
            document.body.appendChild(particle);
        }
    }

    // Add particle animation CSS
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);

    // Initialize particles
    createParticles();

    // Input focus effects
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Add focus effect CSS
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .form-group.focused label {
            color: #ff6b6b;
            transform: translateY(-2px);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(focusStyle);

    // Console welcome message
    console.log('%c📧 Contact Form Loaded! 📧', 'color: #4ecdc4; font-size: 16px; font-weight: bold;');
    console.log('%cReady to receive messages!', 'color: #ff6b6b; font-size: 12px;');

});

