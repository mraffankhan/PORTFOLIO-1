document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Hover effects for cursor
    const hoverables = document.querySelectorAll('a, button, .project-item');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.mixBlendMode = 'difference';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal-text, .reveal-up');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Populate Marquees
    const marqueeContents = document.querySelectorAll('.marquee-content');

    marqueeContents.forEach(content => {
        const parent = content.parentElement;
        const isVertical = parent.classList.contains('vertical');
        const repeatCount = isVertical ? 20 : 10; // More items for vertical to fill height

        let html = '';
        for (let i = 0; i < repeatCount; i++) {
            html += '<span>KHAN</span>';
        }
        content.innerHTML = html;
    });
    // Parallax Scroll Animation
    let parallaxItems = [];

    function initParallax() {
        parallaxItems = [];
        document.querySelectorAll('[data-speed]').forEach(el => {
            // Reset transform to get accurate position
            el.style.setProperty('--scroll-y', '0px');
            const rect = el.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;

            parallaxItems.push({
                el: el,
                speed: parseFloat(el.getAttribute('data-speed')),
                initialTop: absoluteTop
            });
        });
    }

    function updateParallax() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        parallaxItems.forEach(item => {
            // Check if item is roughly in view to optimize
            // Use a generous buffer
            if (scrollY + windowHeight > item.initialTop - 200 && scrollY < item.initialTop + windowHeight + 200) {
                // Calculate offset: 
                // When scrollY == item.initialTop (element is at top of screen), offset is 0?
                // Or when element is in center?

                // Let's anchor it to the viewport center for natural feel
                const viewportCenter = scrollY + windowHeight / 2;
                const elementCenter = item.initialTop + (item.el.offsetHeight / 2);

                // Difference determines movement
                const offset = (elementCenter - viewportCenter) * item.speed;

                item.el.style.setProperty('--scroll-y', `${offset}px`);
            }
        });
    }

    // Initialize
    initParallax();

    // Scroll Loop
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        initParallax();
        updateParallax();
    });
});
