const scenes = [...document.querySelectorAll(".scene")];
const sceneNumber = document.querySelector("#sceneNumber");
const prevButton = document.querySelector("#prevScene");
const nextButton = document.querySelector("#nextScene");
const playButton = document.querySelector("#playScene");

let activeScene = 0;
let playTimer;

function renderScene(index) {
  activeScene = (index + scenes.length) % scenes.length;
  scenes.forEach((scene, sceneIndex) => {
    scene.classList.toggle("is-active", sceneIndex === activeScene);
  });
  sceneNumber.textContent = String(activeScene + 1).padStart(2, "0");
}

function stopAutoPlay() {
  window.clearInterval(playTimer);
  playTimer = undefined;
  playButton.textContent = "Авто";
}

function toggleAutoPlay() {
  if (playTimer) {
    stopAutoPlay();
    return;
  }

  playButton.textContent = "Пауза";
  playTimer = window.setInterval(() => {
    renderScene(activeScene + 1);
  }, 5200);
}

prevButton.addEventListener("click", () => {
  stopAutoPlay();
  renderScene(activeScene - 1);
});

nextButton.addEventListener("click", () => {
  stopAutoPlay();
  renderScene(activeScene + 1);
});

playButton.addEventListener("click", toggleAutoPlay);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    stopAutoPlay();
    renderScene(activeScene - 1);
  }
  if (event.key === "ArrowRight") {
    stopAutoPlay();
    renderScene(activeScene + 1);
  }
  if (event.key === " ") {
    event.preventDefault();
    toggleAutoPlay();
  }
});

renderScene(0);
