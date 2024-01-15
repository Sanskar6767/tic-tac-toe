document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formbutton').addEventListener('click', function() {
      const playerOneName = document.getElementById('player1Name').value || "Player One";
      const playerTwoName = document.getElementById('player2Name').value || "Player Two";
  
      localStorage.setItem('playerOneName', playerOneName);
      localStorage.setItem('playerTwoName', playerTwoName);
  
      window.location.href = 'game.html';
    });
  });
  
  
  document.querySelector('.test').addEventListener('click', function() {
    console.log('Its working');
  
  })