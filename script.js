// ============================================
// ÂMBAR STUDIO - JavaScript Interativo
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // CURSOR PERSONALIZADO
    // ============================================
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            setTimeout(() => {
                cursorFollower.style.left = e.clientX - 16 + 'px';
                cursorFollower.style.top = e.clientY - 16 + 'px';
            }, 100);
        });

        const interactiveElements = document.querySelectorAll('a, button, .service-card, .carousel-btn, .dot');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }

    // ============================================
    // NAVEGAÇÃO SCROLL
    // ============================================
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // ============================================
    // SCROLL SUAVE
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // CARROSSEL DA GALERIA
    // ============================================
    const carousel = {
        track: document.querySelector('.carousel-track'),
        slides: document.querySelectorAll('.carousel-slide'),
        dots: document.querySelectorAll('.carousel-nav .dot'),
        prevBtn: document.querySelector('.carousel-btn.prev'),
        nextBtn: document.querySelector('.carousel-btn.next'),
        current: 0,
        autoplayInterval: null,

        init() {
            if (!this.track) return;
            this.prevBtn.addEventListener('click', () => this.prev());
            this.nextBtn.addEventListener('click', () => this.next());
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goTo(index));
            });

            let touchStartX = 0;
            this.track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
            this.track.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].screenX;
                if (diff > 50) this.next();
                if (diff < -50) this.prev();
            }, { passive: true });

            this.startAutoplay();
            this.track.addEventListener('mouseenter', () => this.stopAutoplay());
            this.track.addEventListener('mouseleave', () => this.startAutoplay());
        },

        update() {
            this.slides.forEach((slide, index) => slide.classList.toggle('active', index === this.current));
            this.dots.forEach((dot, index) => dot.classList.toggle('active', index === this.current));
        },

        next() { this.current = (this.current + 1) % this.slides.length; this.update(); },
        prev() { this.current = (this.current - 1 + this.slides.length) % this.slides.length; this.update(); },
        goTo(index) { this.current = index; this.update(); },

        startAutoplay() {
            this.stopAutoplay();
            this.autoplayInterval = setInterval(() => this.next(), 3000);
        },
        stopAutoplay() {
            if (this.autoplayInterval) { clearInterval(this.autoplayInterval); this.autoplayInterval = null; }
        }
    };

    carousel.init();

    // ============================================
    // CARROSSEL DE DEPOIMENTOS — COM AUTOPLAY
    // ============================================
    const testimonialCarousel = {
        track: document.querySelector('.testimonials .testimonial-track'),
        cards: document.querySelectorAll('.testimonials .testimonial-card'),
        dots: document.querySelectorAll('.testimonial-dots .dot'),
        prevBtn: document.querySelector('.testimonial-btn.prev'),
        nextBtn: document.querySelector('.testimonial-btn.next'),
        current: 0,
        autoplayInterval: null,

        init() {
            if (!this.track) return;
            this.prevBtn.addEventListener('click', () => { this.prev(); this.restartAutoplay(); });
            this.nextBtn.addEventListener('click', () => { this.next(); this.restartAutoplay(); });
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => { this.goTo(index); this.restartAutoplay(); });
            });

            let touchStartX = 0;
            this.track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
            this.track.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].screenX;
                if (diff > 50) { this.next(); this.restartAutoplay(); }
                if (diff < -50) { this.prev(); this.restartAutoplay(); }
            }, { passive: true });

            this.track.addEventListener('mouseenter', () => this.stopAutoplay());
            this.track.addEventListener('mouseleave', () => this.startAutoplay());

            this.update();
            this.startAutoplay();
        },

        update() {
            const offset = -this.current * 100;
            this.track.style.transform = `translateX(${offset}%)`;
            this.dots.forEach((dot, index) => dot.classList.toggle('active', index === this.current));
        },

        next() { this.current = (this.current + 1) % this.cards.length; this.update(); },
        prev() { this.current = (this.current - 1 + this.cards.length) % this.cards.length; this.update(); },
        goTo(index) { this.current = index; this.update(); },

        startAutoplay() {
            this.stopAutoplay();
            this.autoplayInterval = setInterval(() => this.next(), 5000);
        },
        stopAutoplay() {
            if (this.autoplayInterval) { clearInterval(this.autoplayInterval); this.autoplayInterval = null; }
        },
        restartAutoplay() {
            this.stopAutoplay();
            this.startAutoplay();
        }
    };

    testimonialCarousel.init();

    // ============================================
    // ANIMAÇÕES DE ENTRADA (SCROLL TRIGGER)
    // ============================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .about-img, .gallery-item').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // ============================================
    // PARALLAX SUAVE — APENAS DESKTOP
    // ============================================
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.innerWidth > 1024) {
                    const scrolled = window.scrollY;
                    document.querySelectorAll('.hero-visual, .about-visual').forEach(el => {
                        el.style.transform = `translateY(${-(scrolled * 0.5)}px)`;
                    });
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ============================================
    // EFEITO DE RIPPLE NOS BOTÕES
    // ============================================
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px; height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    const style = document.createElement('style');
    style.textContent = `@keyframes ripple { to { transform: scale(2); opacity: 0; } }`;
    document.head.appendChild(style);

    // ============================================
    // CARREGAMENTO SUAVE DE IMAGENS
    // ============================================
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                img.onload = () => { img.style.opacity = '1'; };
                img.setAttribute('src', img.getAttribute('src'));
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));

    // ============================================
    // CONTADOR ANIMADO
    // ============================================
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target.querySelector('.float-number');
                if (number && !number.classList.contains('animated')) {
                    number.classList.add('animated');
                    const target = parseInt(number.textContent);
                    let start = 0;
                    const increment = target / (2000 / 16);
                    const update = () => {
                        start += increment;
                        if (start < target) { number.textContent = Math.floor(start) + '+'; requestAnimationFrame(update); }
                        else { number.textContent = target + '+'; }
                    };
                    update();
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroFloatCard = document.querySelector('.hero-float-card.card-1');
    if (heroFloatCard) counterObserver.observe(heroFloatCard);

    // ============================================
    // DESTAQUE NA NAVEGAÇÃO ATIVA
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY > sectionTop && scrollY <= sectionTop + section.offsetHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + section.getAttribute('id')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { passive: true });

    console.log('✨ Âmbar Studio - Site carregado com sucesso!');
});

window.addEventListener('load', () => { document.body.classList.add('loaded'); });