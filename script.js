let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turnText = document.querySelector("#turn");
let oScoreDisplay = document.querySelector("#o-score");
let xScoreDisplay = document.querySelector("#x-score");
let themeToggle = document.querySelector("#theme-toggle");
let modeSelect = document.querySelector("#mode");

let turnO = true;
let count = 0;
let oScore = 0;
let xScore = 0;
let gameMode = "friend";

// ✅ WIN PATTERNS
const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// ✅ SOUND FILES (ensure these paths are correct)
let moveSound = new Audio("sounds/move.mp3");
let winSound = new Audio("sounds/win.mp3");
let drawSound = new Audio("sounds/draw.mp3");

const playSound = (sound) => {
  sound.pause();
  sound.currentTime = 0;
  sound.play().catch(() => {}); // prevents error on autoplay
};

const updateTurnText = () => {
  turnText.innerText = `Turn: ${turnO ? "O" : "X"}`;
};

const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
};

const showWinner = (winner) => {
  setTimeout(() => {
    playSound(winSound);
    msg.innerText = `🎉 Winner is:--> ${winner}`;
    msgContainer.classList.remove("hide");

    if (winner === "O") {
      oScore++;
      oScoreDisplay.innerText = oScore;
    } else {
      xScore++;
      xScoreDisplay.innerText = xScore;
    }
  }, 300);

  disableBoxes();
};

const gameDraw = () => {
  setTimeout(() => {
    playSound(drawSound);
    msg.innerText = "Game was a draw.";
    msgContainer.classList.remove("hide");
  }, 300);
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    if (
      boxes[a].innerText &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[b].innerText === boxes[c].innerText
    ) {
      showWinner(boxes[a].innerText);
      return true;
    }
  }
  return false;
};

const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  updateTurnText();
};

// ✅ AI LOGIC
const aiMove = () => {
  let emptyBoxes = Array.from(boxes).filter((box) => box.innerText === "");
  if (emptyBoxes.length === 0) return;

  let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];

  setTimeout(() => {
    randomBox.innerText = "X";
    randomBox.disabled = true;
    playSound(moveSound);

    turnO = true;
    count++;
    updateTurnText();

    const won = checkWinner();
    if (!won && count === 9) gameDraw();
  }, 600);
};

// ✅ MAIN CLICK LOGIC
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "") return;

    if (gameMode === "ai") {
      if (turnO) {
        box.innerText = "O";
        box.disabled = true;
        playSound(moveSound);

        turnO = false;
        count++;
        updateTurnText();

        const won = checkWinner();
        if (won || count === 9) {
          if (!won) gameDraw();
          return;
        }

        aiMove(); // AI plays after human
      }
    } else {
      // Friend mode
      box.innerText = turnO ? "O" : "X";
      box.disabled = true;
      playSound(moveSound);

      turnO = !turnO;
      count++;
      updateTurnText();

      const won = checkWinner();
      if (!won && count === 9) gameDraw();
    }
  });
});

resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
});

modeSelect.addEventListener("change", (e) => {
  gameMode = e.target.value;
  resetGame();
});

updateTurnText();

