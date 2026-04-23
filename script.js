// ===== StarMap - Interactive Constellation Explorer =====

const constellations = [
    {
        name: 'Orion', meaning: 'The Hunter',
        desc: 'One of the most recognizable constellations in the night sky, Orion has been used by navigators and ancient cultures for thousands of years.',
        stars: [ {x:0.42,y:0.35},{x:0.45,y:0.38},{x:0.48,y:0.35},{x:0.44,y:0.42},{x:0.46,y:0.42},{x:0.40,y:0.48},{x:0.50,y:0.48} ],
        lines: [[0,1],[1,2],[1,3],[1,4],[3,5],[4,6]],
        numStars: 7, season: 'Winter', magnitude: '0.12',
        fact: '✨ Betelgeuse, Orion\'s shoulder star, is a red supergiant 700× the size of our Sun and may explode as a supernova within the next 100,000 years.'
    },
    {
        name: 'Ursa Major', meaning: 'The Great Bear',
        desc: 'Contains the famous Big Dipper asterism. It has been used for navigation for centuries as its pointer stars lead to Polaris.',
        stars: [ {x:0.25,y:0.22},{x:0.28,y:0.20},{x:0.32,y:0.19},{x:0.35,y:0.21},{x:0.36,y:0.25},{x:0.33,y:0.28},{x:0.30,y:0.27} ],
        lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],
        numStars: 7, season: 'Spring', magnitude: '1.79',
        fact: '🐻 The two stars at the end of the "bowl" of the Big Dipper point directly to Polaris, the North Star.'
    },
    {
        name: 'Scorpius', meaning: 'The Scorpion',
        desc: 'A brilliant constellation of the southern sky, featuring the red supergiant Antares at its heart.',
        stars: [ {x:0.62,y:0.55},{x:0.64,y:0.58},{x:0.65,y:0.62},{x:0.63,y:0.66},{x:0.60,y:0.69},{x:0.58,y:0.72},{x:0.60,y:0.75},{x:0.63,y:0.73} ],
        lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[5,7]],
        numStars: 8, season: 'Summer', magnitude: '0.96',
        fact: '🦂 Antares, the heart of Scorpius, means "rival of Mars" because of its distinctive red color.'
    },
    {
        name: 'Cassiopeia', meaning: 'The Queen',
        desc: 'Known for its distinctive W shape, Cassiopeia is easily visible in the Northern sky and never sets below the horizon from mid-northern latitudes.',
        stars: [ {x:0.72,y:0.18},{x:0.75,y:0.14},{x:0.78,y:0.17},{x:0.81,y:0.13},{x:0.84,y:0.16} ],
        lines: [[0,1],[1,2],[2,3],[3,4]],
        numStars: 5, season: 'Autumn', magnitude: '2.24',
        fact: '👑 In Greek mythology, Cassiopeia was a vain queen who boasted about her beauty, angering Poseidon.'
    },
    {
        name: 'Leo', meaning: 'The Lion',
        desc: 'One of the zodiac constellations, Leo represents the Nemean lion slain by Hercules. Regulus, the "little king," marks its heart.',
        stars: [ {x:0.15,y:0.55},{x:0.18,y:0.52},{x:0.22,y:0.50},{x:0.20,y:0.56},{x:0.24,y:0.55},{x:0.27,y:0.52} ],
        lines: [[0,1],[1,2],[1,3],[3,4],[4,5],[2,5]],
        numStars: 6, season: 'Spring', magnitude: '1.35',
        fact: '🦁 The Leonid meteor shower, visible every November, originates from the direction of Leo.'
    },
    {
        name: 'Cygnus', meaning: 'The Swan',
        desc: 'Also known as the Northern Cross, Cygnus flies along the Milky Way. Deneb is its brightest star and one of the most luminous known.',
        stars: [ {x:0.55,y:0.15},{x:0.55,y:0.20},{x:0.52,y:0.23},{x:0.58,y:0.23},{x:0.55,y:0.28} ],
        lines: [[0,1],[1,4],[1,2],[1,3]],
        numStars: 5, season: 'Summer', magnitude: '1.25',
        fact: '🦢 Cygnus X-1, located in this constellation, was one of the first widely accepted black hole candidates.'
    },
    {
        name: 'Lyra', meaning: 'The Lyre',
        desc: 'A small but prominent constellation featuring Vega, the 5th brightest star in the sky and once our North Star ~12,000 years ago.',
        stars: [ {x:0.50,y:0.30},{x:0.48,y:0.34},{x:0.52,y:0.34},{x:0.47,y:0.38},{x:0.53,y:0.38} ],
        lines: [[0,1],[0,2],[1,3],[2,4],[3,4]],
        numStars: 5, season: 'Summer', magnitude: '0.03',
        fact: '🎵 Vega was the first star (other than the Sun) to be photographed, in 1850.'
    },
    {
        name: 'Aquarius', meaning: 'The Water Bearer',
        desc: 'An ancient zodiac constellation representing Ganymede, the cup-bearer of the gods. Contains several notable deep-sky objects.',
        stars: [ {x:0.82,y:0.40},{x:0.85,y:0.38},{x:0.88,y:0.40},{x:0.84,y:0.44},{x:0.87,y:0.46},{x:0.83,y:0.50},{x:0.86,y:0.52} ],
        lines: [[0,1],[1,2],[1,3],[3,4],[3,5],[5,6]],
        numStars: 7, season: 'Autumn', magnitude: '2.91',
        fact: '♒ The Age of Aquarius, popularized by the musical "Hair," refers to a precession cycle lasting about 2,160 years.'
    }
];

