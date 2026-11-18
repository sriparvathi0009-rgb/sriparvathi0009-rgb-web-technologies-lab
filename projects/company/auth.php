<?php
// PHP Backend for Company Login and Cross-Role View
session_start();
$conn = new mysqli("localhost", "root", "", "company_portal_db");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ensure table exists
$conn->query("CREATE TABLE IF NOT EXISTS company_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('Admin', 'Employee') NOT NULL,
    department VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    designation VARCHAR(50),
    salary VARCHAR(50),
    office VARCHAR(100)
)");

$action = $_POST['action'] ?? '';

if ($action === 'login') {
    $email = $conn->real_escape_string($_POST['email']);
    $role = $conn->real_escape_string($_POST['role']);
    $password = $_POST['password'];

    $result = $conn->query("SELECT * FROM company_users WHERE email='$email' AND role='$role'");
    if ($user = $result->fetch_assoc()) {
        if (password_verify($password, $user['password']) || $password === $user['password']) {
            $_SESSION['active_user'] = $user;
            
            // Condition Logic:
            if ($user['role'] === 'Employee') {
                // Fetch all admins
                $data = $conn->query("SELECT name, email, designation, department, office, phone FROM company_users WHERE role='Admin'");
            } else {
                // Fetch all employees
                $data = $conn->query("SELECT name, email, designation, department, salary, phone FROM company_users WHERE role='Employee'");
            }
            // Return or redirect to view
            header("Location: index.html?auth=success");
            exit();
        }
    }
    echo "Invalid Credentials";
}
?>
