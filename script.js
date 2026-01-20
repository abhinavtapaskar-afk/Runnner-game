const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

canvas.width = 400;
canvas.height = 600;

let score = 0;
let gameActive = true;

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    width: 50,
    height: 50,
    speed: 7,
    color: '#1a1a1a' // Batman Black
};

const items = [];
const itemFrequency = 0.02;

function createItem() {
    if (Math.random() < itemFrequency) {
        items.push({
            x: Math.random() * (canvas.width - 20),
            y: -20,
            size: 20,
            speed: 3 + Math.random() * 2,
            color: '#ffcc00' // Golden dog food
        });
    }
}

function update() {
    if (!gameActive) return;

    // Move Player
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;

    // Boundary Check
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

    // Move Items
    for (let i = items.length - 1; i >= 0; i--) {
        items[i].y += items[i].speed;

        // Collision Detection
        if (
            items[i].x < player.x + player.width &&
            items[i].x + items[i].size > player.x &&
            items[i].y < player.y + player.height &&
            items[i].y + items[i].size > player.y
        ) {
            items.splice(i, 1);
            score++;
            scoreElement.innerText = score;
        } else if (items[i].y > canvas.height) {
            items.splice(i, 1);
        }
    }
    createItem();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Hero (Simple Batman Shape)
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "#ffcc00"; // Bat-logo color
    ctx.fillRect(player.x + 15, player.y + 15, 20, 10);

    // Draw Items
    items.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size/2, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

draw();
