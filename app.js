const imgData = [
  {
    img: "./img/clubs_2.png",
    id: "card1",
  },
  {
    img: "./img/clubs_3.png",
    id: "card2",
  },
  {
    img: "./img/clubs_4.png",
    id: "card3",
  },
  {
    img: "./img/clubs_5.png",
    id: "card4",
  },
  {
    img: "./img/clubs_6.png",
    id: "card5",
  },
  {
    img: "./img/clubs_7.png",
    id: "card6",
  },
  {
    img: "./img/clubs_8.png",
    id: "card7",
  },
  {
    img: "./img/clubs_9.png",
    id: "card8",
  },
  {
    img: "./img/clubs_10.png",
    id: "card9",
  },
  {
    img: "./img/clubs_ace.png",
    id: "card10",
  },
  {
    img: "./img/clubs_jack.png",
    id: "card11",
  },
  {
    img: "./img/clubs_king.png",
    id: "card12",
  },
  {
    img: "./img/clubs_queen.png",
    id: "card13",
  },
  {
    img: "./img/joker_black.png",
    id: "card14",
  },
];

let easy = (imgData.length % 10) + 2;
let normal = imgData.length / 2 + 1;
let hard = imgData.length;

let level = "";

const selector = {
  boardContainer: document.querySelector(".boardContainer"),
  btn: document.querySelector("#btn"),
  time: document.querySelector("#time"),
  move: document.querySelector("#move"),
  board: document.querySelector(".board"),
  showWin: document.querySelector(".showWin"),
  playAgain: document.querySelector("#playAgain"),
  memoryGame: document.querySelector(".memoryGame"),
  gameLevel: document.querySelectorAll(".lev"),
  chooseLevel: document.querySelector(".chooseLevel"),
  endText: document.querySelector(".endText"),
};

const stat = {
  gameStarted: false,
  flippedCard: 0,
  totalFlips: 0,
  totalTime: 0,
  loop: null,
};

selector.gameLevel.forEach((lev) => {
  lev.addEventListener("click", (e) => {
    level = e.target.id;
  });
});
function resizeWidth(x, cardElement, cardImgElement, adjust) {
  console.log(adjust);
  if (x.matches) {
    cardElement.forEach((eve) => {
      if (adjust === "easy") {
        eve.style.width = 90 + "px";
        eve.style.height = 90 + "px";
      }

      if (adjust === "normal") {
        eve.style.width = 90 + "px";
        eve.style.height = 90 + "px";
      }

      if (adjust === "hard") {
        eve.style.width = 50 + "px";
        eve.style.height = 80 + "px";
      }
    });

    cardImgElement.forEach((eve) => {
      if (adjust === "easy") {
        eve.style.width = 90 + "px";
        eve.style.height = 90 + "px";
      }

      if (adjust === "normal") {
        eve.style.width = 90 + "px";
        eve.style.height = 90 + "px";
      }

      if (adjust === "hard") {
        eve.style.width = 50 + "px";
        eve.style.height = 80 + "px";
      }
    });
  }
}

function inputLevel(eve) {
  for (let i = 0; i < eve.length; i++) {
    eve[i].addEventListener("click", (e) => {
      let level;
      level = e.target.id;

      if (level === "easy") {
        setTimeout(() => {
          generateGame(easy, level);
        }, 400);
      } else if (level === "normal") {
        setTimeout(() => {
          generateGame(normal, level);
        }, 400);
      } else if (level === "hard") {
        setTimeout(() => {
          generateGame(hard, level);
        }, 400);
      }
      selector.chooseLevel.classList.add("chooseLevelAnimation");
      setTimeout(() => {
        selector.endText.innerText = "";
        selector.chooseLevel.style.display = "none";
      }, 400);
    });
  }
}

inputLevel(selector.gameLevel);

