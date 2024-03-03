
const rangeDiv = document.querySelector("#range");
const sliderDiv = document.querySelector("#slider");
const scoreDiv = document.getElementById("score");
const startPage = document.getElementById("start-page");
const imageInterval = 1500;
const gameContainer = document.getElementById("game-container");

let score = 0;
let percent = 0;
let gameWidth = gameContainer.getBoundingClientRect().width + gameContainer.offsetLeft;

const imageList = [
  { src: "ng2.png", points: 10 },
  { src: "ok.png", points: -5 },
  { src: "ng.png", points: 10 },
  { src: "ok.png", points: -5 },
  { src: "ng2.png", points: 10 },
];

function resizeWindow() {
  gameContainer.style.height =
    gameContainer.getBoundingClientRect().width + "px";
}

window.addEventListener("resize", resizeWindow);

gameContainer.style.height = gameContainer.getBoundingClientRect().width + "px";

function get_game_width() {
  gameWidth =
    gameContainer.getBoundingClientRect().width + gameContainer.offsetLeft;
  return gameWidth;
}

function startGame() {
  startPage.style.display = "none";

  let updateTimer = setInterval(() => {
    if (percent >= 100) {
      clearInterval(updateTimer);
      document.getElementById("end-page").style.display = "block";
      document.getElementById("final-score-container").innerHTML = "あなたのスコア<br>" + "<span class=\"final-score\">" + score + "点</span>";
    } else {
      percent+=5;
      sliderDiv.style.width = `${percent}%`
      setTimeout(updateTimer, 1000);
      createRandomImage();
    }
  }, imageInterval);
}

function createRandomImage() {
  // Occurs when the user changes the width of the screen during playing the game.
  if (gameContainer.childNodes.length != 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * imageList.length);
  const imageInfo = imageList[randomIndex];
  const imageElement = new Image();

  imageElement.src = imageInfo.src;
  imageElement.classList.add("game-image");

  // when the image is clicked
  imageElement.addEventListener("click", () => {
    updateScore(imageInfo.points);
  });

  // add image to game container
  gameContainer.appendChild(imageElement);

  animateImage(imageElement);
}

function animateImage(imageElement) {
  let position = get_game_width() - 60;

  const moveImage = () => {
    position -= 9;
    imageElement.style.left = position + "px";

    if (position < gameContainer.offsetLeft) {
      gameContainer.removeChild(imageElement);
    } else {
      requestAnimationFrame(moveImage);
    }
  };

  moveImage();
}

function updateScore(points) {
  score += points;
  if (points < 0) {
    scoreDiv.innerHTML = "スコア : " + score + "↓";
    scoreDiv.style.color = "rgba(254, 44, 85, 1)";
  } else {
    scoreDiv.innerHTML = "スコア : " + score + "↑";
    scoreDiv.style.color = "rgb(13, 210, 46)";
  }
}

function foundNg() {
  if (gameContainer.childNodes.length == 0) {
    return;
  }
  gameContainer.childNodes[0].dispatchEvent(new Event("click"));
}

function init() {
  score = 0;
  scoreDiv.innerHTML = "スコア : " + score;
  scoreDiv.style.color = "rgb(47, 47, 47)";
  sliderDiv.style.width = 0;
  percent = 0;
}

function playAgain() {
  init();
  document.getElementById("end-page").style.display = "none";
  startGame();
}
