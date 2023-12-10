const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const speakeasy = require("speakeasy");
const session = require("express-session");
const OpenAI = require("openai");
const { config } = require("dotenv");
config();

const openai = new OpenAI();

const app = express();
const port = 3000;

// Middleware to parse JSON in the request body
app.use(bodyParser.json());
app.use(
  session({
    secret: "your-secret-key", // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(__dirname));

// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "sys",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Serve the HTML page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
// Route to print the entire 'user' table
app.get("/printTable", (req, res) => {
  connection.query("SELECT * FROM user", (err, results) => {
    if (err) {
      console.error("Error fetching data from user table:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("User table data:", results);
      res.json(results);
    }
  });
});
app.get("/signupSuccess", (req, res) => {
  res.sendFile(__dirname + "/signupSuccess.html");
});
// Handle signup POST request
app.post("/signup", (req, res) => {
  const formData = req.body;

  // Generate Google Authenticator key
  const secretKey = speakeasy.generateSecret({ length: 20 }).base32;

  // Insert data into the 'user' table
  connection.query(
    "INSERT INTO user (first_name, last_name, username, password, email, phone_no, secret_key) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      formData.firstName,
      formData.lastName,
      formData.username,
      formData.password,
      formData.email,
      formData.phoneNo,
      secretKey,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting data into user table:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("Inserted data into user table:", results);
        // Send both success message and secret key in the response
        res.json({ message: "Signup successful!", secretKey: secretKey });
      }
    }
  );
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.get("/forgotPassword", (req, res) => {
  res.sendFile(__dirname + "/forgotPasswordEmailEntry.html");
});
app.get("/otpVerification", (req, res) => {
  res.sendFile(__dirname + "/otpVerification.html");
});
app.post("/forgotPassword", (req, res) => {
  const usernameOrEmail = req.body.usernameOrEmail;

  // Query the 'user' table to check if the username or email exists
  connection.query(
    "SELECT * FROM user WHERE username = ? OR email = ?",
    [usernameOrEmail, usernameOrEmail],
    (err, results) => {
      if (err) {
        console.error("Error checking username or email:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length > 0) {
          // User found
          const user = results[0];

          // Store the user's Google Authenticator secret key in the session (you may use a more secure storage mechanism)
          req.session.userSecretKey = user.secret_key;
          req.session.userId = user.id;

          // Generate a one-time password (OTP) using speakeasy and user's secret key
          const otp = speakeasy.totp({
            secret: user.secret_key,
            encoding: "base32",
          });

          // You can send the OTP to the user via email or other means

          // Send a success response back to the HTML page
          res.json({ success: true });
        } else {
          // User not found
          console.log("User not found");
          res.status(404).json({ error: "User not found" });
        }
      }
    }
  );
});
app.post("/verifyOTP", (req, res) => {
  const enteredOTP = req.body.enteredOTP;

  // Retrieve the user's Google Authenticator secret key from the session (you may use a more secure storage mechanism)
  const userSecretKey = req.session.userSecretKey;

  // Verify the entered OTP against the user's secret key
  const verificationResult = speakeasy.totp.verify({
    secret: userSecretKey,
    encoding: "base32",
    token: enteredOTP,
  });

  if (verificationResult) {
    // OTP is valid
    console.log("OTP verification successful!");
    res.json({ success: true });
    // You can redirect the user to a password reset page or perform other actions
  } else {
    // OTP is invalid
    console.log("Invalid OTP");
    res.status(401).json({ error: "Invalid OTP" });
  }
});
app.get("/setNewPassword", (req, res) => {
  res.sendFile(__dirname + "/setNewPassword.html");
});
app.post("/setNewPassword", (req, res) => {
  const newPassword = req.body.newPassword;

  // You need to identify the user for whom the password is being set
  // For example, you can use the user's session or another form of identification

  // For demonstration purposes, let's assume you have stored the user's ID in the session
  const userId = req.session.userId;

  if (userId) {
    // Update the user's password in the database
    connection.query(
      "UPDATE user SET password = ? WHERE id = ?",
      [newPassword, userId],
      (err, results) => {
        if (err) {
          console.error("Error updating password:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Password updated successfully");
          res.json({ success: true });
        }
      }
    );
  } else {
    // User not authenticated (session expired, etc.)
    console.log("User not authenticated");
    res.status(401).json({ error: "User not authenticated" });
  }
});
app.post("/login", (req, res) => {
  const formData = req.body;

  // Query the 'user' table to check login credentials
  connection.query(
    "SELECT * FROM user WHERE username = ? AND password = ?",
    [formData.username, formData.password],
    (err, results) => {
      if (err) {
        console.error("Error checking login credentials:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length > 0) {
          // Login successful
          // Redirect to login confirmation page
          console.log("Logged In Successfully");
          res.json({ success: true });
        } else {
          // Login failed
          console.log("Invalid username or password");
          res.status(401).json({ error: "Invalid username or password" });
        }
      }
    }
  );
});
app.get("/loginConfirmation", (req, res) => {
  res.sendFile(__dirname + "/loginConfirmation.html");
});

//Submitting results
app.post("/submit-results", (req, res) => {
  const { username, wpm, accuracy } = req.body;

  // Insert results into the database
  insertResultsIntoDatabase(username, wpm, accuracy);

  // Respond to the client
  res.json({ success: true, message: "Results submitted successfully" });
});

function insertResultsIntoDatabase(username, wpm, accuracy) {
  // Use a connection from the pool
  connection.query(
    "INSERT INTO results (username, wpm, accuracy) VALUES (?, ?, ?)",
    [username, wpm, accuracy],
    (err, results) => {
      if (err) {
        console.error("Error inserting data results table:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("Inserted data into results table:", results);
        // Send both success message and secret key in the response
      }
    }
  );
}

app.get("/user-stats/:username", (req, res) => {
  const { username } = req.params;

  // SQL query to calculate average WPM and accuracy
  const sql =
    "SELECT AVG(wpm) AS avgWPM, AVG(accuracy) AS avgAccuracy FROM results WHERE username = ?";

  // Execute the query
  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error("Error retrieving user stats:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      // Send the calculated averages in the response
      res.json({
        success: true,
        data: {
          avgWPM: results[0].avgWPM || 0,
          avgAccuracy: results[0].avgAccuracy || 0,
        },
      });
    }
  });
});

app.get('/get-custom-text', async (req, res) => {
  try {
    const { theme } = req.query; // Use req.query to access URL parameters

    // Make an API call to OpenAI to get custom text based on the provided theme
    const completion = await openai.completions.create({
      model: 'text-davinci-002',
      prompt: `Generate a single paragraph that is ${theme} themed and is around 200 to 250 words long.`,
      max_tokens: 250,
      temperature: 0,
    });

    const customText = completion.choices[0].text;

    // Send the custom text in the response
    res.json({ success: true, customText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
