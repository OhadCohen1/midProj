let startBingoButton = document.getElementById('startBingo');
startBingoButton.addEventListener('click', startBingo);

function startBingo() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    const size = 7;
    const numbers = shuffle(Array.from({ length: 100 }, (_, i) => i + 1));
    const boardNumbers = numbers.slice(0, size * size);
    const remainingNumbers = [...boardNumbers];

    const board = document.createElement('div');
    board.className = 'bingo-board';
    board.style.gridTemplateColumns = `repeat(${size}, 50px)`;

    boardNumbers.forEach(num => {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.textContent = num;
        cell.dataset.number = num;
        board.appendChild(cell);
    });

    gameArea.appendChild(board);

    let selectedNumbers = [];
    let wrongClicks = 0;

    const drawButton = document.createElement('button');
    drawButton.textContent = 'הגרלה';
    gameArea.appendChild(drawButton);

    let currentNumber = null;

    drawButton.addEventListener('click', () => {
        if (remainingNumbers.length === 0) {
            alert('אין יותר מספרים להגריל.');
            return;
        }
        const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
        currentNumber = remainingNumbers[randomIndex];
        remainingNumbers.splice(randomIndex, 1);
        alert('הוגרל מספר: ' + currentNumber);
    });

    board.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.classList.contains('bingo-cell')) return;
        if (parseInt(target.textContent) === currentNumber) {
            target.classList.add('marked');
            selectedNumbers.push(currentNumber);
            if (checkWin(board, size)) alert('ניצחת!');
        } else {
            wrongClicks++;
            if (wrongClicks >= 3) {
                alert('הפסדת! לחצת 3 פעמים על מספרים לא נכונים.');
                location.reload();
            } else {
                alert('המספר הזה לא הוגרל!');
            }
        }
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkWin(board, size) {
    const cells = [...board.children];
    for (let i = 0; i < size; i++) {
        if (cells.slice(i * size, (i + 1) * size).every(c => c.classList.contains('marked'))) return true;
    }
    for (let i = 0; i < size; i++) {
        let col = true;
        for (let j = 0; j < size; j++) {
            if (!cells[i + j * size].classList.contains('marked')) {
                col = false;
                break;
            }
        }
        if (col) return true;
    }
    return false;
}