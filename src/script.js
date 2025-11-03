let score = 0;
let highScore = 0;
let lives = 1; // start with one life
const gridSize = 6;
const minDelta = 5;
const maxDelta = 100;
let currentOddIndex = null;

let timer; 
let timeLimit = 3000; // 3 seconds

// ---------- GAME FUNCTIONS ----------
function updateLivesDisplay() {
  const livesDiv = document.getElementById('livesDisplay');
  livesDiv.textContent = `Lives: ${lives}`;

  if (lives === 0) {
    livesDiv.style.color = 'red';
    livesDiv.classList.add('flash');
  } else {
    livesDiv.style.color = 'green';
    livesDiv.classList.remove('flash');
  }
}



function createGame() {
  const game = document.getElementById('game');
  game.innerHTML = '';

  let difficulty = Math.min(score + 1, 20);
  const delta = Math.max(minDelta, maxDelta - ((difficulty - 1) * (maxDelta - minDelta) / 24));

  const baseR = Math.floor(Math.random() * (256 - delta));
  const baseG = Math.floor(Math.random() * (256 - delta));
  const baseB = Math.floor(Math.random() * (256 - delta));

  const baseColor = `rgb(${baseR}, ${baseG}, ${baseB})`;
  const oddColor = `rgb(${baseR + delta}, ${baseG + delta}, ${baseB + delta})`;

  currentOddIndex = Math.floor(Math.random() * gridSize * gridSize);

  for (let i = 0; i < gridSize * gridSize; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    const tileColor = i === currentOddIndex ? oddColor : baseColor;
    tile.style.backgroundColor = tileColor;
    tile.style.borderColor = tileColor;

let timerTimeout;

function startTimerBorder(color) {
  const border = document.getElementById('timerBorder');
  border.style.borderColor = color;
  border.style.inset = '0'; // start fully around grid

  // reset transition for replay
  border.style.transition = 'none';
  border.style.inset = '0';
  void border.offsetWidth; // force reflow
  border.style.transition = 'all 3s linear';

  // animate shrinking inward
  border.style.inset = '160px'; // how far it closes in (half of grid size)

  clearTimeout(timerTimeout);
  timerTimeout = setTimeout(() => {
    handleTimerExpired();
  }, 3000);
}

function resetTimerBorder() {
  const border = document.getElementById('timerBorder');
  border.style.transition = 'none';
  border.style.inset = '0';
  border.style.borderColor = 'transparent';
  clearTimeout(timerTimeout);
}

function handleTimerExpired() {
  resetTimerBorder();

  if (lives > 0) {
    lives = 0;
    document.getElementById('message').textContent = 'Time’s up! You’re on your last chance.';
    updateLivesDisplay();
    setTimeout(() => {
      createGame();
    }, 1000);
  } else {
    document.getElementById('message').textContent = 'Out of time! Game over.';
    setTimeout(() => {
      restartGame();
    }, 1500);
  }
}


    tile.addEventListener('click', () => {
      handleTileClick(i === currentOddIndex, tile);
    });
    
    startTimerBorder(baseColor);

    game.appendChild(tile)
  }

  // start timer if player has passed level 20
  clearTimeout(timer);
  if (score >= 20) {
    timer = setTimeout(() => {
      handleTimeOut();
    }, timeLimit);
  }
}

function handleTileClick(isCorrect, tileClicked) {
  clearTimeout(timer);

  const gameTiles = document.getElementById('game').querySelectorAll('.tile');

  if (isCorrect) {
    tileClicked.style.transform = 'scale(1.2)';
    setTimeout(() => tileClicked.style.transform = '', 150);

    score++;
    document.getElementById('currentScore').textContent = `Current Score: ${score}`;
    if (score > highScore) {
      highScore = score;
      document.getElementById('highScore').textContent = `Highest Score: ${highScore}`;
    }

    createGame();
    document.getElementById('message').textContent = '';
  } else {
    if (lives > 0) {
      lives = 0;
      document.getElementById('message').textContent = 'Wrong! You’re on your last chance.';
      updateLivesDisplay();
      gameTiles[currentOddIndex].classList.add('highlight');

      setTimeout(() => {
        document.getElementById('message').textContent = '';
        createGame();
      }, 1000);
    } else {
      document.getElementById('message').textContent = 'Game Over! Restarting...';
      gameTiles[currentOddIndex].classList.add('highlight');
      setTimeout(() => {
        restartGame();
      }, 1500);
    }
  }
}

function handleTimeOut() {
  if (lives > 0) {
    lives = 0;
    document.getElementById('message').textContent = 'Too slow! You’re on your last chance.';
    updateLivesDisplay();
    setTimeout(() => {
      document.getElementById('message').textContent = '';
      createGame();
    }, 1000);
  } else {
    document.getElementById('message').textContent = 'Time’s up! Game Over.';
    setTimeout(() => {
      restartGame();
    }, 1500);
  }
}

function restartGame() {
  const gameContainer = document.getElementById('game');
  gameContainer.classList.add('fade-out');

  setTimeout(() => {
    score = 0;
    lives = 1;
    document.getElementById('currentScore').textContent = `Current Score: ${score}`;
    document.getElementById('message').textContent = '';
    updateLivesDisplay();
    createGame();

    gameContainer.classList.remove('fade-out');
    gameContainer.classList.add('fade-in');

    setTimeout(() => {
      gameContainer.classList.remove('fade-in');
    }, 800);
  }, 800);
}

// ---------- BUTTONS ----------
document.getElementById('buyLives').addEventListener('click', () => {
  window.location.href = 'https://yourBuyLivesPage.com';
});

document.getElementById('goPremium').addEventListener('click', () => {
  window.location.href = 'https://yourPremiumPage.com';
});

// ---------- INITIALIZE ----------
updateLivesDisplay();
createGame();