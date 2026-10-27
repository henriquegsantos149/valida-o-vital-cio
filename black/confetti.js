// Celebração breve na entrada, sem bloquear os controles do pop-up.
export function launchConfetti() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.setAttribute('popover', 'manual');
    const canvas = document.createElement('canvas');
    layer.append(canvas);
    document.body.append(layer);
    const ctx = canvas.getContext('2d');
    if (!ctx) { layer.remove(); return; }
    if (typeof layer.showPopover === 'function') layer.showPopover();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);
    const colors = ['#10b6c7', '#8ee322', '#f2cf00', '#ff7538', '#ed0068'];
    const gravity = height * .65;
    const pieces = Array.from({ length: width < 600 ? 80 : 140 }, (_, i) => {
        const fromLeft = i % 2 === 0;
        return {
            x: fromLeft ? 0 : width,
            y: height + 8,
            vx: (fromLeft ? 1 : -1) * width * (.035 + Math.random() * .48),
            vy: -Math.sqrt(2 * gravity * height * (.3 + Math.random() * .75)),
            delay: Math.random() * 220,
            angle: Math.random() * Math.PI,
            spin: (Math.random() - .5) * 12,
            size: 5 + Math.random() * 5,
            color: colors[i % colors.length]
        };
    });
    let frame;
    let previous;
    const start = performance.now();
    const cleanup = () => {
        cancelAnimationFrame(frame);
        layer.remove();
        document.removeEventListener('visibilitychange', onVisibility);
    };
    const onVisibility = () => { if (document.hidden) cleanup(); };
    document.addEventListener('visibilitychange', onVisibility);
    const animate = now => {
        const elapsed = now - start;
        if (elapsed >= 4500) { cleanup(); return; }
        const dt = Math.min((now - (previous ?? now)) / 1000, .05);
        previous = now;
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = Math.min(1, (4500 - elapsed) / 900);
        for (const piece of pieces) {
            if (elapsed < piece.delay) continue;
            piece.x += piece.vx * dt;
            piece.y += piece.vy * dt;
            piece.vy += gravity * dt;
            piece.vx *= Math.exp(-.12 * dt);
            piece.angle += piece.spin * dt;
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.angle);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
            ctx.restore();
        }
        frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
}
