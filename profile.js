// Replace 'testUser' with the actual username for which you want to retrieve stats
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");

// Make an HTTP GET request to retrieve user stats
fetch(`/user-stats/${username}`)
  .then(response => response.json())
  .then(data => {
    // Handle the response
    console.log(data);

    if (data.success) {
      const avgWPM = data.data.avgWPM;
      const avgAccuracy = data.data.avgAccuracy;

      // Use the averages as needed (e.g., update the profile page UI)
      console.log('Average WPM:', avgWPM);
      console.log('Average Accuracy:', avgAccuracy);

      // Update the UI with the retrieved data
      updateProfileUI(avgWPM, avgAccuracy);
    } else {
      // Handle the case where the request was not successful
      console.error('Failed to retrieve user stats:', data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

function updateProfileUI(avgWPM, avgAccuracy) {
  // Example: Update HTML elements with the retrieved data
  document.getElementById('avgWPM').textContent = avgWPM
  document.getElementById('avgAccuracy').textContent = avgAccuracy + '%';
}
