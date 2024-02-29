// Canvas要素の取得
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ゲームの設定
const imageWidth = 60;
const imageHeight = 60;
const columnCount = 2;
const imageSpeed = 2.6;
let score = 0;

// 画像の読み込み
const goodImage = new Image();
goodImage.src = "ok.png";

const badImage = new Image();
badImage.src = "ng2.png";

const images = [];

for (let i = 0; i < columnCount; i++) {
  const isNg = Math.random() < 0.2;
  const image = {
    x: (imageWidth + 110) * i,
    y: canvas.height / 2 - imageHeight / 2,
    isNg: isNg,
  };
  images.push(image);
}

canvas.addEventListener("click", handleClick);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const image of images) {
    ctx.drawImage(
      image.isNg ? badImage : goodImage,
      image.x,
      image.y,
      imageWidth,
      imageHeight
    );
    image.x -= imageSpeed;

    if (image.x + imageWidth < 0) {
      image.x = canvas.width;
      image.isNg = Math.random() < 0.2;
    }
  }

  document.getElementById("score").innerHTML = "現在のスコア: " + score + "点";
  requestAnimationFrame(gameLoop);
}

function start() {
  document.getElementById("start-page").style.display = "none";
  gameLoop();
}

function handleClick(event) {
  const clickX = event.clientX - canvas.getBoundingClientRect().left;
  const clickY = event.clientY - canvas.getBoundingClientRect().top;

  for (const image of images) {
    console.log(image.x);
    console.log(clickX);
    if (
      clickX >= image.x &&
      clickX <= image.x + imageWidth &&
      clickY >= image.y &&
      clickY <= image.y + imageHeight
    ) {
      console.log("here");
      if (image.isNg) {
        score += 10;
      } else {
        score -= 5;
      }
    } else {
      console.log("not clicked");
    }
  }
}
