document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('close-lightbox');
    const headerTitle = document.querySelector('header h1');
    const welcomeScreen = document.getElementById('welcome-screen');
    const enterBtn = document.getElementById('enter-btn');
    const header = document.querySelector('header');

    // Initial State: Scroll Lock & Hide Header/Gallery
    document.body.classList.add('scroll-lock');
    if (header) header.style.animationPlayState = 'paused';
    galleryItems.forEach(item => {
        item.classList.remove('reveal'); // Ensure transparency initially
        item.style.animationPlayState = 'paused';
    });

    // Enter Function
    enterBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        document.body.classList.remove('scroll-lock');

        // Delay animations slightly for smooth reveal
        setTimeout(() => {
            if (header) {
                header.style.opacity = '1'; // Ensure it's visible for animation
                header.style.animationPlayState = 'running';
                // Re-trigger text stagger if needed, or let it run
            }

            galleryItems.forEach((item, index) => {
                // Re-add class or trigger manually
                item.style.animationPlayState = 'running';
            });
        }, 500);
    });


    // 1. Text Stagger Animation
    if (headerTitle) {
        const text = headerTitle.textContent;
        headerTitle.textContent = '';
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char';
            span.style.animationDelay = `${index * 0.05}s`;
            headerTitle.appendChild(span);
        });
    }

    // 2. Scroll Reveal Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    galleryItems.forEach(item => {
        item.classList.add('reveal');
        observer.observe(item);
    });

    // 3. 3D Tilt Effect
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });

        // Keep Lightbox Click Logic
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('figcaption').textContent;

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = caption;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Lightbox Function
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });

    // 4. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverables = document.querySelectorAll('a, button, .gallery-item');

    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    // 5. Footer Reveal
    const footer = document.querySelector('footer');
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    if (footer) footerObserver.observe(footer);
    // 6. Magnetic Button Effect logic
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move the button text/content
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // 7. Parallax Header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Header Parallax
        if (headerTitle) {
            headerTitle.style.transform = `translateY(${scrolled * 0.4}px)`;
            headerTitle.style.opacity = 1 - (scrolled / 500);
        }
    });
});
