// ======== PAGE NAV (Home / How / Leaderboard) ========
const pages = {
  home: document.getElementById("pageHome"),
  how: document.getElementById("pageHow"),
  board: document.getElementById("pageBoard"),
};

function showPage(key){
  Object.values(pages).forEach(p => p.classList.remove("active"));
  pages[key].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Nav buttons
document.getElementById("navHome").onclick = () => showPage("home");
document.getElementById("navHomeBtn").onclick = () => showPage("home");
document.getElementById("navHow").onclick = () => showPage("how");
document.getElementById("navBoard").onclick = () => showPage("board");

// Home buttons
document.getElementById("howBtn").onclick = () => showPage("how");
document.getElementById("backHomeFromHow").onclick = () => showPage("home");
document.getElementById("backHomeFromBoard").onclick = () => showPage("home");

// ======== MODE MODAL (NEW) ========
const modeModal = document.getElementById("modeModal");
const vsPlayerBtn = document.getElementById("vsPlayerBtn");
const vsBotBtn = document.getElementById("vsBotBtn");
const closeModeBtn = document.getElementById("closeModeBtn");

let vsBot = false; // mode flag

function openModeModal(){
  modeModal.style.display = "flex";
}
function closeModeModal(){
  modeModal.style.display = "none";
}

// open mode modal from Play Now / Game / Start buttons
document.getElementById("playBtn").onclick = openModeModal;
document.getElementById("navGame").onclick = openModeModal;
document.getElementById("howPlayBtn").onclick = openModeModal;
document.getElementById("boardPlayBtn").onclick = openModeModal;

closeModeBtn.onclick = closeModeModal;
modeModal.addEventListener("click", (e) => {
  if(e.target === modeModal) closeModeModal();
});

vsPlayerBtn.onclick = () => {
  vsBot = false;
  closeModeModal();
  openNameModal();
};

vsBotBtn.onclick = () => {
  vsBot = true;
  closeModeModal();
  openNameModal();
};

// ======== NAME MODAL ========
const nameModal = document.getElementById("nameModal");
const startGameBtn = document.getElementById("startGameBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

const nameTitle = document.getElementById("nameTitle");
const nameSub = document.getElementById("nameSub");

const player1Input = document.getElementById("player1Input");
const player2Input = document.getElementById("player2Input");

function openNameModal(){
  nameModal.style.display = "flex";

  // adjust inputs based on mode
  if(vsBot){
    nameTitle.textContent = "Enter Your Name 🤖";
    nameSub.textContent = "You are X. The Bot is O.";
    player2Input.value = "BOT";
    player2Input.disabled = true;
    player2Input.style.opacity = "0.7";
  }else{
    nameTitle.textContent = "Enter Player Names 🎮";
    nameSub.textContent = "Choose your fighters and start!";
    player2Input.disabled = false;
    player2Input.value = "";
    player2Input.style.opacity = "1";
  }
}

function closeNameModal(){
  nameModal.style.display = "none";
}

closeModalBtn.onclick = closeNameModal;

nameModal.addEventListener("click", (e) => {
  if(e.target === nameModal) closeNameModal();
});

// ======== GAME SHOW/HIDE ========
const gameContainer = document.getElementById("gameContainer");
const playersText = document.getElementById("playersText");
const statusText = document.getElementById("statusText");
const scoreBoard = document.getElementById("scoreBoard");
const backToHomeBtn = document.getElementById("backToHomeBtn");

backToHomeBtn.onclick = () => {
  gameContainer.style.display = "none";
  showPage("home");
};

// ======== TIC TAC TOE (with BOT) ========
const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restartBtn");
const newPlayersBtn = document.getElementById("newPlayersBtn");

// Leaderboard UI
const lbP1Name = document.getElementById("lbP1Name");
const lbP2Name = document.getElementById("lbP2Name");
const lbP1Wins = document.getElementById("lbP1Wins");
const lbP2Wins = document.getElementById("lbP2Wins");

let player1 = "Player 1";
let player2 = "Player 2";
let player1Wins = 0;
let player2Wins = 0;

let currentPlayer = "X";
let running = false;
let options = ["","","","","","","","",""];

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function updateLeaderboard(){
  lbP1Name.textContent = player1;
  lbP2Name.textContent = player2;
  lbP1Wins.textContent = player1Wins;
  lbP2Wins.textContent = player2Wins;
}

function updateScoreboard(){
  scoreBoard.textContent = `${player1}: ${player1Wins} | ${player2}: ${player2Wins}`;
}

function clearWinHighlights(){
  cells.forEach(c => c.classList.remove("win-cell"));
  gameContainer.classList.remove("board-win-pop");
}

function startGame(){
  options = ["","","","","","","","",""];
  clearWinHighlights();

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("clicked");
  });

  currentPlayer = "X";
  running = true;
  statusText.textContent = `${player1}'s Turn (X)`;
}

