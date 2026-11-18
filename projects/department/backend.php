<?php
// PHP Backend for Department Website with phpMyAdmin MySQL
session_start();
$conn = new mysqli("localhost", "root", "", "department_db");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Table setup
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    roll_number VARCHAR(30) UNIQUE NOT NULL,
    role ENUM('Student', 'Faculty', 'Admin') NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($sql);

$action = $_POST['action'] ?? '';

if ($action === 'register') {
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $roll = $conn->real_escape_string($_POST['roll']);
    $role = $conn->real_escape_string($_POST['role']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (name, email, roll_number, role, password) VALUES ('$name', '$email', '$roll', '$role', '$password')";
    if ($conn->query($sql)) {
        header("Location: index.html?status=registered");
    } else {
        echo "Error: " . $conn->error;
    }
}

if ($action === 'login') {
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];

    $result = $conn->query("SELECT * FROM users WHERE email='$email' OR roll_number='$email'");
    if ($row = $result->fetch_assoc()) {
        if (password_verify($password, $row['password'])) {
            $_SESSION['user'] = $row;
            header("Location: index.html?status=loggedin");
            exit();
        }
    }
    echo "Invalid login credentials";
}
$conn->close();
?>
