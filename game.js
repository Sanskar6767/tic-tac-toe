let isGameActive;

const Gameboard = (function(){
    const rows = 3;
    const columns = 3;
    const board = [];
  
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  
    const getBoard = () => board;

    const playerMove = (column, row, player) => {
      const cell = board[row][column];
      const availableCell = cell.getValue() === ' ';

      if (!availableCell){
        console.log('The cell is not empty');
        return 0;
      }
      cell.addToken(player);
    }

    const printBoard = () =>{
      const boardWithCellValues = board.map((row) => row.map((cell)=> cell.getValue()))
    };

    const resetBoard = () => {
      for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
              board[i][j].addToken(' '); 
          }
      }
  };

    console.log('board ban gya first factory');
    return{
        getBoard,
        playerMove,
        printBoard,
        resetBoard,
    }

}())

function Cell() {
    let value = ' ';
  
    const addToken = (player) => {
      value = player;
    };
  
    const getValue = () => value;
  
    return {
      addToken,
      getValue
    };
  }

const gameControl = ( function () {
 
  const teller = document.querySelector('.turn');  

  // const playerOneName = localStorage.getItem('playerOneName') || "Player One";
  // const playerTwoName = localStorage.getItem('playerTwoName') || "Player Two";

  // const players = [
  //   {
  //     name: playerOneName,
  //     token: 'X',
  //   },
  //   {
  //     name: playerTwoName,
  //     token: 'O',
  //   }
  // ];
  let playerOneName, playerTwoName;
    const players = [{}, {}]; // Initialize empty player objects

    const startGame = () => {
        playerOneName = localStorage.getItem('playerOneName') || "Player Test";
        playerTwoName = localStorage.getItem('playerTwoName') || "Player Two";

        players[0].name = playerOneName;
        players[0].token = 'X';
        players[1].name = playerTwoName;
        players[1].token = 'O';

        activePlayer = players[0];
        printNewRound();
    };


  let activePlayer = players[0];

  const switchPlayer = () => {
      activePlayer = activePlayer === players[0] ? players[1]: players[0];
  };

  const getActivePlayer = () => activePlayer;
  const resetGame = () =>{
    activePlayer = players[0];
  }

  const printNewRound = () => {
    // Gameboard.printBoard();
    teller.textContent = `${getActivePlayer().name}'s turn.` ;
  };

  const playRound = (row, column) => {
     
    const board = Gameboard.getBoard();
    const moveResult = Gameboard.playerMove(column, row, getActivePlayer().token);
    
    if (moveResult === 0){
      teller.textContent = 'Invalid move, cell is not empty. Try again.';
      return;
    }
    
    //check for win
    if (win.checkWin(getActivePlayer().token)){
      win.printWin(getActivePlayer().name);
      return 0;
    }
    setTimeout(() => {
      switchPlayer();
      teller.textContent = `${getActivePlayer().name}'s turn.`;
    }, 200); 
    printNewRound();

  };


  return {
    getActivePlayer,
    playRound,
    players,
    resetGame,
    printNewRound,
    startGame,
  }
   

}())


const win = (function() {
  const checkWin = (player) =>{
    const board = Gameboard.getBoard();
    //for rows
    for (let i = 0; i < 3; i++){
      if (board[i][0].getValue() === player && 
          board[i][1].getValue() === player && 
          board[i][2].getValue() === player) {
            
            return true;
      }
    }
    //for columns
    for (let i = 0; i < 3; i++){
      if (board[0][i].getValue() === player && 
          board[1][i].getValue() === player && 
          board[2][i].getValue() === player){
            
            return true;
      }
    }
    // for diagonals left to right
    if (board[0][0].getValue() === player && 
        board[1][1].getValue() === player && 
        board[2][2].getValue() === player){

          return true;
        }

    // for diagonals right to left
    if (board[0][2].getValue() === player && 
        board[1][1].getValue() === player && 
        board[2][0].getValue() === player){

          return true;
        }
  }
  const teller = document.querySelector('.turn');
  const printWin = (player) =>{
    teller.textContent = (`${player} has won`);
  }

  return{
    checkWin,
    printWin,
  }
})();

const ScreenController = (() =>{
  
  const board = Gameboard.getBoard();
  
  const boardDiv = document.querySelector('.board');
  const teller = document.querySelector('.turn');

  const updateScreen = () => {
    boardDiv.textContent = '';
    console.log("khali krdiya")

    const activePlayer = gameControl.getActivePlayer();
    // teller.textContent= `${activePlayer.name}'s turn ...`

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the column and row
        // This makes it easier to pass into our `playRound` function 
        cellButton.dataset.column = columnIndex
        cellButton.dataset.row = rowIndex
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      
      })
    })
    console.log('board print hogya')
  }

  isGameActive = true;

  function clickHandlerBoard(e) {
    if (!isGameActive) return;

    const scolumn = e.target.dataset.column;
    const srow = e.target.dataset.row;

    if(!scolumn || ! srow) return;

    const ifwin = gameControl.playRound(parseInt(srow), parseInt(scolumn));
    if (ifwin === 0){
      updateScreen();
      // const activePlayer = gameControl.getActivePlayer();
      // win.printWin(getActivePlayer().name);
      isGameActive = false;
      return;
    }

    // gameControl.playRound(parseInt(srow), parseInt(scolumn));
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // updateScreen();

  return {
    updateScreen,
  
  }

})();

const start = document.querySelector('.start');
start.addEventListener('click', function() {
  gameControl.startGame();  // Initialize player names and start the game
  ScreenController.updateScreen();
});

document.getElementById('restartButton').addEventListener('click', function() {
  Gameboard.resetBoard();
  gameControl.resetGame(); // Reset the game board
  gameControl.printNewRound();
  isGameActive = true;    // Re-enable the game
  ScreenController.updateScreen();         // Update the UI
  
});

// document.querySelector('#formbutton').addEventListener('click', function(){
//   localStorage.setItem('playerOneName', document.getElementById('player1Name').value || "Player One");
//   localStorage.setItem('playerTwoName', document.getElementById('player2Name').value || "Player Two");
//   window.location.href='game.html';
//   console.log(localStorage.getItem('playerOneName'))
// });