function cellClicked(){
  const index = this.getAttribute("cellIndex");
  if(options[index] !== "" || !running) return;

  // if Vs Bot and it's bot's turn, ignore clicks
  if(vsBot && currentPlayer === "O") return;

  placeMove(index, currentPlayer, this);
  const result = checkWinner();

  // If game continues and vsBot, bot plays
  if(result === "continue" && vsBot && currentPlayer === "O"){
    setTimeout(botMove, 420); // small delay for realism
  }
}

function placeMove(index, symbol, cellEl){
  options[index] = symbol;
  if(cellEl){
    cellEl.textContent = symbol;
    cellEl.classList.add("clicked");
  } else {
    // find cell by index
    const c = document.querySelector(`.cell[cellIndex="${index}"]`);
    if(c){
      c.textContent = symbol;
      c.classList.add("clicked");
    }
  }
}

function changePlayer(){
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = currentPlayer === "X"
    ? `${player1}'s Turn (X)`
    : `${player2}'s Turn (O)`;
}

function checkWinner(){
  let winnerLine = null;

  for(let i=0;i<winConditions.length;i++){
    const condition = winConditions[i];
    const a = options[condition[0]];
    const b = options[condition[1]];
    const c = options[condition[2]];

    if(a === "" || b === "" || c === "") continue;
    if(a === b && b === c){
      winnerLine = condition;
      break;
    }
  }

  if(winnerLine){
    winnerLine.forEach(idx => cells[idx].classList.add("win-cell"));
    gameContainer.classList.add("board-win-pop");
    setTimeout(() => gameContainer.classList.remove("board-win-pop"), 500);

    if(currentPlayer === "X"){
      player1Wins++;
      statusText.textContent = `${player1} Wins! 🎉`;
    } else {
      player2Wins++;
      statusText.textContent = `${player2} Wins! 🤖🔥`;
    }

    running = false;
    updateScoreboard();
    updateLeaderboard();
    return "end";
  }

  if(!options.includes("")){
    statusText.textContent = "Draw! 🤝";
    running = false;
    return "end";
  }

  changePlayer();
  return "continue";
}

/* ======== BOT (simple but solid) ========
   Strategy (short + good):
   1) Win if possible
   2) Block if player can win
   3) Take center
   4) Take a corner
   5) Random
*/
function botMove(){
  if(!running || currentPlayer !== "O") return;

  const empty = getEmptyIndexes();

  // 1) win
  let move = findWinningMove("O");
  // 2) block
  if(move === null) move = findWinningMove("X");
  // 3) center
  if(move === null && options[4] === "") move = 4;
  // 4) corner
  if(move === null){
    const corners = [0,2,6,8].filter(i => options[i] === "");
    if(corners.length) move = corners[Math.floor(Math.random()*corners.length)];
  }
  // 5) random
  if(move === null && empty.length){
    move = empty[Math.floor(Math.random()*empty.length)];
  }

  if(move !== null){
    placeMove(move, "O", null);
    checkWinner(); // this will switch turn or end
  }
}

function getEmptyIndexes(){
  const arr = [];
  for(let i=0;i<9;i++){
    if(options[i] === "") arr.push(i);
  }
  return arr;
}

function findWinningMove(symbol){
  // return index if that move makes symbol win, else null
  for(const cond of winConditions){
    const [a,b,c] = cond;
    const line = [options[a], options[b], options[c]];
    const countSymbol = line.filter(v => v === symbol).length;
    const countEmpty = line.filter(v => v === "").length;
    if(countSymbol === 2 && countEmpty === 1){
      if(options[a] === "") return a;
      if(options[b] === "") return b;
      if(options[c] === "") return c;
    }
  }
  return null;
}

// Start game from name modal
startGameBtn.onclick = () => {
  player1 = player1Input.value.trim() || "Player 1";

  if(vsBot){
    player2 = "BOT";
  } else {
    player2 = player2Input.value.trim() || "Player 2";
  }

  playersText.textContent = `${player1} (X) vs ${player2} (O)`;
  updateScoreboard();
  updateLeaderboard();

  closeNameModal();

  // Hide pages, show game
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  gameContainer.style.display = "block";

  startGame();
};

// Init listeners once
cells.forEach(cell => cell.addEventListener("click", cellClicked));

restartBtn.onclick = () => startGame();

newPlayersBtn.onclick = () => {
  gameContainer.style.display = "none";
  showPage("home");
  openModeModal(); // go back to mode choice first
};

// Start at Home
showPage("home");
updateLeaderboard();
updateScoreboard();
