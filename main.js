
const rangeDiv = document.querySelector("#range");
const sliderDiv = document.querySelector("#slider");
const scoreDiv = document.getElementById("score");
const startPage = document.getElementById("start-page");
const gameContainer = document.getElementById("game-container");
window.addEventListener("resize", resizeWindow);
gameContainer.style.height = gameContainer.getBoundingClientRect().width + "px";

let score = 0;
let percent = 0;
let nozzle_image_start_position = gameContainer.getBoundingClientRect().width + gameContainer.offsetLeft;

let createdImages = [];

const imageInfoList = [
  { src: "images/ok.png", points: -15 },
  { src: "images/ng2.png", points: 5 },
  { src: "images/ok.png", points: -15 },
  { src: "images/ng.png", points: 5 },
  { src: "images/ok.png", points: -15 },
  { src: "images/ng2.png", points: 5 },
  { src: "images/ok.png", points: -15 },
  { src: "images/ng3.png", points: 5 },
  { src: "images/ok.png", points: -15 },
];

function resizeWindow() {
  gameContainer.style.height =
    gameContainer.getBoundingClientRect().width + "px";
}

let emojiInterval = undefined;

async function runCountDownAnimation() {
  return new Promise((resolve) => {
    document.getElementById("counter").style.display = "block";

    let ml4 = {};
    ml4.opacityIn = [0,1];
    ml4.scaleIn = [1, 1];
    ml4.scaleOut = 3;
    ml4.durationIn = 100;
    ml4.durationOut = 900;
    ml4.delay = 200;

    let animation = anime.timeline();

    animation.add({
      targets: '.ml4 .letters-1',
      opacity: ml4.opacityIn,
      scale: ml4.scaleIn,
      duration: ml4.durationIn
    }).add({
      targets: '.ml4 .letters-1',
      opacity: 0,
      scale: ml4.scaleOut,
      duration: ml4.durationOut,
      easing: "easeInExpo",
      delay: ml4.delay
    }).add({
      targets: '.ml4 .letters-2',
      opacity: ml4.opacityIn,
      scale: ml4.scaleIn,
      duration: ml4.durationIn
    }).add({
      targets: '.ml4 .letters-2',
      opacity: 0,
      scale: ml4.scaleOut,
      duration: ml4.durationOut,
      easing: "easeInExpo",
      delay: ml4.delay
    }).add({
      targets: '.ml4 .letters-3',
      opacity: ml4.opacityIn,
      scale: ml4.scaleIn,
      duration: ml4.durationIn
    }).add({
      targets: '.ml4 .letters-3',
      opacity: 0,
      scale: ml4.scaleOut,
      duration: ml4.durationOut,
      easing: "easeInExpo",
      delay: ml4.delay
    }).add({
      targets: '.ml4 .letters-4',
      opacity: ml4.opacityIn,
      scale: ml4.scaleIn,
      duration: ml4.durationIn
    }).add({
      targets: '.ml4 .letters-4',
      opacity: 0,
      scale: ml4.scaleOut,
      duration: ml4.durationOut,
      easing: "easeInExpo",
      delay: ml4.delay
    }).add({
      targets: '.ml4',
      opacity: 0,
      duration: 100,
      delay: 100,
      complete() {
        animation.restart();
        document.getElementById("counter").style.display = "none";
        resolve(0);
      }
    });
  });
}

async function countDown() {
  const countDownWindow = document.getElementById("count-down-window");
  const countDownContainer = document.getElementById("count-down-container");
  countDownWindow.style.display = "block";
  let sec = 4;
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (sec == 1) {
        countDownContainer.innerHTML = "<div class=\"count-down-message\">スタートォ</div>";
        sec--;
      } else if (sec == 0) {
        clearInterval(timer);
        countDownWindow.style.display = "none";
        resolve(0);
      } else {
        let div = document.createElement("div");
        div.innerHTML = --sec;
        div.classList.add("count-down-number");
        countDownContainer.append(div);

        let animations = document.querySelector(".count-down-number").getAnimations();
        if (animations[0].animationName == "count-down-animation") {
          div.classList.add("count-down-number-out");
        }

      }
    }, 1000);
  });
}

