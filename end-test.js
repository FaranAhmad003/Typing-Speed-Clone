function endTest() {
    userInput.disabled = true; // Disable further input
    calculateAndInsertResults();
    isTestStarted = false;
    durationSelect.disabled = false;
    resetButton.disabled = false;
}

function calculateAndInsertResults() {
  const typedText = userInput.value;
  const totalChars = totalTypedWords;
  const correctChars = totalCorrectWords;
  const wpm = correctChars / 5 / (timeLimit / 60); // Assuming an average of 5 chars per word
  const accuracy = (correctChars / totalChars) * 100;

  // Display the results
  displayResults(wpm, accuracy);

  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  console.log(username);

  submitResultsToServer(username, wpm, accuracy);
}

function displayResults(wpm, accuracy) {
  accuracyIndicator.textContent = accuracy.toFixed(2);
  wpmIndicator.textContent = wpm.toFixed(2);
  console.log("WPM: ", wpm);
  console.log("Accuracy: ", accuracy);
}

function submitResultsToServer(username, wpm, accuracy) {
      // Make an HTTP POST request to the server
    fetch('/submit-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, wpm, accuracy }),
    })
    .then(response => response.json())
    .then(data => {
      // Handle response from the server
      console.log(data);
      // You can redirect or show a success message here
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }