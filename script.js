var originalBoard;
const humanPlayer1 = 'O';
const humanPlayer2 = 'X';
const aiPlayer = 'X';
let isTwoPlayerMode = false;
let currentPlayer = humanPlayer1;
const winCombo = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    originalBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
    currentPlayer = humanPlayer1; 
}

function turnClick(square) {
    if (typeof originalBoard[square.target.id] == 'number') {
        turn(square.target.id, currentPlayer);
        if (isTwoPlayerMode) {
            currentPlayer = currentPlayer == humanPlayer1 ? humanPlayer2 : humanPlayer1;
        } else {
            if (!checkWin(originalBoard, humanPlayer1) && !checkTie()) turn(bestSpot(), aiPlayer);
        }
    }
}

function turn(squareId, player) {
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(originalBoard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombo.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombo[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == humanPlayer1 ? "green" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer1 ? "Player 1 Wins!" : gameWon.player == humanPlayer2 ? "Player 2 Wins!" : "AI Wins!");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquare() {
    return originalBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(originalBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquare().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "blue";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!!");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availableSpot = emptySquare();

    if (checkWin(newBoard, humanPlayer1)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availableSpot.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < availableSpot.length; i++) {
        var move = {};
        move.index = newBoard[availableSpot[i]];
        newBoard[availableSpot[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, humanPlayer1);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availableSpot[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

/* Music Playing */
document.addEventListener('DOMContentLoaded', () => {
    const musicControl = document.getElementById('music-control');
    const backgroundMusic = document.getElementById('background-music');
    let isPlaying = false;

    function toggleMusic() {
        if (isPlaying) {
            backgroundMusic.pause();
            musicControl.textContent = '⏸️';
        } else {
            backgroundMusic.play();
            musicControl.textContent = '▶️';
        }
        isPlaying = !isPlaying;
    }

    backgroundMusic.addEventListener('ended', () => {
        isPlaying = false;
        musicControl.textContent = '⏸️';
    });

    window.toggleMusic = toggleMusic;
});

/* Function to switch to two-player mode */
function switchToTwoPlayerMode() {
    isTwoPlayerMode = true;
    startGame();
}

/* Function to switch to AI mode */
function switchToAIMode() {
    isTwoPlayerMode = false;
    startGame();
}