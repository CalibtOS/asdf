class Game {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.board = this.createBoard(rows, cols);
        this.lastBoard = null;
        this.futureBoard = this.createBoard(rows, cols);
    }

    createBoard(r = this.rows, c = this.cols) {
        const arr = new Array(r);
        for (let i = 0; i < r; i++) {
            arr[i] = new Array(c).fill(0);
        }
        return arr;
    }

    cloneBoard(board) {
        return board.map(row => row.slice());
    }

    computeNext(base) {
        const next = this.createBoard();
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let neighbors = 0;
                for (let j = -1; j <= 1; j++) {
                    for (let i = -1; i <= 1; i++) {
                        if (i === 0 && j === 0) continue;
                        const ny = y + j;
                        const nx = x + i;
                        if (ny >= 0 && ny < this.rows && nx >= 0 && nx < this.cols) {
                            neighbors += base[ny][nx];
                        }
                    }
                }
                next[y][x] = base[y][x];
                if (base[y][x]) {
                    if (neighbors < 2 || neighbors > 3) next[y][x] = 0;
                } else {
                    if (neighbors === 3) next[y][x] = 1;
                }
            }
        }
        return next;
    }

    step() {
        this.lastBoard = this.cloneBoard(this.board);
        this.board = this.computeNext(this.board);
        this.futureBoard = this.computeNext(this.board);
    }

    back() {
        if (!this.lastBoard) return false;
        this.board = this.lastBoard;
        this.lastBoard = null;
        this.futureBoard = this.computeNext(this.board);
        return true;
    }

    clear() {
        this.board = this.createBoard();
        this.futureBoard = this.createBoard();
        this.lastBoard = null;
    }

    randomize() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.board[y][x] = Math.random() > 0.8 ? 1 : 0;
            }
        }
        this.futureBoard = this.computeNext(this.board);
    }
}

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close');
const backBtn = document.getElementById('back');
const playBtn = document.getElementById('play');
const playIcon = playBtn.querySelector('.icon');
const playText = playBtn.querySelector('.text');
const themeBtn = document.getElementById('theme');
const themeIcon = themeBtn.querySelector('.icon');

// Burger menu elements
const burgerToggle = document.getElementById('burger-toggle');
const burgerDropdown = document.getElementById('burger-dropdown');

function borderColor() {
    return getComputedStyle(document.body).getPropertyValue('--border').trim();
}

function emptyColor() {
    return getComputedStyle(document.body).getPropertyValue('--cell-empty').trim();
}

function corpseColor() {
    return getComputedStyle(document.body).getPropertyValue('--cell-corpse').trim();
}

function applyTheme(dark) {
    document.body.classList.toggle('dark', dark);
    const burgerTheme = document.getElementById('burger-theme');
    if (dark) {
        themeBtn.classList.remove('light');
        themeBtn.classList.add('dark');
        themeIcon.textContent = '☀️';
        // Update burger menu theme button
        burgerTheme.innerHTML = '<span class="icon">☀️</span> Theme';
        burgerTheme.classList.remove('light');
        burgerTheme.classList.add('dark');
    } else {
        themeBtn.classList.remove('dark');
        themeBtn.classList.add('light');
        themeIcon.textContent = '🌙';
        // Update burger menu theme button
        burgerTheme.innerHTML = '<span class="icon">🌙</span> Theme';
        burgerTheme.classList.remove('dark');
        burgerTheme.classList.add('light');
    }
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(prefersDark);

themeBtn.addEventListener('click', () => {
    applyTheme(!document.body.classList.contains('dark'));
    drawBoard();
});

let interval = 200;
let timer = null;
let game = new Game(50, 50);
let cellSize = canvas.width / game.cols;

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientWidth;
    cellSize = canvas.width / game.cols;
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const empty = emptyColor();
    const corpse = corpseColor();
    for (let y = 0; y < game.rows; y++) {
        for (let x = 0; x < game.cols; x++) {
            let color = empty;
            const current = game.board[y][x];
            const previous = game.lastBoard ? game.lastBoard[y][x] : 0;
            const next = game.futureBoard[y][x];
            if (current) {
                if (!previous) {
                    color = 'blue'; // newly born
                } else if (next === 0) {
                    color = 'red'; // about to die
                } else {
                    color = 'green'; // surviving
                }
            } else if (previous) {
                color = corpse; // corpse
            }
            ctx.fillStyle = color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            ctx.strokeStyle = borderColor();
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
    if (timer) {
        backBtn.disabled = true;
    } else {
        backBtn.disabled = !game.lastBoard;
    }
    updateBurgerBackButton();
}

function initBoard() {
    const r = Number(document.getElementById('rows').value);
    const c = Number(document.getElementById('cols').value);
    game = new Game(r, c);
    resizeCanvas();
    drawBoard();
}

function stepOnce() {
    game.step();
    drawBoard();
}

function backOnce() {
    if (game.back()) {
        drawBoard();
        backBtn.disabled = true;
    }
}

function updatePlayButton() {
    const burgerPlay = document.getElementById('burger-play');
    if (timer) {
        playBtn.classList.add('playing');
        playIcon.textContent = '■';
        playText.textContent = 'Stop';
        playBtn.title = 'Stop';
        // Update burger menu play button
        burgerPlay.innerHTML = '<span class="icon">■</span> Stop';
        burgerPlay.classList.add('playing');
    } else {
        playBtn.classList.remove('playing');
        playIcon.textContent = '▶';
        playText.textContent = 'Play';
        playBtn.title = 'Play';
        // Update burger menu play button
        burgerPlay.innerHTML = '<span class="icon">▶</span> Play';
        burgerPlay.classList.remove('playing');
    }
}

function updateBurgerBackButton() {
    const burgerBack = document.getElementById('burger-back');
    if (timer || !game.lastBoard) {
        burgerBack.disabled = true;
        burgerBack.style.opacity = '0.5';
    } else {
        burgerBack.disabled = false;
        burgerBack.style.opacity = '1';
    }
}

function startGame() {
    if (!timer) {
        timer = setInterval(() => {
            game.step();
            drawBoard();
        }, interval);
        backBtn.disabled = true;
        updatePlayButton();
        updateBurgerBackButton();
    }
}

function stopGame() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        backBtn.disabled = !game.lastBoard;
        updatePlayButton();
        updateBurgerBackButton();
    }
}

canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    game.board[y][x] = game.board[y][x] ? 0 : 1;
    game.futureBoard = game.computeNext(game.board);
    drawBoard();
});

document.getElementById('rows').addEventListener('change', initBoard);
document.getElementById('cols').addEventListener('change', initBoard);

playBtn.addEventListener('click', () => {
    if (timer) {
        stopGame();
    } else {
        startGame();
    }
});
document.getElementById('step').addEventListener('click', stepOnce);
backBtn.addEventListener('click', backOnce);

document.getElementById('clear').addEventListener('click', () => {
    stopGame();
    game.clear();
    drawBoard();
});

document.getElementById('random').addEventListener('click', () => {
    game.randomize();
    drawBoard();
});

document.getElementById('export').addEventListener('click', () => {
    const data = JSON.stringify({ rows: game.rows, cols: game.cols, board: game.board });
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

document.getElementById('fileInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            document.getElementById('rows').value = data.rows;
            document.getElementById('cols').value = data.cols;
            game = new Game(data.rows, data.cols);
            game.board = data.board;
            game.futureBoard = game.computeNext(game.board);
            resizeCanvas();
            drawBoard();
        } catch (err) {
            alert('Invalid file');
        }
    };
    reader.readAsText(file);
});

document.getElementById('info').addEventListener('click', () => {
    overlay.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
});

overlay.addEventListener('click', e => {
    if (e.target === overlay) {
        overlay.classList.add('hidden');
    }
});

document.getElementById('speed').addEventListener('input', e => {
    interval = Number(e.target.value);
    if (timer) {
        stopGame();
        startGame();
    }
});

window.addEventListener('resize', () => {
    resizeCanvas();
    drawBoard();
});

// Burger menu functionality
burgerToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    burgerToggle.classList.toggle('active');
    burgerDropdown.classList.toggle('show');
});

// Close burger menu when clicking outside
document.addEventListener('click', (e) => {
    if (!burgerDropdown.contains(e.target) && !burgerToggle.contains(e.target)) {
        burgerToggle.classList.remove('active');
        burgerDropdown.classList.remove('show');
    }
});

// Burger menu item event listeners
document.getElementById('burger-play').addEventListener('click', () => {
    if (timer) stopGame(); else startGame();
    burgerToggle.classList.remove('active');
    burgerDropdown.classList.remove('show');
});

document.getElementById('burger-step').addEventListener('click', () => {
    stepOnce();
    burgerToggle.classList.remove('active');
    burgerDropdown.classList.remove('show');
});

document.getElementById('burger-back').addEventListener('click', () => {
    backOnce();
    burgerToggle.classList.remove('active');
    burgerDropdown.classList.remove('show');
});

document.getElementById('burger-clear').addEventListener('click', () => {
    stopGame();
    game.clear();
    drawBoard();
    burgerToggle.classList.remove('active');
    burgerDropdown.classList.remove('show');
});

document.getElementById('burger-random').addEventListener('click', () => {
    game.randomize();
    drawBoard();
    burgerToggle.classList.remove('active');
    burgerDropdown.classList.remove('show');
});

document.getElementById('burger-export').addEventListener('click', () => {
    const data = JSON.stringify({ rows: game.rows, cols: game.cols, board: game.board });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-of-life.json';
    a.click();
    URL.revokeObjectURL(url);
    burgerToggle.classList.remove('active');
    burgerDropdown.classList.remove('show');
});

document.getElementById('burger-import').addEventListener('click', () => {
    document.getElementById('fileInput').click();
    burgerToggle.classList.remove('active');
    burgerDropdown.classList.remove('show');
});

document.getElementById('burger-info').addEventListener('click', () => {
    overlay.classList.remove('hidden');
    burgerToggle.classList.remove('active');
    burgerDropdown.classList.remove('show');
});

document.getElementById('burger-theme').addEventListener('click', () => {
    applyTheme(!document.body.classList.contains('dark'));
    drawBoard();
    burgerToggle.classList.remove('active');
    burgerDropdown.classList.remove('show');
});

initBoard();
updatePlayButton();
updateBurgerBackButton();
