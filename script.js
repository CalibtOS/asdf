const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
let rows = 100;
let cols = 100;
let cellSize = canvas.width / cols;
let board = createBoard();
let nextBoard = createBoard();
let timer = null;
let interval = 200; // ms per generation

function initBoard() {
    rows = Number(document.getElementById('rows').value);
    cols = Number(document.getElementById('cols').value);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientWidth;
    cellSize = canvas.width / cols;
    board = createBoard();
    nextBoard = createBoard();
    drawBoard();
}

function createBoard() {
    const arr = new Array(rows);
    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(cols).fill(0);
    }
    return arr;
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (board[y][x]) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function computeNext() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let neighbors = 0;
            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    if (i === 0 && j === 0) continue;
                    const ny = y + j;
                    const nx = x + i;
                    if (ny >= 0 && ny < rows && nx >= 0 && nx < cols) {
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

document.getElementById('rows').addEventListener('change', initBoard);
document.getElementById('cols').addEventListener('change', initBoard);

document.getElementById('start').addEventListener('click', startGame);
document.getElementById('stop').addEventListener('click', stopGame);
document.getElementById('step').addEventListener('click', stepOnce);

document.getElementById('clear').addEventListener('click', () => {
    stopGame();
    board = createBoard();
    nextBoard = createBoard();
    drawBoard();
});

document.getElementById('random').addEventListener('click', () => {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            board[y][x] = Math.random() > 0.8 ? 1 : 0;
        }
    }
    drawBoard();
});

document.getElementById('export').addEventListener('click', () => {
    const data = JSON.stringify({ rows, cols, board });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-of-life.json';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('import').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            document.getElementById('rows').value = data.rows;
            document.getElementById('cols').value = data.cols;
            initBoard();
            for (let y = 0; y < Math.min(rows, data.rows); y++) {
                for (let x = 0; x < Math.min(cols, data.cols); x++) {
                    board[y][x] = data.board[y][x];
                }
            }
            drawBoard();
        } catch (err) {
            alert('Invalid file');
        }
    };
    reader.readAsText(file);
});

document.getElementById('info').addEventListener('click', () => {
    document.getElementById('overlay').classList.remove('hidden');
});

document.getElementById('close').addEventListener('click', () => {
    document.getElementById('overlay').classList.add('hidden');
});

document.getElementById('speed').addEventListener('input', (e) => {
    interval = Number(e.target.value);
    if (timer) {
        stopGame();
        startGame();
    }
});

initBoard();
