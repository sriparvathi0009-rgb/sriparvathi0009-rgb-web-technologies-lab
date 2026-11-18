// Lab Exercise 5: Employee Registration connected to phpMyAdmin / Database
const STORAGE_KEY = 'lab_employee_database';

// Default mock data if empty
const defaultEmployees = [
    {
        empId: 'EMP101',
        name: 'Arun Kumar',
        email: 'arun.k@company.com',
        phone: '9876543210',
        department: 'Computer Science',
        designation: 'Senior Developer',
        salary: '65000',
        gender: 'Male',
        joinDate: '2023-06-15'
    },
    {
        empId: 'EMP102',
        name: 'Priya Sharma',
        email: 'priya.s@company.com',
        phone: '9845123456',
        department: 'Information Technology',
        designation: 'Database Administrator',
        salary: '72000',
        gender: 'Female',
        joinDate: '2022-09-01'
    }
];

function getEmployees() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEmployees));
        return defaultEmployees;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return defaultEmployees;
    }
}

function saveEmployees(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    renderTable();
}

function showStatus(text, type = 'success') {
    const msg = document.getElementById('statusMessage');
    msg.textContent = text;
    msg.className = `status-msg ${type}`;
    setTimeout(() => {
        msg.className = 'status-msg';
    }, 4000);
}

function renderTable() {
    const tbody = document.getElementById('employeeTableBody');
    const employees = getEmployees();

    if (employees.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#999; padding: 25px;">No employee records in database table.</td></tr>`;
        return;
    }

    tbody.innerHTML = employees.map((emp, index) => `
        <tr>
            <td><strong>${emp.empId}</strong></td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td><span style="background:#e6f4ea; color:#137333; padding:3px 8px; border-radius:12px; font-size:12px;">${emp.department}</span></td>
            <td>${emp.designation}</td>
            <td>₹${Number(emp.salary).toLocaleString('en-IN')}</td>
            <td>${emp.joinDate}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${index})">Delete</button>
            </td>
        </tr>
    `).join('');
}

window.deleteEmployee = function(index) {
    if (confirm('Are you sure you want to delete this record from phpMyAdmin database?')) {
        const employees = getEmployees();
        employees.splice(index, 1);
        saveEmployees(employees);
        showStatus('Record deleted successfully from table.', 'success');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderTable();

    const form = document.getElementById('employeeForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const empId = document.getElementById('empId').value.trim();
        const name = document.getElementById('empName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const department = document.getElementById('department').value;
        const designation = document.getElementById('designation').value.trim();
        const salary = document.getElementById('salary').value.trim();
        const joinDate = document.getElementById('joinDate').value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value || 'Other';

        const employees = getEmployees();

        // Check if ID already exists
        if (employees.some(emp => emp.empId.toLowerCase() === empId.toLowerCase())) {
            showStatus(`Error: Employee ID '${empId}' already exists in database!`, 'error');
            return;
        }

        const newEmp = { empId, name, email, phone, department, designation, salary, gender, joinDate };
        employees.push(newEmp);
        saveEmployees(employees);

        form.reset();
        showStatus(`✓ Employee record '${empId}' successfully inserted into database table!`, 'success');
    });

    // Clear DB
    document.getElementById('clearDbBtn').addEventListener('click', () => {
        if (confirm('Clear all rows in the employees table?')) {
            saveEmployees([]);
            showStatus('All rows cleared from employees table.', 'success');
        }
    });

    // Toggle SQL Schema
    document.getElementById('exportSqlBtn').addEventListener('click', () => {
        const sqlBox = document.getElementById('sqlModal');
        sqlBox.style.display = sqlBox.style.display === 'none' ? 'block' : 'none';
    });
});
