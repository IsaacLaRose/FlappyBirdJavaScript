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


let gameState = "waiting"; // "waiting", "playing"

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
    birdVel = -2;
    gameState = "playing";
  }
});

setInterval(() => { //game loop
    
    if (gameState === "waiting") {
        return;
    }
    birdVel += 0.5; //gravity
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

        // ONLY check collision when bird is in same column
        if (pipe.col === birdCol) {
            let inGap =
                birdRow >= pipe.gapStart &&
                birdRow < pipe.gapStart + pipe.gapSize;

            if (!inGap) {
                crashed = true;
            }
            score++;
        }
    }

    // global game over check
    if (birdRow <= 0 || birdRow >= gridHeight || crashed) {
        alert("Game Over!");
        birdRow = 10;
        birdVel = 0;
        pipes = [{ col: 40, gapStart: 10, gapSize: 8 }];
        score = 0;
        scoredPipes = new Set();
        gameState = "waiting";
        return;
    }
        // if (pipe.col < 0) {
        //     pipe.col = 50;
        //     pipe.gapSize = Math.random() * (Gapmaximum - Gapminimum) + Gapminimum;
        //     pipe.gapStart = Math.floor(Math.random() * (gridHeight - pipe.gapSize - 4)) + 2;
        // }

    scoreElement.textContent = "Score = " + score;
    draw();
    
}, 100)



