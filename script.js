const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

canvas.width = window.innerWidth > 400 ? 400 : window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let gameActive = true;
let speed = 8;

// Lane Configuration
const lanes = [canvas.width / 6, canvas.width / 2, (canvas.width / 6) * 5];
let currentLane = 1; // Start in the middle lane

const obstacles = [];

// Hero Object
const hero = {
    x: lanes[currentLane],
    y: canvas.height - 120,
    size: 40
};

// Controls
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') moveHero(-1);
    if (e.key === 'ArrowRight' || e.key === 'd') moveHero(1);
});

// Mobile Swipe/Tap Logic
let touchStartX = 0;
window.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
window.addEventListener('touchend', e => {
    let touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) moveHero(-1);
    if (touchEndX - touchStartX > 50) moveHero(1);
});

function moveHero(dir) {
    currentLane += dir;
    if (currentLane < 0) currentLane = 0;
    if (currentLane > 2) currentLane = 2;
}

function spawnObstacle() {
    if (Math.random() < 0.03) {
        const laneIdx = Math.floor(Math.random() * 3);
        obstacles.push({
            x: lanes[laneIdx],
            y: -50,
            w: 50,
            h: 30
        });
    }
}

function update() {
    if (!gameActive) return;

    score++;
    scoreEl.innerText = Math.floor(score / 10);
    speed += 0.001; // Gradually gets faster

    // Interpolate hero movement for smoothness
    const targetX = lanes[currentLane];
    hero.x += (targetX - hero.x) * 0.2;

    obstacles.forEach((obs, i) => {
        obs.y += speed;

        // Collision Check
        if (Math.abs(hero.x - obs.x) < 30 && Math.abs(hero.y - obs.y) < 30) {
            gameActive = false;
            alert("The Guardian has fallen! Final Distance: " + Math.floor(score/10) + "m");
            location.reload();
        }

        if (obs.y > canvas.height) obstacles.splice(i, 1);
    });

    spawnObstacle();
}

function draw() {
    // Draw Road
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw Lane Markers
    ctx.strokeStyle = "#555";
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 3, 0); ctx.lineTo(canvas.width / 3, canvas.height);
    ctx.moveTo((canvas.width / 3) * 2, 0); ctx.lineTo((canvas.width / 3) * 2, canvas.height);
    ctx.stroke();

    // Draw Hero (Batman Icon)
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(hero.x, hero.y, hero.size/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(hero.x - 10, hero.y - 5, 20, 10); // Belt

    // Draw Obstacles
    ctx.fillStyle = "#ff4444";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x - 25, obs.y - 15, 50, 30);
    });

    update();
    requestAnimationFrame(draw);
}

draw();
