const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const newPlayersBtn = document.querySelector("#newPlayersBtn");
const scoreBoard = document.querySelector("#scoreBoard");
const playersText = document.querySelector("#playersText");

// MODAL
const nameModal = document.querySelector("#nameModal");
const startGameBtn = document.querySelector("#startGameBtn");
const player1Input = document.querySelector("#player1Input");
const player2Input = document.querySelector("#player2Input");

let player1 = "Player 1";
let player2 = "Player 2";
let player1Wins = 0;
let player2Wins = 0;

const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

let options = ["","","","","","","","",""];
let currentPlayer = "X";
let running = false;

// START GAME BUTTON
startGameBtn.addEventListener("click", () => {
    player1 = player1Input.value.trim() || "Player 1";
    player2 = player2Input.value.trim() || "Player 2";

    updateScore();
    playersText.textContent = `${player1} (X) vs ${player2} (O)`;
    statusText.textContent = `${player1}'s turn (X)`;
    nameModal.style.display = "none";
    running = true;
});

// INITIALIZE GAME
cells.forEach(cell => cell.addEventListener("click", cellClicked));
restartBtn.addEventListener("click", restartGame);
newPlayersBtn.addEventListener("click", resetPlayers);

function cellClicked() {
    const index = this.getAttribute("cellIndex");
    if(options[index] !== "" || !running) return;

    options[index] = currentPlayer;
    this.textContent = currentPlayer;
    this.classList.add("clicked");

    checkWinner();
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = (currentPlayer === "X") ? `${player1}'s turn (X)` : `${player2}'s turn (O)`;
}

function checkWinner() {
    let roundWon = false;

    for(const condition of winConditions){
        const [a,b,c] = condition;
        if(options[a]===""||options[b]===""||options[c]==="") continue;
        if(options[a]===options[b] && options[b]===options[c]){
            roundWon = true;
            highlightWinningCells(a,b,c);
            break;
        }
    }

    if(roundWon){
        if(currentPlayer==="X"){ player1Wins++; statusText.textContent=`${player1} wins!`; }
        else{ player2Wins++; statusText.textContent=`${player2} wins!`; }
        updateScore();
        running=false;
    }
    else if(!options.includes("")){ statusText.textContent="Draw!"; running=false; }
    else{ changePlayer(); }
}

function highlightWinningCells(a,b,c){
    [a,b,c].forEach(i => {
        cells[i].style.background="#4cd137";
        cells[i].style.transform="scale(1.15)";
    });
}

function updateScore(){
    scoreBoard.textContent = `${player1}: ${player1Wins} | ${player2}: ${player2Wins}`;
}

function restartGame(){
    options = ["","","","","","","","",""];
    currentPlayer = "X";
    statusText.textContent = `${player1}'s turn (X)`;
    cells.forEach(cell => { cell.textContent=""; cell.style.background="#ffffff10"; cell.style.transform="scale(1)"; cell.classList.remove("clicked"); });
    running=true;
}

function resetPlayers(){
    options = ["","","","","","","","",""];
    player1Wins=0; player2Wins=0;
    updateScore();
    cells.forEach(cell => { cell.textContent=""; cell.style.background="#ffffff10"; cell.style.transform="scale(1)"; cell.classList.remove("clicked"); });
    nameModal.style.display="flex";
    running=false;
}
