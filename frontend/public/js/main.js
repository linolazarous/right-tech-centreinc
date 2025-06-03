document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with better defaults
    AOS.init({
        duration: 600,
        easing: 'ease-in-out-quad',
        once: true,
        offset: 120,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });

    // Mobile menu toggle with ARIA attributes
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle body scroll when menu is open
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // Enhanced back to top button
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        const updateBackToTopVisibility = () => {
            const isVisible = window.scrollY > 300;
            backToTopButton.classList.toggle('opacity-100', isVisible);
            backToTopButton.classList.toggle('invisible', !isVisible);
            backToTopButton.setAttribute('aria-hidden', !isVisible);
        };

        // Throttle scroll events
        let isScrolling;
        window.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(updateBackToTopVisibility, 50);
        }, { passive: true });

        updateBackToTopVisibility();
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            backToTopButton.blur(); // Remove focus after click
        });
    }

    // Improved smooth scrolling with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate scroll position with offset
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Enhanced tab functionality with ARIA
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabLinks = document.querySelectorAll('.tab-link');
    
    function activateTab(tabId, focusAfter = false) {
        // Update button states and ARIA
        tabButtons.forEach(btn => {
            const isSelected = btn.getAttribute('data-tab') === tabId;
            btn.classList.toggle('border-indigo-500', isSelected);
            btn.classList.toggle('border-transparent', !isSelected);
            btn.setAttribute('aria-selected', isSelected);
            btn.setAttribute('tabindex', isSelected ? '0' : '-1');
        });
        
        // Update tab contents and ARIA
        tabContents.forEach(content => {
            const isActive = content.id === tabId;
            content.classList.toggle('active', isActive);
            content.setAttribute('aria-hidden', !isActive);
            
            if (isActive && focusAfter) {
                content.focus();
            }
        });
    }
    
    if (tabButtons.length && tabContents.length) {
        // Set initial ARIA attributes
        tabButtons.forEach((button, index) => {
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-controls', button.getAttribute('data-tab'));
            button.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });
        
        tabContents.forEach((content, index) => {
            content.setAttribute('role', 'tabpanel');
            content.setAttribute('aria-labelledby', tabButtons[index].id || `tab-${index}`);
            content.setAttribute('tabindex', '0');
        });

        // Handle keyboard navigation
        tabButtons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                    e.preventDefault();
                    const currentIndex = Array.from(tabButtons).indexOf(button);
                    let newIndex;
                    
                    switch (e.key) {
                        case 'ArrowLeft': newIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length; break;
                        case 'ArrowRight': newIndex = (currentIndex + 1) % tabButtons.length; break;
                        case 'Home': newIndex = 0; break;
                        case 'End': newIndex = tabButtons.length - 1; break;
                    }
                    
                    tabButtons[newIndex].focus();
                    activateTab(tabButtons[newIndex].getAttribute('data-tab'));
                }
            });

            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                activateTab(tabId, true);
            });
        });
        
        // Handle tab links from other sections
        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('href');
                
                const targetButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
                if (targetButton) {
                    activateTab(tabId, true);
                    
                    const coursesSection = document.querySelector('#courses');
                    if (coursesSection) {
                        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                        const targetPosition = coursesSection.getBoundingClientRect().top + window.scrollY - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Form handling with fetch API
    const enrollmentForm = document.getElementById('enrollment-form');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = enrollmentForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                // Show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
                
                const formData = new FormData(enrollmentForm);
                const response = await fetch(enrollmentForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    enrollmentForm.innerHTML = `
                        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            <strong class="font-bold">Success!</strong>
                            <span class="block sm:inline">Your application has been submitted.</span>
                        </div>
                    `;
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
                errorDiv.innerHTML = `
                    <strong class="font-bold">Error!</strong>
                    <span class="block sm:inline">There was a problem submitting your form. Please try again.</span>
                `;
                enrollmentForm.prepend(errorDiv);
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
});

// Load non-critical resources after page load
window.addEventListener('load', function() {
    // Lazy load non-critical images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Auto-update copyright year
document.getElementById('current-year').textContent = new Date().getFullYear();
