// Language Toggle
let currentLang = 'pt';

const translations = {
    pt: {
        'nav-home': 'Home',
        'nav-about': 'Sobre',
        'nav-features': 'Funções',
        'nav-how': 'Como Funciona',
        'nav-contact': 'Contato',
        'form-name': 'Nome',
        'form-email': 'E-mail',
        'form-message': 'Mensagem',
        'contact-email': 'E-mail',
        'contact-location': 'Localização',
        'footer-links': 'Links Rápidos',
        'footer-social': 'Redes Sociais'
    },
    en: {
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-features': 'Roles',
        'nav-how': 'How It Works',
        'nav-contact': 'Contact',
        'form-name': 'Name',
        'form-email': 'Email',
        'form-message': 'Message',
        'contact-email': 'Email',
        'contact-location': 'Location',
        'footer-links': 'Quick Links',
        'footer-social': 'Social Media'
    }
};

function toggleLanguage() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    document.getElementById('current-lang').textContent = currentLang.toUpperCase();
    
    // Toggle all language-specific elements
    const ptElements = document.querySelectorAll('.lang-pt');
    const enElements = document.querySelectorAll('.lang-en');
    
    if (currentLang === 'pt') {
        ptElements.forEach(el => el.style.display = 'block');
        enElements.forEach(el => el.style.display = 'none');
    } else {
        ptElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = 'block');
    }
    
    // Update data-lang elements
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
    
    // Update document language
    document.documentElement.lang = currentLang;
}

// Handle App Access
function handleAppAccess(event) {
    if (event) {
        event.preventDefault();
    }
    
    // Show a modal or notification instead of alert
    showNotification(
        currentLang === 'pt' 
            ? 'Redirecionando para o aplicativo...' 
            : 'Redirecting to the app...',
        'info'
    );
    
    // Simulate redirect after 2 seconds
    setTimeout(() => {
        // In a real application, this would redirect to the app
        // window.location.href = 'https://app.synapse.com';
        showNotification(
            currentLang === 'pt' 
                ? 'O aplicativo estará disponível em breve!' 
                : 'The app will be available soon!',
            'success'
        );
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Show success message
    const form = event.target;
    const originalButton = form.querySelector('.submit-button');
    const originalContent = originalButton.innerHTML;
    
    originalButton.innerHTML = currentLang === 'pt' ? 'Enviando...' : 'Sending...';
    originalButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        originalButton.innerHTML = currentLang === 'pt' ? 'Mensagem Enviada!' : 'Message Sent!';
        originalButton.style.background = '#10b981';
        
        // Reset form
        form.reset();
        
        // Show notification
        showNotification(
            currentLang === 'pt' 
                ? 'Obrigado pelo contato! Responderemos em breve.' 
                : 'Thank you for contacting us! We will reply soon.',
            'success'
        );
        
        // Reset button after 3 seconds
        setTimeout(() => {
            originalButton.innerHTML = originalContent;
            originalButton.disabled = false;
            originalButton.style.background = '';
        }, 3000);
    }, 1500);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('section, .feature-card, .step, .stat-card, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            document.querySelector('.nav-menu').classList.remove('active');
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Dynamic header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(15, 15, 35, 0.98)';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(15, 15, 35, 0.95)';
        header.style.boxShadow = 'none';
    }
});