function generateGame(lev, resizeLev) {
  let adjustSize = resizeLev;
  selector.memoryGame.style.display = "block";
  const dimension = selector.board.getAttribute("data-dimension");
  if (dimension % 2 !== 0) {
    throw new Error("The dimension of the board must be even number");
  }

  const picks = pickRandom(imgData, lev);
  const items = shuffleArray([...picks, ...picks]);

  const cards = `
        <div class="board" style="grid-template-columns: repeat(${
          lev / 2
        }, auto)">
            ${items
              .map(
                (item) => `
                <div class="card" id="${item.id}">
                    <div class="frontSide"></div>
                    <div class=backSide">
                        <img class="cardImg"  src="${item.img}" alt="img">
                    </div>
                </div>
            `
              )
              .join("")}
       </div>
    `;
  const parser = new DOMParser().parseFromString(cards, "text/html");
  selector.board.replaceWith(parser.querySelector(".board"));
  let cardsElement = document.querySelectorAll(".card");
  let cardsImgElement = document.querySelectorAll(".cardImg");
  resizeWidth(
    window.matchMedia("(max-width: 500px)"),
    cardsElement,
    cardsImgElement,
    adjustSize
  );
}

function pickRandom(array, index) {
  const cloneArray = [...array];
  const randomArray = [];
  for (let i = 0; i < index; i++) {
    const randomNum = Math.floor(Math.random() * cloneArray.length);
    randomArray.push(cloneArray[randomNum]);
    cloneArray.splice(randomNum, 1);
  }

  return randomArray;
}

function shuffleArray(array) {
  const cloneArray = [...array];
  for (let i = cloneArray.length - 1; i > 0; i--) {
    const randomNum = Math.floor(Math.random() * (i + 1));
    const origin = cloneArray[i];
    cloneArray[i] = cloneArray[randomNum];
    cloneArray[randomNum] = origin;
  }
  return cloneArray;
}

const startGame = () => {
  stat.gameStarted = true;
  selector.btn.classList.add("disableBtn");

  stat.loop = setInterval(() => {
    stat.totalTime++;
    selector.move.innerText = `${stat.totalFlips} Move`;
    selector.time.innerText = `Time: ${stat.totalTime} sec`;
  }, 1000);
};

const flipBackCards = () => {
  document.querySelectorAll(".card:not(.matched)").forEach((card) => {
    card.classList.remove("flipped");
  });

  stat.flippedCard = 0;
};

const flipCard = (card) => {
  stat.flippedCard++;
  stat.totalFlips++;
  if (!stat.gameStarted) {
    startGame();
  }

  if (stat.flippedCard <= 2) {
    card.classList.add("flipped");
  }

  if (stat.flippedCard === 2) {
    const flippedCards = document.querySelectorAll(".flipped:not(.matched)");
    if (
      flippedCards[0].getAttribute("id") === flippedCards[1].getAttribute("id")
    ) {
      flippedCards[0].classList.add("matched");
      flippedCards[1].classList.add("matched");
    }

    setTimeout(() => {
      flipBackCards();
    }, 1000);
  }

  // If there are no more cards that we can flip, we won the game
  if (!document.querySelectorAll(".card:not(.flipped)").length) {
    setTimeout(() => {
      selector.showWin.innerHTML = `
                         <p class="showWinText">
                            <span class="pg1">🤩 <span class="sepcialText">Y</span>ou <span class="sepcialText">W</span>in!</span><br />
                             Total <span class="highlight sepcialNum">${stat.totalFlips}</span> moves<br />
                             And <span class="highlight sepcialNum">${stat.totalTime}</span> seconds
                        </p>
                        <button class="levBtn" onclick="reload()">Play Again?</button>  
            `;
      selector.memoryGame.style.opacity = 0.3;
      selector.showWin.classList.add("showWinStyle");
      clearInterval(stat.loop);
    }, 1000);
  }
};

function reload() {
  window.location.reload();
}

const attachEventListeners = () => {
  document.addEventListener("click", (event) => {
    const eventTarget = event.target;
    const eventParent = eventTarget.parentElement;
    if (
      eventParent.className.includes("card") &&
      !eventParent.className.includes("flipped")
    ) {
      flipCard(eventParent);
    } else if (
      eventTarget.className.includes("btn") &&
      !eventTarget.className.includes("disabled")
    ) {
      startGame();
    }
  });
};

attachEventListeners();