async function startGame() {
  startPage.style.display = "none";
  score = 0;
  scoreDiv.innerHTML = "スコア : " + score;
  scoreDiv.style.color = "rgb(47, 47, 47)";
  sliderDiv.style.width = 0;
  percent = 0;
  createImageElement();

  await runCountDownAnimation();

  let updateTimer = setInterval(async () => {
    if (gameContainer.childNodes.length === 0) {
      percent+=5;
      sliderDiv.style.width = `${percent}%`;
      await createRandomImage(createdImages[percent / 5 - 1]);
      if (percent >= 100) {
        clearInterval(updateTimer);
        document.getElementById("end-page").style.display = "block";
        var finalScoreContainer = document.getElementById("final-score-container");
    
        anime({
          targets: finalScoreContainer,
          innerText: [0, score.toString()],
          easing: "linear",
          round: true,
          update: function(a) {
            const value = a.animations[0].currentValue;
            finalScoreContainer.innerHTML = "あなたのスコア<br>" + "<span class=\"final-score\">" + value + "点</span>";
          }
        });

        document.getElementById("final-score-container").innerHTML = "あなたのスコア<br>" + "<span class=\"final-score\">" + score + "点</span>";
        document.getElementById("share-twitter").setAttribute(
          "href",
          "http://twitter.com/share?url=https://v420v.github.io/InspectionGame&text=私のスコアは" + score + "点だった！%0a%0a" + "ノズル検査の工程を体験できるゲーム！&via=ibuki42O&hashtags=ノズル検査ゲーム"
        );
        emojiInterval = setInterval(createEmoji, 400);
      }
    }
  });
}

function createImageElement() {
  createdImages = [];
  for (i = 0; i <= 20; ++i) {
    const imageInfo = imageInfoList[Math.floor(Math.random() * imageInfoList.length)];

    let imageElement = new Image();
    imageElement.src = imageInfo.src;
    imageElement.classList.add("game-image");

    if (imageInfo.points === -15) {
      imageElement.classList.add("ok-image");
    } else {
      imageElement.classList.add("ng-image");
    }

    const click = () => {
      updateScore(imageInfo.points);
      imageElement.classList.add("clicked-image");
      imageElement.removeEventListener("click", click);
    };

    imageElement.addEventListener("click", click);

    createdImages.push(imageElement);
  }
}

function get_nozzle_image_start_position() {
  nozzle_image_start_position =
    gameContainer.getBoundingClientRect().width + gameContainer.offsetLeft;
  return nozzle_image_start_position;
}

async function createRandomImage(imageElement) {
  return new Promise((resolve) => {
    gameContainer.appendChild(imageElement);

    let position = get_nozzle_image_start_position() - imageElement.width;

    const moveImage = () => {
      if (imageElement.offsetLeft < gameContainer.offsetLeft) {
        if (gameContainer.contains(imageElement)) {
          if (imageElement.classList.contains("ng-image") && !imageElement.classList.contains("clicked-image")) {
            updateScore(-15);
          }
          gameContainer.removeChild(imageElement);
          resolve(0);
        }
      } else {
        imageElement.style.left = position + "px";
        requestAnimationFrame(moveImage);
      }
      position -= gameContainer.offsetWidth / 80;
    };

    moveImage();
  });
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

function playAgain() {
  clearInterval(emojiInterval);
  document.getElementById("end-page").style.display = "none";
  startGame();
}

function emojiList(score) {
  if (score <= 0) {
      return ["🥲", "💧", "😭", "💧"];
  } else {
      return ["😆", "😁", "👏", "🎉"];
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

