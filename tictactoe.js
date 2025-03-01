let gameMode = 'player';
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let player1Name = '';
let player2Name = '';
let statistics = {
    player1Wins: 0,
    player2Wins: 0,
    ties: 0
};

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];


function setGameMode(mode) {
    gameMode = mode;
    document.getElementById('playerMode').classList.toggle('active', mode === 'player');
    document.getElementById('computerMode').classList.toggle('active', mode === 'computer');
    
    const player2Input = document.getElementById('player2');
    if (mode === 'computer') {
        player2Input.value = 'Computer';
        player2Input.disabled = true;
    } else {
        player2Input.value = '';
        player2Input.disabled = false;
    }
}

// Start game
function startGame() {
    player1Name = document.getElementById('player1').value.trim() || 'Player 1';
    player2Name = document.getElementById('player2').value.trim() || 'Player 2';
    
    if (gameMode === 'computer') {
        player2Name = 'Computer';
    }
    
    gameActive = true;
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    updateGameStatus();
    
    // Clear the board
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'win');
    });
}

// Handle cell click
function handleCellClick(index) {
    if (!gameActive || gameBoard[index] !== '') return;
    
    makeMove(index);
    
    if (gameMode === 'computer' && gameActive && currentPlayer === 'O') {
        setTimeout(makeComputerMove, 500);
    }
}

// Make move
function makeMove(index) {
    gameBoard[index] = currentPlayer;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    
    if (checkWin()) {
        handleWin();
    } else if (checkDraw()) {
        handleDraw();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateGameStatus();
    }
}

// Computer move
function makeComputerMove() {
    // Simple AI: Look for winning move, then blocking move, then random
    let index = findBestMove();
    makeMove(index);
}

// Find best move for computer
function findBestMove() {
    // Try to win
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            if (checkWin()) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    
    // Block player's winning move
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'X';
            if (checkWin()) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    
    // Take center if available
    if (gameBoard[4] === '') return 4;
    
    // Take random available cell
    let emptyCells = gameBoard.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Check for win
function checkWin() {
    return winningCombinations.some(combination => {
        if (
            gameBoard[combination[0]] !== '' &&
            gameBoard[combination[0]] === gameBoard[combination[1]] &&
            gameBoard[combination[1]] === gameBoard[combination[2]]
        ) {
            // Highlight winning combination
            combination.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('win');
            });
            return true;
        }
        return false;
    });
}

// Check for draw
function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

// Handle win
function handleWin() {
    gameActive = false;
    const winner = currentPlayer === 'X' ? player1Name : player2Name;
    document.getElementById('statusText').textContent = `${winner} wins!`;
    
    // Update statistics
    if (currentPlayer === 'X') {
        statistics.player1Wins++;
    } else {
        statistics.player2Wins++;
    }
}

// Handle draw
function handleDraw() {
    gameActive = false;
    document.getElementById('statusText').textContent = "It's a draw!";
    statistics.ties++;
}

// Update game status
function updateGameStatus() {
    const currentPlayerName = currentPlayer === 'X' ? player1Name : player2Name;
    document.getElementById('statusText').textContent = `${currentPlayerName}'s turn`;
}

// Reset game
function resetGame() {
    startGame();
}

// Show statistics
function showStats() {
    const modal = document.getElementById('statsModal');
    const content = document.getElementById('statsContent');
    content.innerHTML = `
        <p>${player1Name} (X) wins: ${statistics.player1Wins}</p>
        <p>${player2Name} (O) wins: ${statistics.player2Wins}</p>
        <p>Ties: ${statistics.ties}</p>
    `;
    modal.style.display = 'block';
}

// Close statistics modal
function closeStats() {
    document.getElementById('statsModal').style.display = 'none';
}

// Initialize game
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('statsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
} 