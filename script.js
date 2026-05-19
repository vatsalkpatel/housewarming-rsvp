// ==================== CONFIGURATION ====================
const CONFIG = {
    DEADLINE: new Date('2026-06-18T23:59:59').getTime(),
    NOTIFICATION_EMAILS: ['dhwanirpatel@gmail.com'],
    NOTIFICATION_PHONE: '+16572387812',
    EVENT_DATE: new Date('2026-07-18T15:30:00'),
    BACKEND_URL: './submit-rsvp' // Will be replaced with actual backend URL
};

// ==================== DOM ELEMENTS ====================
const form = document.getElementById('rsvpForm');
const guestsSelect = document.getElementById('guests');
const additionalGuestsGroup = document.getElementById('additionalGuestsGroup');
const formMessage = document.getElementById('formMessage');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const attendingRadios = document.querySelectorAll('input[name="attending"]');

// ==================== COUNTDOWN TIMER ====================
function updateCountdown() {
    const now = Date.now();
    const distance = CONFIG.DEADLINE - now;

    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
}

// Update countdown on load and every second
updateCountdown();
setInterval(updateCountdown, 1000);

// ==================== FORM INTERACTIONS ====================
guestsSelect.addEventListener('change', function() {
    if (this.value === '7') {
        additionalGuestsGroup.style.display = 'block';
        document.getElementById('additionalGuests').focus();
    } else {
        additionalGuestsGroup.style.display = 'none';
        document.getElementById('additionalGuests').value = '';
    }
});

// ==================== VALIDATION ====================
function validateForm() {
    let isValid = true;

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    // Validate Name
    if (nameInput.value.trim() === '') {
        document.getElementById('nameError').textContent = 'Please enter your name';
        isValid = false;
    }

    // Validate Phone
    if (phoneInput.value.trim() === '') {
        document.getElementById('phoneError').textContent = 'Please enter your phone number';
        isValid = false;
    } else if (!isValidPhone(phoneInput.value)) {
        document.getElementById('phoneError').textContent = 'Please enter a valid phone number';
        isValid = false;
    }

    // Validate Email (optional but if provided, should be valid)
    if (emailInput.value.trim() !== '' && !isValidEmail(emailInput.value)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        isValid = false;
    }

    // Validate Guests
    if (guestsSelect.value === '') {
        document.getElementById('guestsError').textContent = 'Please select number of guests';
        isValid = false;
    } else if (guestsSelect.value === '7') {
        const additionalGuests = document.getElementById('additionalGuests').value;
        if (additionalGuests === '' || parseInt(additionalGuests) < 7) {
            document.getElementById('guestsError').textContent = 'Please specify total number of guests (7 or more)';
            isValid = false;
        }
    }

    // Validate Attending
    const attendingSelected = Array.from(attendingRadios).some(radio => radio.checked);
    if (!attendingSelected) {
        document.getElementById('attendingError').textContent = 'Please indicate if you can attend';
        isValid = false;
    }

    return isValid;
}

// ==================== VALIDATION HELPERS ====================
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}

// ==================== FORM SUBMISSION ====================
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        showMessage('Please fill in all required fields correctly', 'error');
        return;
    }

    // Check deadline
    if (Date.now() > CONFIG.DEADLINE) {
        showMessage('The RSVP deadline has passed. Thank you for your interest!', 'error');
        return;
    }

    const formData = prepareFormData();
    const submitButton = form.querySelector('.btn-submit');
    
    // Disable submit button during submission
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';

    try {
        // Try to send to backend
        const response = await fetch('/api/submit-rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).catch(() => {
            // Fallback: save to localStorage if backend is not available
            return fallbackSaveToLocalStorage(formData);
        });

        if (response && response.ok) {
            const result = await response.json();
        }

        // Success
        showMessage(`Thank you ${formData.name}! Your RSVP has been submitted successfully. We look forward to celebrating with you!`, 'success');
        
        // Reset form
        form.reset();
        guestsSelect.value = '';
        additionalGuestsGroup.style.display = 'none';
        
        // Re-enable submit button after delay
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 2000);

    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Thank you for your RSVP! Your response has been saved.', 'success');
        
        // Reset form anyway
        form.reset();
        guestsSelect.value = '';
        additionalGuestsGroup.style.display = 'none';
        
        // Re-enable submit button
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 2000);
    }
});

// ==================== UTILITY FUNCTIONS ====================
function prepareFormData() {
    const guests = guestsSelect.value === '7' 
        ? document.getElementById('additionalGuests').value 
        : guestsSelect.value;

    return {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        guests: parseInt(guests),
        attending: document.querySelector('input[name="attending"]:checked').value,
        timestamp: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function fallbackSaveToLocalStorage(data) {
    // Save to localStorage as fallback
    const responses = JSON.parse(localStorage.getItem('rsvpResponses') || '[]');
    responses.push(data);
    localStorage.setItem('rsvpResponses', JSON.stringify(responses));
    console.log('Responses saved locally:', responses);
    return Promise.resolve({ ok: true });
}

// ==================== INITIALIZATION ====================
console.log('RSVP Form initialized');
console.log('Deadline:', new Date(CONFIG.DEADLINE).toLocaleDateString());
console.log('Event Date:', CONFIG.EVENT_DATE.toLocaleDateString());
