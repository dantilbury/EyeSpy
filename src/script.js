let score = 0;
let highScore = 0;
let lives = 1;
const gridSize = 6;
const minDelta = 5;
const maxDelta = 100;
let currentOddIndex = null;
let audioUnlocked = false;

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

// Unlock audio on first click
document.body.addEventListener('click', () => {
  if(!audioUnlocked){
    correctSound.play().catch(()=>{});
    correctSound.pause();
    wrongSound.play().catch(()=>{});
    wrongSound.pause();
    audioUnlocked = true;
  }
}, { once: true });

function updateLivesDisplay() {
  const livesDiv = document.getElementById('livesDisplay');
  livesDiv.textContent = `Lives: ${lives}`;
  livesDiv.style.color = lives > 1 ? 'green' : 'red';
}

function createGame() {
  const game = document.getElementById('game');
  game.innerHTML = '';

  let difficulty = Math.min(score + 1, 25);
  const delta = Math.max(minDelta, maxDelta - ((difficulty-1) * (maxDelta - minDelta) / 24));

  const baseR = Math.floor(Math.random() * (256 - delta));
  const baseG = Math.floor(Math.random() * (256 - delta));
  const baseB = Math.floor(Math.random() * (256 - delta));

  const baseColor = `rgb(${baseR}, ${baseG}, ${baseB})`;
  const oddColor = `rgb(${baseR + delta}, ${baseG + delta}, ${baseB + delta})`;

  currentOddIndex = Math.floor(Math.random() * gridSize * gridSize);

  for(let i=0;i<gridSize*gridSize;i++){
    const tile = document.createElement('div');
    tile.classList.add('tile');
    const tileColor = i === currentOddIndex ? oddColor : baseColor;
    tile.style.backgroundColor = tileColor;
    tile.style.borderColor = tileColor;
    tile.addEventListener('click', ()=> checkTile(i===currentOddIndex, tile));
    game.appendChild(tile);
  }
}

function checkTile(isCorrect, tileClicked){
  const gameTiles = document.getElementById('game').querySelectorAll('.tile');

  if(isCorrect){
    correctSound.currentTime = 0;
    correctSound.play();

    tileClicked.style.transform = 'scale(1.2)';
    setTimeout(()=> tileClicked.style.transform = '', 150);

    score++;
    document.getElementById('currentScore').textContent = `Current Score: ${score}`;
    if(score > highScore) {
      highScore = score;
      document.getElementById('highScore').textContent = `Highest Score: ${highScore}`;
    }

    createGame();
    document.getElementById('message').textContent = '';
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();

    lives--;
    updateLivesDisplay();
    document.getElementById('message').textContent = lives > 0 
      ? 'Wrong! Life used. Click any tile to continue.' 
      : 'Game Over! Click any tile to restart.';

    gameTiles[currentOddIndex].classList.add('highlight');

    gameTiles.forEach(tile=>{
      tile.addEventListener('click', ()=> { 
        document.getElementById('message').textContent = '';
        createGame();
      }, { once: true });
    });

    if(lives <= 0){
      gameTiles.forEach(tile=>{
        tile.addEventListener('click', restartGame, { once: true });
      });
    }
  }
}

function restartGame(){
  score = 0;
  lives = 1;
  document.getElementById('currentScore').textContent = `Current Score: ${score}`;
  updateLivesDisplay();
  document.getElementById('message').textContent = '';
  createGame();
}

// Bottom buttons logic (redirects)
document.getElementById('buyCredits').addEventListener('click', () => {
  window.location.href = 'https://yourBuyCreditsPage.com';
});

document.getElementById('shop').addEventListener('click', () => {
  window.location.href = 'https://yourShopPage.com';
});

updateLivesDisplay();
createGame();
