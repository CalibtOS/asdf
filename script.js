const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const size = 100; // grid size
const cellSize = canvas.width / size;
let running = false;
let board = createBoard();
let nextBoard = createBoard();

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

function step() {
    if (!running) return;
    computeNext();
    drawBoard();
    requestAnimationFrame(step);
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    board[y][x] = board[y][x] ? 0 : 1;
    drawBoard();
});

document.getElementById('start').addEventListener('click', () => {
    if (!running) {
        running = true;
        requestAnimationFrame(step);
    }
});

document.getElementById('stop').addEventListener('click', () => {
    running = false;
});

document.getElementById('clear').addEventListener('click', () => {
    running = false;
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

drawBoard();
