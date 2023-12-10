# Typing-Speed-Clone
It is basically the typing speed tracker in which I have made the custom text selection as well along with storing it in the mysql

Features :
Typing Speed Assessment: Measure your typing speed with dynamically generated sentences.
Accuracy Checker: Evaluate your accuracy in real-time as you type.
User Authentication: Register an account to save and track your typing progress over time.
Interactive Design: A clean and intuitive interface for an enjoyable typing experience.

Technologies Used :
Node.js: The backend is powered by Node.js, providing a robust server environment.
MySQL: Utilizes MySQL as the database to store user accounts and typing statistics.
HTML & CSS: The frontend is crafted with HTML for structure and CSS for a visually appealing design.


HOW TO RUN?
1. To make this work the query is following which is required to run into nysql
  CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  username VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  email VARCHAR(255),
  phone_no VARCHAR(15),
  secret_key VARCHAR(255) UNIQUE
);
  CREATE TABLE results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  wpm DECIMAL(5, 2), -- Adjust precision and scale as needed
  accuracy DECIMAL(5, 2), -- Adjust precision and scale as needed
  test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (username) REFERENCES user(username));

2. open the terminal and execute the following command "node app.js"
  
