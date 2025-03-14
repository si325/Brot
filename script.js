// Setup canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tombol
const jumpButton = document.getElementById("jumpButton");
const restartButton = document.getElementById("restartButton");

// Ukuran canvas
canvas.width = 400;
canvas.height = 500;

// Load gambar
const bgImage = new Image();
bgImage.src = "background.png";

const birdImage = new Image();
birdImage.src = "bird.png";

const pipeTopImage = new Image();
pipeTopImage.src = "pipe_top.png";

const pipeBottomImage = new Image();
pipeBottomImage.src = "pipe_bottom.png";

// Load suara
const jumpSound = new Audio("jump.mp3");
const hitSound = new Audio("hit.mp3");
const scoreSound = new Audio("score.mp3");
const bgMusic = new Audio("background-music.mp3");

// Atur musik agar loop terus
bgMusic.loop = true;
bgMusic.volume = 0.5; // Sesuaikan volume jika terlalu keras

// Variabel game
let bird, pipes, gameOver, score;

// Fungsi untuk inisialisasi game
function initGame() {
    bird = { 
        x: 50, 
        y: 250, 
        width: 45, 
        height: 35, 
        velocity: 0, 
        gravity: 0.3, // Gravitasi awal lebih ringan
        jump: -6 // Lompatan yang cukup nyaman
    };
    pipes = [];
    gameOver = false;
    score = 0;
    restartButton.style.display = "none"; // Sembunyikan tombol restart

    bgMusic.currentTime = 0; // Mulai musik dari awal
    bgMusic.play();

    requestAnimationFrame(update); // Memulai kembali loop update
}

// Fungsi untuk menggambar background
function drawBackground() {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

// Fungsi untuk menggambar burung
function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

// Fungsi untuk membuat pipa baru
function createPipe() {
    let pipeHeight = Math.random() * (canvas.height / 2);
    let gap = 160; // Jarak antara pipa atas & bawah

    pipes.push({ x: canvas.width, y: 0, width: 50, height: pipeHeight, type: "top" });
    pipes.push({ x: canvas.width, y: pipeHeight + gap, width: 50, height: canvas.height, type: "bottom" });
}

// Fungsi untuk menggambar pipa
function drawPipes() {
    pipes.forEach(pipe => {
        if (pipe.type === "top") {
            ctx.drawImage(pipeTopImage, pipe.x, pipe.y, pipe.width, pipe.height);
        } else {
            ctx.drawImage(pipeBottomImage, pipe.x, pipe.y, pipe.width, pipe.height);
        }
    });
}

// Fungsi untuk update game
function update() {
    if (!gameOver) {
        // Update posisi burung
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        // Update pipa
        pipes.forEach(pipe => pipe.x -= 2);

        // Tambahkan pipa baru setiap jarak tertentu
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 250) {
            createPipe();
        }

        // Hapus pipa yang keluar layar
        pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

        // Cek tabrakan dengan pipa
        pipes.forEach(pipe => {
            if (
                bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                bird.y < pipe.y + pipe.height &&
                bird.y + bird.height > pipe.y
            ) {
                if (!gameOver) {
                    gameOver = true;
                    bgMusic.pause(); // Hentikan musik latar
                    hitSound.play(); // Mainkan suara tabrakan
                    restartButton.style.display = "block"; // Tampilkan tombol restart
                }
            }
        });

        // Cek tabrakan dengan tanah atau langit
        if (bird.y < 0 || bird.y + bird.height > canvas.height) {
            if (!gameOver) {
                gameOver = true;
                bgMusic.pause(); // Hentikan musik latar
                hitSound.play(); // Mainkan suara tabrakan
                restartButton.style.display = "block"; // Tampilkan tombol restart
            }
        }

        // Update skor
        pipes.forEach((pipe, index) => {
            if (index % 2 === 0 && bird.x === pipe.x + pipe.width) {
                score++;
                scoreSound.play(); // Mainkan suara skor
            }
        });

        draw();
        requestAnimationFrame(update); // Memastikan loop terus berjalan
    }
}

// Fungsi untuk menggambar elemen game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(); // Gambar background dulu agar tidak tertimpa
    drawPipes();
    drawBird();

    // Tampilkan skor
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);

    // Jika game over
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", canvas.width / 4, canvas.height / 2);
        restartButton.style.display = "block";
    }
}

// Fungsi untuk melompat
function jump() {
    if (!gameOver) {
        jumpSound.play(); // Mainkan suara lompat
        bird.velocity = bird.jump;
    }
}

// Fungsi untuk mengulang game
function restartGame() {
    initGame();
}

// Event listener untuk keyboard (spasi/klik)
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        jump();
    }
});

// Event listener untuk tombol klik
jumpButton.addEventListener("click", jump);
restartButton.addEventListener("click", restartGame);

// Jalankan game
initGame();