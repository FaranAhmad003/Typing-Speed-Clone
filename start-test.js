let displayTimer = document.getElementById("time");
let startButton = document.getElementById("start-button");
let durationSelect = document.getElementById("durationSelect");
let wpmIndicator = document.getElementById("wpm");
let accuracyIndicator = document.getElementById("accuracy");
let resetButton = document.getElementById("reset-button");
let usernameDisplay = document.getElementById("username");

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");

usernameDisplay.textContent = username;

let timeLimit;
let timer;
let timeRemaining;

let isTestStarted = false;

function startTest() {
  if (isTestStarted === false) {
    timeLimit = parseInt(durationSelect.value);
    timeRemaining = timeLimit;
    isTestStarted = true;
    resetButton.disabled = true;
    
    userInput.focus();
    durationSelect.disabled = true;
    accuracyIndicator.textContent = "-";
    wpmIndicator.textContent = "-";
    startTimer();
  }
}

function startTimer() {
  timer = setInterval(function () {
    timeRemaining--;
    if (timeRemaining <= 0) {
      clearInterval(timer);
      endTest();
    }
    displayTimer.textContent = timeRemaining;
  }, 1000);
}

//test will start when the user clicks the "Start Test" button
startButton.addEventListener("click", startTest);

durationSelect.addEventListener("change", function () {
  const selectedDuration = this.value;
  displayTimer.textContent = selectedDuration;
});

function resetTest() {
  location.reload();
}

resetButton.addEventListener("click", resetTest);

function showProfile(){
    window.location.href = `/profile.html?username=${encodeURIComponent(username)}`;
}

usernameDisplay.addEventListener("click", showProfile);
