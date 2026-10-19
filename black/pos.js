document.querySelectorAll('.btn-more').forEach((button, index) => {
    const details = button.nextElementSibling;
    details.id = `course-details-${index}`;
    button.setAttribute('aria-controls', details.id);
    button.addEventListener('click', () => {
        const expanded = details.classList.toggle('active');
        button.setAttribute('aria-expanded', String(expanded));
        button.textContent = expanded ? 'Menos informações' : 'Saiba mais';
    });
});
document.querySelectorAll('.carousel-btn').forEach(button => {
    button.addEventListener('click', () => {
        const track = button.closest('.carousel-container').querySelector('.faculty-avatars');
        track.scrollBy({left: (button.classList.contains('prev-btn') ? -1 : 1) * track.clientWidth * 0.8, behavior: 'smooth'});
    });
});
