let score = 0;

const imageList = [
  { src: "ok.png", points: -5 },
  { src: "ng.png", points: 10 },
  { src: "ng2.png", points: 10 },
];

const imageInterval = 1500;

gameContainer = document.getElementById("game-container");

function resizeWindow() {
  gameContainer.style.height =
    gameContainer.getBoundingClientRect().width + "px";
}

window.addEventListener("resize", resizeWindow);

gameContainer.style.height = gameContainer.getBoundingClientRect().width + "px";

gameWidth =
  gameContainer.getBoundingClientRect().width + gameContainer.offsetLeft; //window.innerWidth;

function get_game_width() {
  gameWidth =
    gameContainer.getBoundingClientRect().width + gameContainer.offsetLeft; //window.innerWidth;
  return gameWidth;
}

function startGame() {
  document.getElementById("start-page").style.display = "none";
  setInterval(() => {
    createRandomImage();
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
  let position = get_game_width() - 70;

  const moveImage = () => {
    position -= 3;
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
  document.getElementById("score").innerHTML = "スコア : " + score;
  console.log("Score:", score);
}

function foundNg() {
  if (gameContainer.childNodes.length == 0) {
    return;
  }
  gameContainer.childNodes[0].dispatchEvent(new Event("click"));
}
