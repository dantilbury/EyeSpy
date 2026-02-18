// ========================================
// GAME STATE
// ========================================
let score = 0;
let highScore = 0;
let lives = 1;
let currentOddIndex = null;

// ========================================
// GAME CONFIGURATION
// ========================================
const CONFIG = {
  gridSize: 6,
  minDelta: 5,
  maxDelta: 100,
  maxDifficulty: 20,
  difficultyDivisor: 24
};

// ========================================
// DISPLAY FUNCTIONS
// ========================================
function updateLivesDisplay() {
  const livesDiv = document.getElementById('livesDisplay');
  livesDiv.textContent = 'Lives: ' + lives;

  if (lives === 0) {
    livesDiv.style.color = 'red';
    livesDiv.classList.add('flash');
  } else {
    livesDiv.style.color = 'green';
    livesDiv.classList.remove('flash');
  }
}

function updateScoreDisplay() {
  document.getElementById('currentScore').textContent = 'Current Score: ' + score;
}

function updateHighScoreDisplay() {
  document.getElementById('highScore').textContent = 'Highest Score: ' + highScore;
}

function showMessage(text) {
  document.getElementById('message').textContent = text;
}

function clearMessage() {
  document.getElementById('message').textContent = '';
}

// ========================================
// GAME LOGIC
// ========================================
function calculateDifficulty() {
  return Math.min(score + 1, CONFIG.maxDifficulty);
}

function calculateColorDelta(difficulty) {
  return Math.max(
    CONFIG.minDelta,
    CONFIG.maxDelta - ((difficulty - 1) * (CONFIG.maxDelta - CONFIG.minDelta) / CONFIG.difficultyDivisor)
  );
}

function generateRandomColor(maxValue) {
  return {
    r: Math.floor(Math.random() * maxValue),
    g: Math.floor(Math.random() * maxValue),
    b: Math.floor(Math.random() * maxValue)
  };
}

function colorToRgbString(color) {
  return 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
}

function createTile(color, isOdd) {
  const tile = document.createElement('div');
  tile.classList.add('tile');
  
  const rgbColor = colorToRgbString(color);
  tile.style.backgroundColor = rgbColor;
  tile.style.borderColor = rgbColor;

  tile.addEventListener('click', function() {
    handleTileClick(isOdd, tile);
  });

  return tile;
}

function createGame() {
  const game = document.getElementById('game');
  game.innerHTML = '';

  const difficulty = calculateDifficulty();
  const delta = calculateColorDelta(difficulty);

  const baseColor = generateRandomColor(256 - delta);
  const oddColor = {
    r: baseColor.r + delta,
    g: baseColor.g + delta,
    b: baseColor.b + delta
  };

  currentOddIndex = Math.floor(Math.random() * CONFIG.gridSize * CONFIG.gridSize);

  for (let i = 0; i < CONFIG.gridSize * CONFIG.gridSize; i++) {
    const isOdd = i === currentOddIndex;
    const tileColor = isOdd ? oddColor : baseColor;
    const tile = createTile(tileColor, isOdd);
    game.appendChild(tile);
  }
}

function incrementScore() {
  score++;
  updateScoreDisplay();
  
  if (score > highScore) {
    highScore = score;
    updateHighScoreDisplay();
  }
}

function handleCorrectTileClick(tile) {
  tile.style.transform = 'scale(1.2)';
  setTimeout(function() {
    tile.style.transform = '';
  }, 150);

  incrementScore();
  createGame();
  clearMessage();
}

function handleIncorrectTileClick() {
  const gameTiles = document.getElementById('game').querySelectorAll('.tile');

  if (lives > 0) {
    lives = 0;
    showMessage('Wrong! You are on your last chance.');
    updateLivesDisplay();
    
    if (gameTiles[currentOddIndex]) {
      gameTiles[currentOddIndex].classList.add('highlight');
    }

    setTimeout(function() {
      clearMessage();
      createGame();
    }, 1000);
  } else {
    showMessage('Game Over! Restarting...');
    
    if (gameTiles[currentOddIndex]) {
      gameTiles[currentOddIndex].classList.add('highlight');
    }
    
    setTimeout(function() {
      restartGame();
    }, 1500);
  }
}

function handleTileClick(isCorrect, tile) {
  if (isCorrect) {
    handleCorrectTileClick(tile);
  } else {
    handleIncorrectTileClick();
  }
}

function resetGameState() {
  score = 0;
  lives = 1;
  updateScoreDisplay();
  updateLivesDisplay();
  clearMessage();
}

function restartGame() {
  const gameContainer = document.getElementById('game');
  gameContainer.classList.add('fade-out');

  setTimeout(function() {
    resetGameState();
    createGame();

    gameContainer.classList.remove('fade-out');
    gameContainer.classList.add('fade-in');

    setTimeout(function() {
      gameContainer.classList.remove('fade-in');
    }, 800);
  }, 800);
}

// ========================================
// EVENT LISTENERS
// ========================================
document.getElementById('buyLives').addEventListener('click', function() {
  window.location.href = 'https://yourBuyLivesPage.com';
});

document.getElementById('goPremium').addEventListener('click', function() {
  window.location.href = 'https://yourPremiumPage.com';
});

document.getElementById('restartButton').addEventListener('click', function() {
  resetGameState();
  createGame();
});

// ========================================
// GAME INITIALIZATION
// ========================================
updateLivesDisplay();
createGame();