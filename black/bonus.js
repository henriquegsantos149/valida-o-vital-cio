const dialog = document.getElementById('enrollment-bonus');
const deadline = Date.parse('2026-10-29T21:00:00-03:00');

if (dialog && Date.now() < deadline) {
    const previousFocus = document.activeElement;
    const closeBonus = () => dialog.close();
    dialog.querySelector('.bonus-close').addEventListener('click', closeBonus);
    dialog.querySelector('.bonus-dismiss').addEventListener('click', closeBonus);
    dialog.querySelector('.bonus-cta').addEventListener('click', event => {
        event.preventDefault();
        dialog.close();
        document.getElementById('step-1')?.scrollIntoView({
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
    });
    dialog.addEventListener('click', event => {
        const rect = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom)) closeBonus();
    });
    dialog.addEventListener('close', () => {
        document.documentElement.classList.remove('bonus-open');
        previousFocus?.focus({ preventScroll: true });
        clearInterval(expirationTimer);
    }, { once: true });
    const expirationTimer = setInterval(() => {
        if (Date.now() >= deadline) closeBonus();
    }, 1000);
    document.documentElement.classList.add('bonus-open');
    dialog.showModal();
}
