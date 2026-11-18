<?php
// Database connection configuration for phpMyAdmin / MySQL
$host = "localhost";
$user = "root";
$pass = "";
$db   = "company_db";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create table if not exists
$sql = "CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    department VARCHAR(50) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    gender ENUM('Male','Female','Other') NOT NULL,
    join_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($sql);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $emp_id = $conn->real_escape_string($_POST['empId']);
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $department = $conn->real_escape_string($_POST['department']);
    $designation = $conn->real_escape_string($_POST['designation']);
    $salary = $conn->real_escape_string($_POST['salary']);
    $gender = $conn->real_escape_string($_POST['gender']);
    $join_date = $conn->real_escape_string($_POST['joinDate']);

    $insert = "INSERT INTO employees (emp_id, name, email, phone, department, designation, salary, gender, join_date)
               VALUES ('$emp_id', '$name', '$email', '$phone', '$department', '$designation', '$salary', '$gender', '$join_date')";

    if ($conn->query($insert) === TRUE) {
        echo "<script>alert('Record inserted successfully!'); window.location.href='index.html';</script>";
    } else {
        echo "Error: " . $conn->error;
    }
}
$conn->close();
?>