let canvas, ctx;
let viewOffset = { x: 0, y: 0 };
let viewScale = 1;
let showLines = true;
let showNames = true;
let animFrame;
let bgStars = [];
let selectedConstellation = null;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let lastOffset = { x: 0, y: 0 };
let audioPlaying = false;

const bgAudio = document.getElementById('bg-audio');

function init() {
    canvas = document.getElementById('star-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();

    // Generate background stars
    for (let i = 0; i < 400; i++) {
        bgStars.push({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 1.8 + 0.3,
            alpha: Math.random() * 0.7 + 0.3,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }

    // Build constellation list
    const list = document.getElementById('const-list-items');
    constellations.forEach((c, i) => {
        const li = document.createElement('li');
        li.textContent = c.name;
        li.addEventListener('click', () => focusConstellation(i));
        list.appendChild(li);
    });

    animate();
    setupInteractions();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function worldToScreen(wx, wy) {
    return {
        x: (wx + viewOffset.x) * viewScale * canvas.width,
        y: (wy + viewOffset.y) * viewScale * canvas.height
    };
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gradient background
    const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width * 0.7);
    grad.addColorStop(0, '#0a0a20');
    grad.addColorStop(0.5, '#060612');
    grad.addColorStop(1, '#020208');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() * 0.001;

    // Background stars with twinkling
    bgStars.forEach(s => {
        const pos = worldToScreen(s.x, s.y);
        const alpha = s.alpha * (0.6 + 0.4 * Math.sin(time * s.twinkleSpeed * 60 + s.twinklePhase));
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, s.size * viewScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
        ctx.fill();
    });

    // Draw constellations
    constellations.forEach((c, ci) => {
        const isSelected = selectedConstellation === ci;
        const starColor = isSelected ? '#ffd700' : '#88c0ff';
        const lineAlpha = isSelected ? 0.6 : 0.15;
        const starSize = isSelected ? 4 : 2.5;

        // Lines
        if (showLines) {
            c.lines.forEach(([a, b]) => {
                const pa = worldToScreen(c.stars[a].x, c.stars[a].y);
                const pb = worldToScreen(c.stars[b].x, c.stars[b].y);
                ctx.beginPath();
                ctx.moveTo(pa.x, pa.y);
                ctx.lineTo(pb.x, pb.y);
                ctx.strokeStyle = isSelected
                    ? `rgba(255, 215, 0, ${lineAlpha})`
                    : `rgba(136, 192, 255, ${lineAlpha})`;
                ctx.lineWidth = isSelected ? 2 : 1;
                ctx.stroke();
            });
        }

        // Stars
        c.stars.forEach((s, si) => {
            const pos = worldToScreen(s.x, s.y);
            const pulse = isSelected ? 1 + 0.2 * Math.sin(time * 3 + si) : 1;

            // Glow
            const glowGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, starSize * 4 * pulse * viewScale);
            glowGrad.addColorStop(0, isSelected ? 'rgba(255, 215, 0, 0.3)' : 'rgba(136, 192, 255, 0.2)');
            glowGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, starSize * 4 * pulse * viewScale, 0, Math.PI * 2);
            ctx.fillStyle = glowGrad;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, starSize * pulse * viewScale, 0, Math.PI * 2);
            ctx.fillStyle = starColor;
            ctx.fill();
        });

        // Name label
        if (showNames) {
            const center = getCenterOfConstellation(c);
            const pos = worldToScreen(center.x, center.y - 0.03);
            ctx.font = `${isSelected ? '600' : '400'} ${(isSelected ? 14 : 11) * viewScale}px 'Space Grotesk', sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = isSelected ? 'rgba(255, 215, 0, 0.9)' : 'rgba(200, 210, 255, 0.4)';
            ctx.fillText(c.name, pos.x, pos.y);
        }
    });

    animFrame = requestAnimationFrame(animate);
}

function getCenterOfConstellation(c) {
    let cx = 0, cy = 0;
    c.stars.forEach(s => { cx += s.x; cy += s.y; });
    return { x: cx / c.stars.length, y: cy / c.stars.length };
}

function focusConstellation(index) {
    selectedConstellation = index;
    const c = constellations[index];
    const center = getCenterOfConstellation(c);

    viewOffset.x = 0.5 - center.x;
    viewOffset.y = 0.5 - center.y;
    viewScale = 1.5;

    // Update info panel
    document.getElementById('const-name').textContent = c.name;
    document.getElementById('const-meaning').textContent = c.meaning;
    document.getElementById('const-desc').textContent = c.desc;
    document.getElementById('const-stars').textContent = c.numStars;
    document.getElementById('const-season').textContent = c.season;
    document.getElementById('const-mag').textContent = c.magnitude;
    document.getElementById('fun-fact').textContent = c.fact;
    document.getElementById('info-panel').classList.remove('hidden');

    // Update list
    document.querySelectorAll('#const-list-items li').forEach((li, i) => {
        li.classList.toggle('active', i === index);
    });
}

function setupInteractions() {
    // Drag to pan
    canvas.addEventListener('pointerdown', (e) => {
        isDragging = true;
        dragStart = { x: e.clientX, y: e.clientY };
        lastOffset = { ...viewOffset };
        canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = (e.clientX - dragStart.x) / canvas.width / viewScale;
        const dy = (e.clientY - dragStart.y) / canvas.height / viewScale;
        viewOffset.x = lastOffset.x + dx;
        viewOffset.y = lastOffset.y + dy;
    });

    canvas.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;

        // Check if it was a click (not drag)
        const dx = Math.abs(e.clientX - dragStart.x);
        const dy = Math.abs(e.clientY - dragStart.y);
        if (dx < 5 && dy < 5) {
            handleStarClick(e.clientX, e.clientY);
        }
    });

    // Scroll to zoom
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        viewScale = Math.max(0.5, Math.min(4, viewScale * zoomFactor));
    }, { passive: false });

    // Pinch zoom for mobile
    let lastPinchDist = 0;
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastPinchDist = Math.sqrt(dx * dx + dy * dy);
        }
    });
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const scale = dist / lastPinchDist;
            viewScale = Math.max(0.5, Math.min(4, viewScale * scale));
            lastPinchDist = dist;
        }
    });

    // Controls
    document.getElementById('close-panel').addEventListener('click', () => {
        document.getElementById('info-panel').classList.add('hidden');
        selectedConstellation = null;
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
        viewOffset = { x: 0, y: 0 };
        viewScale = 1;
        selectedConstellation = null;
        document.getElementById('info-panel').classList.add('hidden');
    });

    document.getElementById('btn-lines').addEventListener('click', function() {
        showLines = !showLines;
        this.classList.toggle('active');
    });

    document.getElementById('btn-names').addEventListener('click', function() {
        showNames = !showNames;
        this.classList.toggle('active');
    });

    document.getElementById('btn-audio').addEventListener('click', function() {
        if (audioPlaying) {
            bgAudio.pause();
            this.textContent = '🔇';
        } else {
            bgAudio.volume = 0.3;
            bgAudio.play().catch(() => {});
            this.textContent = '🔊';
        }
        audioPlaying = !audioPlaying;
        this.classList.toggle('active');
    });

    window.addEventListener('resize', resizeCanvas);
}

function handleStarClick(mx, my) {
    // Check if click is near any constellation star
    let closestDist = Infinity;
    let closestIdx = -1;

    constellations.forEach((c, ci) => {
        c.stars.forEach(s => {
            const pos = worldToScreen(s.x, s.y);
            const dx = mx - pos.x;
            const dy = my - pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 30 && dist < closestDist) {
                closestDist = dist;
                closestIdx = ci;
            }
        });
    });

    if (closestIdx >= 0) {
        focusConstellation(closestIdx);
    }
}

// Start
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('intro-screen').classList.remove('active');
    document.getElementById('controls').classList.remove('hidden');
    document.getElementById('const-list').classList.remove('hidden');
    bgAudio.volume = 0.3;
    bgAudio.play().then(() => {
        audioPlaying = true;
        document.getElementById('btn-audio').textContent = '🔊';
        document.getElementById('btn-audio').classList.add('active');
    }).catch(() => {});
});

init();
