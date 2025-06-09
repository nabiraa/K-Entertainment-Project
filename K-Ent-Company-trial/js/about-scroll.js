document.addEventListener('DOMContentLoaded', () => {
    const aboutSections = document.querySelectorAll('.about-section');

    const checkVisibility = () => {
        aboutSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;

            // If the section is within 70% of the viewport height
            if (sectionTop < screenHeight * 0.75) {
                section.classList.add('visible');
            } else {
                // Optional: remove 'visible' if scrolling back up
                // section.classList.remove('visible');
            }
        });
    };

    // Initial check on load
    checkVisibility();

    // Check on scroll
    window.addEventListener('scroll', checkVisibility);
});