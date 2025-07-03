// === Tic Tac Toe: Yash's Advanced AI Version ===

const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const modeToggle = document.querySelector("#theme-toggle");
const turnText = document.querySelector("#turn");
const oScoreDisplay = document.querySelector("#o-score");
const xScoreDisplay = document.querySelector("#x-score");

let turnO = true;
let count = 0;
let playWithAI = false;
let oScore = 0;
let xScore = 0;

const winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [1, 4, 7], [2, 5, 8], [2, 4, 6],
    [3, 4, 5], [6, 7, 8],
];

function updateTurnText() {
    turnText.innerText = `Turn: ${turnO ? "O" : "X"}`;
}

function disableBoxes() {
    boxes.forEach(box => box.disabled = true);
}

function enableBoxes() {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
}

function showWinner(winner) {
    msg.innerText = `🎉 Winner is: ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();

    if (winner === "O") {
        oScore++;
        oScoreDisplay.innerText = oScore;
    } else {
        xScore++;
        xScoreDisplay.innerText = xScore;
    }
}

function gameDraw() {
    msg.innerText = `😐 It's a draw!`;
    msgContainer.classList.remove("hide");
    disableBoxes();
}

function checkWinner() {
    for (let pattern of winPatterns) {
        let a = boxes[pattern[0]].innerText;
        let b = boxes[pattern[1]].innerText;
        let c = boxes[pattern[2]].innerText;

        if (a !== "" && a === b && b === c) {
            showWinner(a);
            return true;
        }
    }
    return false;
}

function resetGame() {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    updateTurnText();
}

function makeBestAIMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerText === "") {
            boxes[i].innerText = "X";
            let score = minimax(boxes, 0, false);
            boxes[i].innerText = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    if (move !== undefined) {
        boxes[move].innerText = "X";
        boxes[move].disabled = true;
        turnO = true;
        count++;
        updateTurnText();
        let isWinner = checkWinner();
        if (count === 9 && !isWinner) {
            gameDraw();
        }
    }
}

function minimax(newBoard, depth, isMaximizing) {
    let result = evaluateBoard();
    if (result !== null) return result;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i].innerText === "") {
                newBoard[i].innerText = "X";
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i].innerText = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i].innerText === "") {
                newBoard[i].innerText = "O";
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i].innerText = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function evaluateBoard() {
    for (let pattern of winPatterns) {
        let a = boxes[pattern[0]].innerText;
        let b = boxes[pattern[1]].innerText;
        let c = boxes[pattern[2]].innerText;

        if (a && a === b && b === c) {
            return a === "X" ? 10 : -10;
        }
    }

    let openSpots = [...boxes].filter(b => b.innerText === "");
    if (openSpots.length === 0) return 0;

    return null;
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (box.innerText !== "" || !turnO) return;

        box.innerText = "O";
        box.disabled = true;
        turnO = false;
        count++;
        updateTurnText();

        let isWinner = checkWinner();
        if (count === 9 && !isWinner) {
            gameDraw();
        } else if (playWithAI && !turnO) {
            setTimeout(makeBestAIMove, 300);
        }
    });
});

resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

modeToggle.addEventListener("click", () => {
    playWithAI = !playWithAI;
    modeToggle.innerText = playWithAI ? "Mode: AI" : "Mode: Friend";
    resetGame();
});

// Initial Setup
updateTurnText();

