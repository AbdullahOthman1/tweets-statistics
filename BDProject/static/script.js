let tweetDistributionChart;

// Function to generate a random color in rgba format
const getRandomColor = () => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`;

// Generate an array of random colors
const colors = Array.from({ length: 20 }, getRandomColor);

// Fetch JSON data from a given URL
const fetchJson = (url) => fetch(url).then((response) => response.json());

// Create a chart using Chart.js library
const createChart = (canvasId, type, labels, data, label, backgroundColor) => {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // create new chart
  return new Chart(ctx, {

    // Specify the type of chart
    type,

    // Specify the data for the chart
    data: {
      labels, // Array of labels for the dataset
      datasets: [
        {
          label, // Label for the dataset
          data,  // Array of data points for the dataset
          backgroundColor, // Array of background colors for each data point
          borderWidth: 1, // Width of the dataset's border
        },
      ],
    },
  });
};

// Event listener for when the DOM has fully loaded
document.addEventListener("DOMContentLoaded", function () {
  let topUsersChart;

  // Render the top users chart
  function renderTopUsersChart(usernames, tweetCounts) {
    const backgroundColor = colors.slice(0, usernames.length);

    // Destroy the existing chart if it exists
    if (topUsersChart) {
      topUsersChart.destroy();
    }

    // Create a new chart
    topUsersChart = createChart(
      "topUsersChart",
      "pie",
      usernames,
      tweetCounts,
      "Top 20 Users",
      backgroundColor
    );
  }

  // Function to clear the user list by setting the inner HTML of "usernamesList" to an empty string
  function clearUserList() {
    document.getElementById("usernamesList").innerHTML = "";
  }

  // Function to display usernames in a list
  function displayUsernames(usernames) {
    // Iterate through the array of usernames
    usernames.forEach((username) => {

      // Create a new div element
      const div = document.createElement("div");

      // Set the class name of the div to "user-list-item"
      div.className = "user-list-item";

      // Create a text node with the username and append it to the div
      div.appendChild(document.createTextNode(username));

      // Append the div to the "usernamesList" element
      document.getElementById("usernamesList").appendChild(div);
    });
  }

  // Function to get top users and update the UI
  function getTopUsers() {
    // Clear the existing user list
    clearUserList();

    // Fetch top user data from the server
    fetchJson("/top_users")
      .then((data) => {
        // Extract usernames and tweet counts from the fetched data
        const usernames = data.map((entry) => entry._id);
        const tweetCounts = data.map((entry) => entry.count);

        // Display the usernames in a list
        displayUsernames(usernames);

        // Render the top users chart with the fetched data
        renderTopUsersChart(usernames, tweetCounts);
      })
      .catch((error) => {
        // Log an error message if there is an issue fetching data
        console.error("Error fetching data:", error);
      });
  }

  // Initial call to getTopUsers
  getTopUsers();

  // Set interval to refresh top users data every 10 seconds
  setInterval(getTopUsers, 10000);
});

// Get tweet distribution data for a specific user
function getTweetDistribution() {
  const username = document.getElementById("tweetUser").value;

  // Fetch tweet distribution data for the specified user
  fetchJson(`/user_tweet_distribution/${username}`)
    .then((data) => {
      const dates = data.map((entry) => entry._id);
      const tweetCounts = data.map((entry) => entry.count);

      // Destroy the existing chart if it exists
      if (tweetDistributionChart) {
        tweetDistributionChart.destroy();
      }

      // Create a new chart for tweet distribution
      const backgroundColor = colors.slice(0, dates.length);
      tweetDistributionChart = createChart(
        "tweetDistributionChart",
        "line",
        dates,
        tweetCounts,
        `Tweet Distribution for ${username}`,
        backgroundColor
      );
    });
}
