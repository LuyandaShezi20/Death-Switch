const navButtons = document.querySelectorAll("[data-view]");
const views = document.querySelectorAll(".view");
const amountSlider = document.querySelector("#amountSlider");
const amountValue = document.querySelector("#amountValue");
const signalRows = document.querySelectorAll(".signal-row");
const scoreValue = document.querySelector("#scoreValue");
const scoreLabel = document.querySelector("#scoreLabel");
const engineScore = document.querySelector("#engineScore");
const engineState = document.querySelector("#engineState");
const sidebarScore = document.querySelector("#sidebarScore");
const sidebarState = document.querySelector("#sidebarState");
const scoreRings = document.querySelectorAll(".score-ring");
const coolingTime = document.querySelector("#coolingTime");

const labels = [
  { min: 85, title: "Estate process", detail: "Full estate process active" },
  { min: 70, title: "Emergency release", detail: "Emergency release pending" },
  { min: 40, title: "Notify and freeze", detail: "Beneficiaries alerted" },
  { min: 1, title: "Monitoring", detail: "Signals being reviewed" },
  { min: 0, title: "Silent monitoring", detail: "No action required" },
];

function setActiveView(viewId) {
  views.forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewId);
  });
}

function formatRand(value) {
  return `R ${Number(value).toLocaleString("en-ZA")}`;
}

function getScoreState(score) {
  return labels.find((label) => score >= label.min);
}

function updateScore() {
  const score = [...signalRows].reduce((total, row) => {
    const checked = row.querySelector("input").checked;
    return checked ? total + Number(row.dataset.weight) : total;
  }, 0);

  const state = getScoreState(score);
  scoreValue.textContent = `${score}%`;
  scoreLabel.textContent = state.title;
  engineScore.textContent = `${score}%`;
  engineState.textContent = state.title;
  sidebarScore.textContent = `${score}%`;
  sidebarState.textContent = state.detail;

  scoreRings.forEach((ring) => {
    ring.style.setProperty("--score", score);
  });
}

function tickCoolingWindow() {
  const now = new Date();
  const minutes = 18 * 60 + 12 - (now.getMinutes() % 19);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = String(minutes % 60).padStart(2, "0");
  coolingTime.textContent = `${hours}h ${remainingMinutes}m`;
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.view));
});

signalRows.forEach((row) => {
  row.querySelector("input").addEventListener("change", updateScore);
});

amountSlider.addEventListener("input", () => {
  amountValue.textContent = formatRand(amountSlider.value);
});

tickCoolingWindow();
updateScore();
setInterval(tickCoolingWindow, 30000);
