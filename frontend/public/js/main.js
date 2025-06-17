document.addEventListener('DOMContentLoaded', function() {

    /**
     * 1. Initialize Libraries
     * =============================================
     */
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 120,
    });

    /**
     * 2. Mobile Menu Toggle
     * =============================================
     */
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', !isHidden);
            document.body.style.overflow = isHidden ? '' : 'hidden';
        });
    }
    
    /**
     * 3. Smooth Scrolling for Anchor Links
     * =============================================
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Exclude the back-to-top button from this logic
        if (anchor.id === 'back-to-top') return;

        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.length <= 1) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    /**
     * 4. Back to Top Button (FIXED & IMPROVED)
     * =============================================
     */
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        let isScrolling;

        // Show/hide button based on scroll position (throttled for performance)
        window.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                if (window.scrollY > 300) {
                    backToTopButton.classList.remove('opacity-0', 'invisible');
                } else {
                    backToTopButton.classList.add('opacity-0', 'invisible');
                }
            }, 150);
        }, { passive: true });

        // Add the missing click event to scroll to top
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    /**
     * 5. Tabbed Interface Functionality
     * =============================================
     */
    const tabContainer = document.querySelector('#courses');
    if (tabContainer) {
        const tabButtons = tabContainer.querySelectorAll('.tab-button');
        const tabContents = tabContainer.querySelectorAll('.tab-content');

        function activateTab(tabId) {
            tabButtons.forEach(btn => {
                const isSelected = btn.dataset.tab === tabId;
                btn.setAttribute('aria-selected', isSelected);
                // Style changes are handled by Tailwind classes in the HTML
            });

            tabContents.forEach(content => {
                const isActive = content.id === `${tabId}-content`; // Match content ID
                content.classList.toggle('active', isActive);
                content.classList.toggle('hidden', !isActive);
            });
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                activateTab(button.dataset.tab);
            });
        });

        document.querySelectorAll('.tab-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const tabId = new URL(link.href).hash.substring(1);
                const targetButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
                if(targetButton) {
                    e.preventDefault();
                    activateTab(tabId);
                    targetButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });
    }

    /**
     * 6. Enrollment Form Handling & Validation
     * =============================================
     */
    const enrollmentForm = document.getElementById('enrollment-form');
    if (enrollmentForm) {
        const submitBtn = document.getElementById('submit-btn');
        const submitText = document.getElementById('submit-text');
        const formMessages = document.getElementById('form-messages'); // Ensure you have this element in your HTML

        enrollmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if(formMessages) formMessages.classList.add('hidden');
            
            submitText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
            submitBtn.disabled = true;

            try {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Demo delay
                
                if (formMessages) {
                    formMessages.innerHTML = `<div class="rounded-md bg-green-50 p-4"><div class="flex"><p class="text-sm font-medium text-green-800">Application submitted successfully!</p></div></div>`;
                    formMessages.classList.remove('hidden');
                }
                enrollmentForm.reset();
            } catch (error) {
                console.error("Form submission error:", error);
                 if (formMessages) {
                    formMessages.innerHTML = `<div class="rounded-md bg-red-50 p-4"><div class="flex"><p class="text-sm font-medium text-red-800">There was an error. Please try again.</p></div></div>`;
                    formMessages.classList.remove('hidden');
                }
            } finally {
                submitText.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Submit Application';
                submitBtn.disabled = false;
            }
        });
    }

    /**
     * 7. Copyright Year
     * =============================================
     */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
