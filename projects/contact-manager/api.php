<?php
// PHP Backend for Contact Management System with MySQL / phpMyAdmin
$conn = new mysqli("localhost", "root", "", "contacts_db");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->query("CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    category VARCHAR(30) NOT NULL,
    company VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$action = $_REQUEST['action'] ?? '';

if ($action === 'create') {
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $category = $conn->real_escape_string($_POST['category']);
    $company = $conn->real_escape_string($_POST['company']);

    $conn->query("INSERT INTO contacts (name, email, phone, category, company) VALUES ('$name', '$email', '$phone', '$category', '$company')");
    header("Location: index.html");
}

if ($action === 'delete') {
    $id = intval($_GET['id']);
    $conn->query("DELETE FROM contacts WHERE id=$id");
    header("Location: index.html");
}

if ($action === 'list') {
    $res = $conn->query("SELECT * FROM contacts ORDER BY id DESC");
    $list = [];
    while ($row = $res->fetch_assoc()) {
        $list[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($list);
}
?>
