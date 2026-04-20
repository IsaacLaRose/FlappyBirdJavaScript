const gridWidth = 50;
const gridHeight = 30;

let birdRow = 10;
let birdCol = 5;

let birdVel = 0;

let Gapmaximum = 9;
let Gapminimum = 4;
let Gapstar = 8;

let nextPipe = 0;

let scoreElement = document.getElementById("score");
let score = 0;
let scoredPipes = new Set();



let gameState = "waiting"; // "waiting", "playing", "gameover"
let gameStateElement = document.getElementById("gameState");


let pipes = [
    { col: 40, gapStart: 10, gapSize: 8 }
];


let gameElement = document.getElementById("game");



function draw(){//Creates grid/visuals
    let grid = [];

    //build the grid
    for (let r = 0; r < gridHeight; r++) {
        let row = [];
        for (let c = 0; c < gridWidth; c++) {
            row.push('.');
        }
        grid.push(row);
    }

    // draw pipes
    for (let pipe of pipes) {
        for (let r = 0; r < gridHeight; r++) {
            if (!(r >= pipe.gapStart && r < pipe.gapStart + pipe.gapSize)) {
                grid[r][pipe.col] = '|';
            }
        }
    }

    // bird
    grid[Math.round(birdRow)][birdCol] = "@";
    gameElement.textContent = grid.map(row => row.join('')).join('\n');
}

draw();


document.addEventListener('keydown', (e) => { //Jumping/flapping when pressing space
    if (e.code === 'Space') {

        if (gameState === "waiting") {
            resetGame();
            gameState = "playing";
        }

        if (gameState === "gameover") {
            resetGame();
            gameState = "playing";
        }

        if (gameState === "playing") {
            gameStateElement.textContent = "Game is Running!";
            birdVel = -2;
        }
    }
});


function resetGame() { //Reset Game Function
    birdRow = 10;
    birdVel = 0;
    pipes = [{ col: 40, gapStart: 10, gapSize: 8 }];
    score = 0;
    scoredPipes.clear();

    gameState = "waiting";
    gameStateElement.textContent = "Press Space to start!";
}


setInterval(() => {// Gamr Loop

    if (gameState === "waiting") {
        gameStateElement.textContent = "Press Space to start!";
        draw();
        return;
    }

    if (gameState === "gameover") { //Bird falls
        gameStateElement.textContent = "Game Over! Press Space to start!";

        birdVel += 0.5;
        birdRow += birdVel;

        if (birdRow >= gridHeight - 1) {
            birdRow = gridHeight - 1;
            birdVel = 0;
        }

        draw();
        return;
    }


    birdVel += 0.5;
    birdRow += birdVel;

    nextPipe = (nextPipe + 1) % 20;
    if (nextPipe === 0) {
        pipes.push({
            col: 50,
            gapStart: Math.floor(Math.random() * (gridHeight - Gapstar - 4)) + 2,
            gapSize: Math.floor(Math.random() * (Gapmaximum - Gapminimum) + Gapminimum)
        });
    }

    let crashed = false;

    for (let pipe of pipes) {
        pipe.col -= 1;

        if (pipe.col === birdCol) {
            let inGap =
                birdRow >= pipe.gapStart &&
                birdRow < pipe.gapStart + pipe.gapSize;

            if (!inGap) crashed = true;

            score++;
        }
    }

    if (birdRow <= 0 || birdRow >= gridHeight || crashed) {
        gameState = "gameover"; // GAME OVER
    }

    scoreElement.textContent = "Score = " + score;
    draw();

}, 100);



