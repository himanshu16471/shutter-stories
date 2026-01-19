document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('close-lightbox');
    const headerTitle = document.querySelector('header h1');

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
});
