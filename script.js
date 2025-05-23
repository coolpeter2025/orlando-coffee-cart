// Enhanced Delightful Bean Website JavaScript
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Configuration
    const config = {
        animationDuration: 300,
        scrollOffset: 80,
        observerThreshold: 0.1,
        mobileBreakpoint: 768
    };

    // Utility Functions
    const utils = {
        // Debounce function for performance
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Check if element is in viewport
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Animate counter
        animateCounter: function(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                element.innerText = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    };

    // Initialize all components
    function initializeComponents() {
        initLazyLoading();
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
        initFAQ();
        initRevealAnimations();
        initCounters();
        initFormValidation();
        initAnalytics();
        initAccessibility();
    }

    // Enhanced Lazy Loading
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-image, [data-lazy]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Load the image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // Add loaded class with slight delay for smooth transition
                        setTimeout(() => {
                            img.classList.add('loaded');
                        }, 50);
                        
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: config.observerThreshold
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                img.classList.add('loaded');
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        }
    }

    // Enhanced Mobile Menu
    function initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                const isOpen = mobileMenu.classList.contains('active');
                
                if (isOpen) {
                    mobileMenu.classList.remove('active');
                    this.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                } else {
                    mobileMenu.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden';
                }
                
                // Animate icon
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                    
                    const icon = mobileMenuButton.querySelector('i');
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });

            // Close menu on window resize
            window.addEventListener('resize', utils.debounce(function() {
                if (window.innerWidth > config.mobileBreakpoint) {
                    mobileMenu.classList.remove('active');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }, 250));
        }
    }

    // Enhanced Smooth Scroll
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const targetPosition = targetElement.offsetTop - config.scrollOffset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without scrolling
                    history.pushState(null, null, href);
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.getElementById('mobile-menu-toggle').click();
                    }
                    
                    // Set focus for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            });
        });
    }

    // Enhanced Header Scroll
    function initHeaderScroll() {
        const header = document.querySelector('header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', utils.debounce(function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }, 10));
    }

    // Enhanced FAQ
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.fa-chevron-down');
            
            if (question && answer) {
                question.addEventListener('click', function() {
                    const isOpen = !answer.classList.contains('hidden');
                    
                    // Close all other FAQs
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            const otherIcon = otherItem.querySelector('.fa-chevron-down');
                            
                            otherAnswer.classList.add('hidden');
                            if (otherIcon) {
                                otherIcon.style.transform = 'rotate(0deg)';
                            }
                        }
                    });
                    
                    // Toggle current FAQ
                    if (isOpen) {
                        answer.classList.add('hidden');
                        icon.style.transform = 'rotate(0deg)';
                        question.setAttribute('aria-expanded', 'false');
                    } else {
                        answer.classList.remove('hidden');
                        icon.style.transform = 'rotate(180deg)';
                        question.setAttribute('aria-expanded', 'true');
                        
                        // Smooth scroll to FAQ if needed
                        setTimeout(() => {
                            if (!utils.isInViewport(answer)) {
                                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                        }, 300);
                    }
                });
            }
        });
    }

    // Enhanced Reveal Animations
    function initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: config.observerThreshold,
                rootMargin: '0px 0px -100px 0px'
            });
            
            reveals.forEach(el => revealObserver.observe(el));
        } else {
            // Fallback: reveal all elements
            reveals.forEach(el => el.classList.add('active'));
        }
    }

    // Animated Counters
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        if (counters.length > 0) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.getAttribute('data-counter'));
                        const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
                        
                        utils.animateCounter(counter, 0, target, duration);
                        counterObserver.unobserve(counter);
                    }
                });
            }, {
                threshold: 0.5
            });
            
            counters.forEach(counter => counterObserver.observe(counter));
        }
    }

    // Form Validation
    function initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                        
                        // Remove error class on input
                        input.addEventListener('input', function() {
                            this.classList.remove('error');
                        }, { once: true });
                    }
                });
                
                if (isValid) {
                    // Submit form or show success message
                    console.log('Form submitted successfully');
                    
                    // You can add your form submission logic here
                    // For example: send data to server, show success message, etc.
                }
            });
        });
    }

    // Analytics
    function initAnalytics() {
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', utils.debounce(function() {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestones
                [25, 50, 75, 100].forEach(milestone => {
                    if (maxScroll >= milestone && maxScroll < milestone + 5) {
                        trackEvent('Scroll', 'depth', `${milestone}%`);
                    }
                });
            }
        }, 500));

        // Track time on page
        let timeOnPage = 0;
        setInterval(() => {
            timeOnPage += 5;
            
            // Track time milestones
            [30, 60, 120, 300].forEach(milestone => {
                if (timeOnPage === milestone) {
                    trackEvent('Engagement', 'time_on_page', `${milestone}s`);
                }
            });
        }, 5000);
    }

    // Accessibility Enhancements
    function initAccessibility() {
        // Skip link functionality
        const skipLink = document.querySelector('a[href="#main-content"]');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const main = document.getElementById('main-content');
                if (main) {
                    main.setAttribute('tabindex', '-1');
                    main.focus();
                }
            });
        }

        // Escape key closes mobile menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    document.getElementById('mobile-menu-toggle').click();
                }
            }
        });

        // Improve focus visibility
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-nav');
        });
    }

    // Analytics helper
    function trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        
        // Also log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`Analytics Event: ${category} - ${action} - ${label}`);
        }
    }

    // Initialize everything
    initializeComponents();

    // Export utilities for use in other scripts
    window.DelightfulBean = {
        utils: utils,
        trackEvent: trackEvent
    };
});
