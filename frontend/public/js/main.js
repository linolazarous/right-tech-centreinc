document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 120
        });
    }

    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', !isHidden);
            document.body.style.overflow = isHidden ? '' : 'hidden';
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.id === 'back-to-top' || anchor.classList.contains('tab-link')) return;

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

    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        let isScrolling;

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

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Tabbed Interface Functionality
    const tabContainer = document.querySelector('#courses');
    if (tabContainer) {
        const tabButtons = tabContainer.querySelectorAll('.tab-button');
        const tabContents = tabContainer.querySelectorAll('.tab-content');

        function activateTab(tabId) {
            tabButtons.forEach(btn => {
                const isSelected = btn.dataset.tab === tabId;
                btn.setAttribute('aria-selected', isSelected);
                
                btn.classList.remove('text-white', 'border-pink-400', 'border-teal-400', 'border-purple-400');
                btn.classList.add('text-gray-300', 'border-transparent');

                if (isSelected) {
                    btn.classList.add('text-white');
                    if (tabId.includes('certification')) {
                        btn.classList.add('border-pink-400');
                    } else if (tabId.includes('diploma')) {
                        btn.classList.add('border-teal-400');
                    } else {
                        btn.classList.add('border-purple-400');
                    }
                }
            });

            tabContents.forEach(content => {
                const isActive = content.id === `${tabId}-content`;
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
                const targetButton = document.querySelector(`.tab-button[data-tab="${tabId.replace('-content', '')}"]`);
                
                if (targetButton) {
                    e.preventDefault();
                    activateTab(targetButton.dataset.tab);
                    
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

        const initialHash = window.location.hash.substring(1);
        const initialTabButton = document.querySelector(`.tab-button[data-tab="${initialHash.replace('-content', '')}"]`);
        if (initialTabButton) {
            activateTab(initialTabButton.dataset.tab);
        } else {
            activateTab(tabButtons[0].dataset.tab);
        }
    }

    // Enrollment Form Handling
    const enrollmentForm = document.getElementById('enrollment-form');
    if (enrollmentForm) {
        const submitBtn = document.getElementById('submit-btn');
        const submitText = document.getElementById('submit-text');
        const formMessages = document.getElementById('form-messages');

        enrollmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if(formMessages) {
                formMessages.innerHTML = '';
                formMessages.classList.add('hidden');
            }
            
            submitText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
            submitBtn.disabled = true;

            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                
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
                setTimeout(() => {
                    submitText.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Submit Application';
                    submitBtn.disabled = false;
                }, 2000); 
            }
        });
    }

    // Auth Modal
    const modal = document.getElementById('auth-modal');
    if (modal) {
        const closeBtn = document.getElementById('close-modal');
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        document.querySelectorAll('[href="#login"], [href="/login"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        });
        
        if (loginTab && registerTab) {
            loginTab.addEventListener('click', function() {
                loginTab.classList.add('border-indigo-500', 'text-indigo-600');
                loginTab.classList.remove('border-transparent', 'text-gray-500');
                registerTab.classList.add('border-transparent', 'text-gray-500');
                registerTab.classList.remove('border-indigo-500', 'text-indigo-600');
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            });
            
            registerTab.addEventListener('click', function() {
                registerTab.classList.add('border-indigo-500', 'text-indigo-600');
                registerTab.classList.remove('border-transparent', 'text-gray-500');
                loginTab.classList.add('border-transparent', 'text-gray-500');
                loginTab.classList.remove('border-indigo-500', 'text-indigo-600');
                registerForm.classList.remove('hidden');
                loginForm.classList.add('hidden');
            });
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }

    // Copyright Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Lazy loading for images
    const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src || lazyImage.src;
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }
});
