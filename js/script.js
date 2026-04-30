/* ============================================
   NeuroMotion Sports Rehab — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ====== NAVBAR scroll effect ======
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ====== Mobile menu toggle ======
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // ====== Smooth scroll offset for fixed navbar ======
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 70;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ====== Footer year ======
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ====== Reveal on scroll ======
    const revealElements = document.querySelectorAll(
        '.service-card, .gallery-item, .contact-card, .about-image, .about-text, .section-header'
    );
    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));

    // ====== Lightbox for gallery ======
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(img => ({
        src: img.src,
        alt: img.alt
    }));

    const showImage = (index) => {
        currentIndex = (index + images.length) % images.length;
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
    };

    galleryItems.forEach((img, index) => {
        img.parentElement.addEventListener('click', () => {
            showImage(index);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });

    // ====== Logos carousel: drag (mouse + touch nativo) + auto-scroll ======
    const carousel = document.querySelector('.logos-carousel');
    const track = document.querySelector('.logos-track');

    if (carousel && track) {
        // Clonar items hasta que el track tenga al menos 4x el ancho del viewport
        const originalItems = Array.from(track.children);
        const ensureWidth = () => {
            const target = window.innerWidth * 4;
            while (track.scrollWidth < target) {
                originalItems.forEach(item => track.appendChild(item.cloneNode(true)));
            }
        };
        ensureWidth();
        window.addEventListener('resize', ensureWidth);

        // Auto-scroll continuo
        let autoScroll = true;
        const speed = 0.5; // px por frame (~30px/s a 60fps)
        let resumeTimer;
        let accumulated = 0;

        const tick = () => {
            if (autoScroll && !isDragging) {
                accumulated += speed;
                if (accumulated >= 1) {
                    const step = Math.floor(accumulated);
                    carousel.scrollLeft += step;
                    accumulated -= step;
                }
                // Loop: cuando pasamos la mitad del track, regresamos sin que se note
                const loopPoint = track.scrollWidth / 2;
                if (carousel.scrollLeft >= loopPoint) {
                    carousel.scrollLeft -= loopPoint;
                }
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

        const pauseAuto = () => {
            autoScroll = false;
            clearTimeout(resumeTimer);
        };
        const resumeAutoSoon = (ms = 1500) => {
            clearTimeout(resumeTimer);
            resumeTimer = setTimeout(() => { autoScroll = true; }, ms);
        };

        carousel.addEventListener('mouseenter', pauseAuto);
        carousel.addEventListener('mouseleave', () => { autoScroll = true; });

        // Touch nativo en móvil (overflow-x:auto ya da swipe)
        carousel.addEventListener('touchstart', pauseAuto, { passive: true });
        carousel.addEventListener('touchend', () => resumeAutoSoon(2000), { passive: true });

        // Drag con mouse en escritorio
        let isDragging = false;
        let startX = 0;
        let startScroll = 0;

        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            carousel.classList.add('dragging');
            startX = e.pageX;
            startScroll = carousel.scrollLeft;
            pauseAuto();
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.pageX - startX;
            carousel.scrollLeft = startScroll - dx;
        });

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            carousel.classList.remove('dragging');
            resumeAutoSoon(1500);
        };
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('mouseleave', endDrag);
    }

});
