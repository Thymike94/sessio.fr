document.addEventListener('DOMContentLoaded', () => {
    
    // --- Data & Selectors ---
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lbImage = document.getElementById('lbImage');
    const lbCounter = document.getElementById('lbCounter');
    const closeBtn = document.getElementById('lbClose');
    const prevBtn = document.getElementById('lbPrev');
    const nextBtn = document.getElementById('lbNext');
    
    // Mobile carousel controls
    const galleryTrack = document.getElementById('galleryTrack');
    const galleryDotsContainer = document.getElementById('galleryDots');
    
    // Desktop gallery nav
    const deskPrev = document.getElementById('prevBtn');
    const deskNext = document.getElementById('nextBtn');

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(img => ({
        src: img.src,
        alt: img.alt
    }));

    // --- 1. Mobile Carousel Dots Logic ---
    // Create dots
    images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        galleryDotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // Update dots on scroll
    const updateDots = () => {
        const scrollLeft = galleryTrack.scrollLeft;
        const itemWidth = galleryTrack.offsetWidth * 0.8; // approx width based on CSS
        // Calculate rough index
        const index = Math.round(scrollLeft / (galleryTrack.scrollWidth / images.length));
        
        dots.forEach(d => d.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
    };

    galleryTrack.addEventListener('scroll', () => {
        // Debounce simple
        window.requestAnimationFrame(updateDots);
    });

    // --- 2. Desktop Gallery Navigation ---
    // Simple horizontal scroll for the grid container if it overflows (backup)
    // Or focus management for lightbox
    
    // Note: On desktop CSS grid applies, but we keep buttons if we switch mode later
    // or to open lightbox directly. For now, let's make desktop buttons open lightbox
    // or scroll if we kept the scroll layout. 
    // Given the prompt "Desktop: Galerie en grille", scroll buttons are less relevant 
    // for the grid itself, so let's use them to cycle the lightbox if open, 
    // OR scroll the view if we are on tablet size where grid might be 2 cols.
    
    // Let's make the "Previous/Next" buttons above gallery scroll the mobile view if visible
    if(deskPrev && deskNext) {
        deskPrev.addEventListener('click', () => {
            galleryTrack.scrollBy({ left: -300, behavior: 'smooth' });
        });
        deskNext.addEventListener('click', () => {
            galleryTrack.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

    // --- 3. Lightbox Logic ---

    const openLightbox = (index) => {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        // Accessibility focus
        closeBtn.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const updateLightbox = () => {
        const img = images[currentIndex];
        lbImage.src = img.src;
        lbImage.alt = img.alt;
        lbCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    };

    const showNext = () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    };

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    };

    // Event Listeners for Images
    galleryItems.forEach((item, index) => {
        item.closest('.gallery-item').addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Event Listeners for Controls
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard Nav
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // --- 4. Swipe Logic (Mobile) ---
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    const handleSwipe = () => {
        const threshold = 50; // min distance
        if (touchEndX < touchStartX - threshold) {
            showNext(); // Swipe Left -> Next
        }
        if (touchEndX > touchStartX + threshold) {
            showPrev(); // Swipe Right -> Prev
        }
    };
});
