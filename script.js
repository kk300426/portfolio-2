document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       Custom Cursor
    ========================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const interactables = document.querySelectorAll('a, button, .magnetic, .image-frame');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Position dot instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Animate outline nicely (give it a small delay effect via WAAPI or just let CSS handle it. Better to use CSS transitions for hardware accel, or animate via JS. Here we let CSS translation do it by updating transform occasionally, but updating style direct is fine)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add scale effect when hovering over interactable elements
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    /* ==========================================
       Navigation Effects
    ========================================== */
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    // Sticky Navbar blur on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link switching on scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* ==========================================
       Dark/Light Theme Toggle
    ========================================== */
    const themeBtn = document.getElementById('theme-toggle');
    const htmlTag = document.documentElement;
    const themeIcon = themeBtn.querySelector('i');

    function setTheme(theme) {
        htmlTag.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        if(theme === 'dark') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    // Check local storage
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    setTheme(savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlTag.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    /* ==========================================
       Typing Text Effect
    ========================================== */
    const typedTextSpan = document.querySelector('.typed-text');
    const textArray = ["Web Developer", "BCA Student", "UI/UX Enthusiast"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (textArray.length) setTimeout(type, newTextDelay + 250);

    /* ==========================================
       Scroll Triggered Animations (Intersection Observer)
    ========================================== */
    const fadeUpElements = document.querySelectorAll('.fade-up');
    const progressBars = document.querySelectorAll('.progress');
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fade Up Elements
                if (entry.target.classList.contains('fade-up')) {
                    entry.target.classList.add('visible');
                }
                
                // Progress Bars Fill
                if (entry.target.querySelector('.progress')) {
                    const barsInside = entry.target.querySelectorAll('.progress');
                    barsInside.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                }
            }
        });
    }, observerOptions);

    fadeUpElements.forEach(el => scrollObserver.observe(el));
    
    // Also observe the skills containers separately to ensure progress bars animate
    document.querySelectorAll('.skill-category').forEach(el => scrollObserver.observe(el));

    /* ==========================================
       Number Counter Animation for Stats
    ========================================== */
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.about-stats');
    let counted = false;

    if(statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !counted) {
                counters.forEach(counter => {
                    counter.innerText = '0';
                    const updateCounter = () => {
                        const target = +counter.getAttribute('data-target');
                        const c = +counter.innerText;
                        
                        const increment = target / 50; // Speed adjustment
                        
                        if(c < target) {
                            counter.innerText = `${Math.ceil(c + increment)}`;
                            setTimeout(updateCounter, 30);
                        } else {
                            counter.innerText = target + "+";
                        }
                    };
                    updateCounter();
                });
                counted = true;
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    /* ==========================================
       Project Filtering
    ========================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hide');
                } else {
                    if (card.getAttribute('data-category').includes(filterValue)) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                }
            });
        });
    });

    /* ==========================================
       Magnetic Buttons (Bonus micro-interaction)
    ========================================== */
    const magnetics = document.querySelectorAll('.magnetic');
    
    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
            btn.children[0] ? btn.children[0].style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)` : null;
        });
        
        btn.addEventListener('mouseout', function(e) {
            btn.style.transform = 'translate(0px, 0px)';
            btn.children[0] ? btn.children[0].style.transform = 'translate(0px, 0px)' : null;
        });
    });

    /* ==========================================
       Contact Form Submission
    ========================================== */
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn span');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sending...';
            
            // Simulate API Call
            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                setTimeout(() => {
                    btn.innerText = originalText;
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

});
