const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const size = 100; // grid size
const cellSize = canvas.width / size;
let board = createBoard();
let nextBoard = createBoard();
let timer = null;
let interval = 200; // ms per generation

function createBoard() {
    const arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = new Array(size).fill(0);
    }
    return arr;
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (board[y][x]) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function computeNext() {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let neighbors = 0;
            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    if (i === 0 && j === 0) continue;
                    const ny = y + j;
                    const nx = x + i;
                    if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
                        neighbors += board[ny][nx];
                    }
                }
            }
            nextBoard[y][x] = board[y][x];
            if (board[y][x]) {
                if (neighbors < 2 || neighbors > 3) nextBoard[y][x] = 0;
            } else {
                if (neighbors === 3) nextBoard[y][x] = 1;
            }
        }
    }
    [board, nextBoard] = [nextBoard, board];
}

function startGame() {
    if (!timer) {
        timer = setInterval(() => {
            computeNext();
            drawBoard();
        }, interval);
    }
}

function stopGame() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function stepOnce() {
    computeNext();
    drawBoard();
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    board[y][x] = board[y][x] ? 0 : 1;
    drawBoard();
});

document.getElementById('start').addEventListener('click', startGame);
document.getElementById('stop').addEventListener('click', stopGame);
document.getElementById('step').addEventListener('click', stepOnce);

document.getElementById('clear').addEventListener('click', () => {
    stopGame();
    board = createBoard();
    drawBoard();
});

document.getElementById('random').addEventListener('click', () => {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            board[y][x] = Math.random() > 0.8 ? 1 : 0;
        }
    }
    drawBoard();
});

document.getElementById('speed').addEventListener('input', (e) => {
    interval = Number(e.target.value);
    if (timer) {
        stopGame();
        startGame();
    }
});

drawBoard();
