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
            e.stopPropagation(); // Prevent issues with body scroll on mobile menu open
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', !isHidden);
            document.body.style.overflow = isHidden ? '' : 'hidden'; // Prevent body scroll when menu is open
        });
    }
    
    /**
     * 3. Smooth Scrolling for Anchor Links
     * =============================================
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Exclude the back-to-top button from this logic and direct tab links
        if (anchor.id === 'back-to-top' || anchor.classList.contains('tab-link')) return;

        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.length <= 1) return; // Handle empty or just '#' hrefs

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header')?.offsetHeight || 80; // Get actual header height or default
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    /**
     * 4. Back to Top Button
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
            }, 150); // Throttle to prevent excessive calls
        }, { passive: true }); // Use passive listener for better scroll performance

        // Click event to scroll to top
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
                
                // Remove all specific border classes before adding the correct one
                btn.classList.remove('text-white', 'border-pink-400', 'border-teal-400', 'border-purple-400');
                btn.classList.add('text-gray-300', 'border-transparent');

                if (isSelected) {
                    btn.classList.add('text-white');
                    if (tabId.includes('certification')) {
                        btn.classList.add('border-pink-400');
                    } else if (tabId.includes('diploma')) {
                        btn.classList.add('border-teal-400');
                    } else { // degree-tab
                        btn.classList.add('border-purple-400');
                    }
                }
            });

            tabContents.forEach(content => {
                const isActive = content.id === `${tabId}-content`; // Match content ID
                content.classList.toggle('active', isActive);
                content.classList.toggle('hidden', !isActive);
            });
        }

        // Event listeners for main tab buttons
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                activateTab(button.dataset.tab);
            });
        });

        // Event listeners for links that activate tabs (e.g., from Programs section)
        document.querySelectorAll('.tab-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const tabId = new URL(link.href).hash.substring(1); // Get tab ID from href hash
                const targetButton = document.querySelector(`.tab-button[data-tab="${tabId.replace('-content', '')}"]`); // Find the corresponding button
                
                if (targetButton) {
                    e.preventDefault(); // Prevent default anchor jump for internal tab links
                    activateTab(targetButton.dataset.tab); // Activate the tab via its button's data-tab
                    
                    // Smooth scroll to the courses section after activating the tab
                    const coursesSection = document.getElementById('courses');
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

        // Activate the first tab on page load if no hash is present or if it's an invalid hash
        const initialHash = window.location.hash.substring(1);
        const initialTabButton = document.querySelector(`.tab-button[data-tab="${initialHash.replace('-content', '')}"]`);
        if (initialTabButton) {
            activateTab(initialTabButton.dataset.tab);
        } else {
            activateTab(tabButtons[0].dataset.tab); // Default to the first tab
        }
    }

    /**
     * 6. Enrollment Form Handling & Validation
     * =============================================
     */
    const enrollmentForm = document.getElementById('enrollment-form');
    if (enrollmentForm) {
        const submitBtn = document.getElementById('submit-btn');
        const submitText = document.getElementById('submit-text');
        const formMessages = document.getElementById('form-messages'); // This element needs to exist in HTML

        enrollmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous messages and hide
            if(formMessages) {
                formMessages.innerHTML = '';
                formMessages.classList.add('hidden');
            }
            
            submitText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
            submitBtn.disabled = true;

            try {
                // In a real production environment, you would replace this
                // setTimeout with an actual fetch request to your backend.
                // Example:
                /*
                const formData = new FormData(enrollmentForm);
                const response = await fetch(enrollmentForm.action, {
                    method: 'POST',
                    body: formData,
                    // headers: { 'Accept': 'application/json' } // Uncomment if your backend expects JSON
                });

                if (!response.ok) {
                    const errorData = await response.json(); // Assuming JSON error response
                    throw new Error(errorData.message || 'Form submission failed');
                }

                // const successData = await response.json(); // Assuming JSON success response
                */

                await new Promise(resolve => setTimeout(resolve, 1500)); // Demo delay for effect
                
                if (formMessages) {
                    formMessages.innerHTML = `<div class="rounded-md bg-green-50 p-4"><div class="flex"><p class="text-sm font-medium text-green-800">Application submitted successfully! We will be in touch shortly.</p></div></div>`;
                    formMessages.classList.remove('hidden');
                }
                enrollmentForm.reset();
            } catch (error) {
                console.error("Form submission error:", error);
                 if (formMessages) {
                    formMessages.innerHTML = `<div class="rounded-md bg-red-50 p-4"><div class="flex"><p class="text-sm font-medium text-red-800">There was an error submitting your application. Please try again.</p></div></div>`;
                    formMessages.classList.remove('hidden');
                }
            } finally {
                // Reset button state after a short delay for feedback
                setTimeout(() => {
                    submitText.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Submit Application';
                    submitBtn.disabled = false;
                }, 2000); 
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
