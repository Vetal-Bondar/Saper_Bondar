'use strict'
window.addEventListener('DOMContentLoaded', () => {
    const totalMines = 10;
    let currentFlags = 0;
    let isVictory = false;

    function initializeGame() {
        generateBoard();
        placeMines();
        updateCounters();
        activateGameLogic();
    }

    function generateBoard() {
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');
        let cellId = 1;

        for (let row = 0; row < 8; row++) {
            const tr = document.createElement('tr');
            tbody.append(tr);

            for (let col = 0; col < 8; col++) {
                const td = document.createElement('td');
                td.dataset.mine = 'false';
                td.id = cellId++;
                tr.append(td);
            }
        }

        table.append(tbody);
        document.querySelector('.game').append(table);
    }

    function placeMines() {
        const cells = Array.from(document.querySelectorAll('td'));
        let minesPlaced = 0;

        while (minesPlaced < totalMines) {
            const randomCell = cells[Math.floor(Math.random() * cells.length)];
            if (randomCell.dataset.mine === 'false') {
                randomCell.dataset.mine = 'true';
                minesPlaced++;
            }
        }
    }

    function updateCounters() {
        document.querySelector('.countMines').textContent = totalMines;
        document.querySelector('.countFlags').textContent = currentFlags;
    }

    function activateGameLogic() {
        const board = document.querySelector('tbody');
        board.addEventListener('click', handleCellClick);
        board.addEventListener('contextmenu', handleFlagAction);

        function handleCellClick(event) {
            addRestartButton();
            const cell = event.target;

            if (cell.dataset.mine === 'true') {
                revealCell(cell);
                endGame(false);
            } else {
                revealSafeCell(cell);
                checkVictory();
            }
        }

        function handleFlagAction(event) {
            event.preventDefault();
            addRestartButton();

            const cell = event.target;
            if (cell.classList.contains('flagCell')) {
                cell.classList.remove('flagCell');
                currentFlags--;
            } else if (currentFlags < totalMines) {
                cell.classList.add('flagCell');
                currentFlags++;
            }
            updateCounters();
        }

        function revealSafeCell(cell) {
            if (!cell.classList.contains('emptyCell')) {
                cell.classList.add('emptyCell');
                const mineCount = countAdjacentMines(cell);
                if (mineCount > 0) {
                    cell.textContent = mineCount;
                } else {
                    revealNeighbors(cell);
                }
            }
        }

        function countAdjacentMines(cell) {
            return getNeighbors(cell).reduce((count, neighbor) => {
                return count + (neighbor.dataset.mine === 'true' ? 1 : 0);
            }, 0);
        }

        function revealNeighbors(cell) {
            getNeighbors(cell).forEach(neighbor => {
                if (!neighbor.classList.contains('emptyCell') && neighbor.dataset.mine === 'false') {
                    revealSafeCell(neighbor);
                }
            });
        }

        function revealCell(cell) {
            cell.classList.add('mineCell');
            document.querySelectorAll('td').forEach(td => {
                if (td.dataset.mine === 'true') {
                    td.classList.add('mineCell');
                }
            });
        }

        function checkVictory() {
            const revealedCells = document.querySelectorAll('.emptyCell').length;
            const totalCells = document.querySelectorAll('td').length;

            if (revealedCells === totalCells - totalMines) {
                isVictory = true;
                endGame(true);
            }
        }

        function endGame(victory) {
            board.removeEventListener('click', handleCellClick);
            board.removeEventListener('contextmenu', handleFlagAction);
            const message = document.querySelector('.victoryOrLoss');
            message.textContent = victory ? 'Ви виграли!' : 'Ви програли!';
        }

        function addRestartButton() {
            if (!document.querySelector('.buttonNewGame')) {
                const restartButton = document.createElement('button');
                restartButton.textContent = 'Почати заново';
                restartButton.classList.add('buttonNewGame');
                document.querySelector('.answer-2').append(restartButton);
                restartButton.addEventListener('click', resetGame);
            }
        }

        function resetGame() {
            document.querySelector('.game table').remove();
            document.querySelector('.victoryOrLoss').textContent = '';
            currentFlags = 0;
            isVictory = false;
            initializeGame();
        }
    }

    function getNeighbors(cell) {
        const row = cell.parentElement;
        const table = row.parentElement;
        const cellIndex = Array.from(row.children).indexOf(cell);
        const rowIndex = Array.from(table.children).indexOf(row);
        const neighbors = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const neighborRow = table.children[rowIndex + i];
                if (neighborRow) {
                    const neighborCell = neighborRow.children[cellIndex + j];
                    if (neighborCell) neighbors.push(neighborCell);
                }
            }
        }

        return neighbors;
    }

    initializeGame();
});
