const gridWidth = 50;
const gridHeight = 30;

let birdRow = 10;
let birdCol = 5;

let birdVel = 0;

let Gapmaximum = 9;
let Gapminimum = 4;
let Gapstar = 8;

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
  }
});

setInterval(() => { //game loop
    birdVel += 0.5; //gravity
    birdRow += birdVel;
    for (let pipe of pipes) {
        pipe.col -= 1;
        if (pipe.col < 0) {
            pipe.col = 50;
            pipe.gapSize = Math.random() * (Gapmaximum - Gapminimum) + Gapminimum;
            pipe.gapStart = Math.floor(Math.random() * (gridHeight - pipe.gapSize - 4)) + 2;
        }
    }
    draw();
}, 100)



