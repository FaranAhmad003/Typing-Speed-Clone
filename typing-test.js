let userInput = document.getElementById("user-input");
let typingTest = document.getElementById("typing-test");

const inputContainer = document.getElementById("input-container");
const changeTextBtn = document.getElementById("change-text");

var typingTestParagraph =
  "Betty decided to write a short story and she was sure it was going to be amazing. She had already written it in her head and each time she thought about it she grinned from ear to ear knowing how wonderful it would be. She could imagine the accolades coming in and the praise she would receive for creating such a wonderful piece. She was therefore extremely frustrated when she actually sat down to write the short story and the story that was so beautiful inside her head refused to come out that way on paper.";
var chars = typingTestParagraph.split("");

let backSpacePressed = false;
let totalTypedWords = 0;
let totalCorrectWords = 0;
let currentIndex = 0;

typingTest.textContent = "";
chars.forEach((char) => {
  const span = document.createElement("span");
  span.textContent = char;
  span.className = "default";
  typingTest.appendChild(span);
});

var spans = typingTest.querySelectorAll("span");

userInput.addEventListener("input", function (event) {
  const typedText = userInput.value;
  console.log("input listener called");
  if (
    typedText[currentIndex] === typingTestParagraph[currentIndex] &&
    backSpacePressed === false
  ) {
    totalTypedWords++;
    totalCorrectWords++;
    console.log([
      typedText[currentIndex],
      typingTestParagraph[currentIndex],
      typedText,
    ]);
    spans[currentIndex].className = "";
    spans[currentIndex].classList.add("correct");
    //spans[currentIndex].classList.add("current-word");
    currentIndex++;
    console.log(currentIndex);
    console.log("Total words: ", totalCorrectWords);
    console.log("Total typed words: ", totalTypedWords);
  } else if (
    typedText[currentIndex] != typingTestParagraph[currentIndex] &&
    backSpacePressed === false
  ) {
    totalTypedWords++;
    console.log([
      typedText[currentIndex],
      typingTestParagraph[currentIndex],
      typedText,
    ]);
    spans[currentIndex].className = "";
    spans[currentIndex].classList.add("wrong");
    currentIndex++;
    console.log(currentIndex);
    console.log("Total words: ", totalCorrectWords);
    console.log("Total typed words: ", totalTypedWords);
  }
  backSpacePressed = false;
});

userInput.addEventListener("keydown", function (event) {
  if (event.key === "Backspace") {
    if (currentIndex === 0) {
      totalCorrectWords = 0;
      totalTypedWords = 0;
      backSpacePressed = false;
      currentIndex = 0;
      console.log(currentIndex);
      console.log("Total correct words: ", totalCorrectWords);
      console.log("Total typed words: ", totalTypedWords);
    } else if (currentIndex > 0) {
      totalTypedWords--;
      backSpacePressed = true;
      console.log("Called keydown for backspace");
      currentIndex--;
      if (spans[currentIndex].className === "correct") {
        totalCorrectWords--;
      }
      spans[currentIndex].classList = "";
      spans[currentIndex].classList.add("default");
      console.log(currentIndex);
      console.log("Total correct words: ", totalCorrectWords);
      console.log("Total typed words: ", totalTypedWords);
    }
  }
});

userInput.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "Backspace") {
    event.preventDefault();
  }
});

function changeToCustomText(text) {
  console.log("called change text");
  typingTestParagraph = text;
  chars = typingTestParagraph.split("");
  backSpacePressed = false;
  totalTypedWords = 0;
  totalCorrectWords = 0;
  currentIndex = 0;

  typingTest.textContent = "";
  chars.forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.className = "default";
    typingTest.appendChild(span);
  });

  spans = typingTest.querySelectorAll("span");
}

changeTextBtn.addEventListener("click", function () {
  // Create an input field
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "Enter theme";
  inputField.id = "themeInput";
  inputField.style.width = "200px"; // Set a specific width
  inputField.style.height = "40px";
  inputField.style.marginRight = "10px";
  inputField.style.borderRadius = "5px";
  inputField.style.fontSize = "16px"; // Set font size

  // Create a submit button
  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.style.backgroundColor = "#4CAF50"; // Green background color
  submitBtn.style.color = "white"; // White text color
  submitBtn.style.padding = "8px 12px"; // Padding for a better appearance
  submitBtn.style.border = "none"; // Remove border
  submitBtn.style.borderRadius = "4px"; // Add border-radius for rounded corners
  submitBtn.style.cursor = "pointer"; // Change cursor on hover
  submitBtn.addEventListener("click", handleThemeSubmission);

  // Append the input field and submit button to the container
  inputContainer.innerHTML = ""; // Clear previous content
  inputContainer.appendChild(inputField);
  inputContainer.appendChild(submitBtn);
});

function handleThemeSubmission() {
  // Get the user-input theme
  const themeInput = document.getElementById("themeInput");
  const theme = themeInput.value;

  // Make an HTTP GET request to get custom text based on the theme
  fetch(`/get-custom-text?theme=${encodeURIComponent(theme)}`, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response
      console.log(data);
  
      if (data.success) {
        const customText = data.customText;
        // Use the custom text as needed
        console.log('Custom Text:', customText);
        changeToCustomText(customText);
      } else {
        // Handle the case where the request was not successful
        console.error('Failed to get custom text:', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

