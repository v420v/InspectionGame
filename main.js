
const rangeDiv = document.querySelector("#range");
const sliderDiv = document.querySelector("#slider");
const scoreDiv = document.getElementById("score");
const startPage = document.getElementById("start-page");
const imageInterval = 1700; // 1.7seconds
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
  { src: "ng3.png", points: 10 },
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

let emojiInterval;

function startGame() {
  startPage.style.display = "none";
  createImageElement();

  let updateTimer = setInterval(() => {
    if (percent >= 100) {
      clearInterval(updateTimer);
      document.getElementById("end-page").style.display = "block";
      document.getElementById("final-score-container").innerHTML = "あなたのスコア<br>" + "<span class=\"final-score\">" + score + "点</span>";
      emojiInterval = setInterval(createEmoji, 400);
    } else {
      percent+=5;
      sliderDiv.style.width = `${percent}%`
      setTimeout(updateTimer, 1000);
      createRandomImage();
    }
  }, imageInterval);
}

let imageElements = [];

function createImageElement() {
  for (i = 0; i < imageList.length; ++i) {
    const imageInfo = imageList[i];

    const imageElement = new Image();
    imageElement.src = imageInfo.src;
    imageElement.classList.add("game-image");
    imageElement.addEventListener("click", () => {
      updateScore(imageInfo.points);
    });

    imageElements.push(imageElement);
  }
}

function createRandomImage() {
  // Occurs when the user changes the width of the screen during playing the game.
  if (gameContainer.childNodes.length != 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * imageList.length);

  const imageElement = imageElements[randomIndex];

  gameContainer.appendChild(imageElement);
  animateImage(imageElement);
}

function animateImage(imageElement) {
  let startTime = Date.now();
  let position = get_game_width() - 50;

  const moveImage = () => {
    const alapsedTime = Date.now() - startTime;
    const progress = alapsedTime / 1700; // 1.7seconds

    const newPosition = position - position * progress;

    if (newPosition < gameContainer.offsetLeft) {
      gameContainer.removeChild(imageElement);
    } else {
      imageElement.style.left = newPosition + "px";
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
  imageElements = [];
  createImageElement();
  percent = 0;
}

function playAgain() {
  init();
  clearInterval(emojiInterval);
  document.getElementById("end-page").style.display = "none";
  startGame();
}

function emojiList(score) {
  if (score <= 0) {
      return ["🥲", "😭"];
  } else {
      return ["😆", "👏", "🎉"];
  }
}

function createEmoji() {
  var div = document.createElement('div');

  var emojis = emojiList(score);

  div.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

  div.style.position = "absolute";
  div.style.top = "-30px";

  var endPageContainer = document.getElementById('end-page-container');
  var containerWidth = endPageContainer.offsetWidth;
  div.style.left = (Math.random() * containerWidth - 35) + "px";
  
  div.style.animation = "fall 5s linear";

  endPageContainer.appendChild(div);

  twemoji.size = '72x72';
  twemoji.parse(document.body);

  div.addEventListener("animationend", () => {
    div.remove();
  });
}


