// Lab Exercise 7: Company Webpage with Admin & Employee View Logic
// Condition:
// 1. If Employee login -> The page authenticates and views all Admin details.
// 2. If Admin login -> The page authenticates and views all Employee details.

const COMPANY_USERS_KEY = 'nexora_company_users';
const ACTIVE_USER_KEY = 'nexora_active_session';

const seedUsers = [
    // Administrators
    {
        name: 'Alexander Wright',
        email: 'admin@nexora.com',
        role: 'Admin',
        department: 'Executive Board',
        phone: '+1 (555) 019-2831',
        pass: 'admin123',
        designation: 'Managing Director & CTO',
        office: 'Suite 401, Headquarters'
    },
    {
        name: 'Sarah Jenkins',
        email: 'sarah.admin@nexora.com',
        role: 'Admin',
        department: 'Human Resources & Governance',
        phone: '+1 (555) 019-2839',
        pass: 'admin123',
        designation: 'Head of People Operations',
        office: 'Suite 205, North Wing'
    },
    // Employees
    {
        name: 'Rahul Sharma',
        email: 'rahul@nexora.com',
        role: 'Employee',
        department: 'Engineering',
        phone: '+91 98401 23456',
        pass: 'emp123',
        designation: 'Full Stack Engineer',
        salary: '₹75,000 / mo'
    },
    {
        name: 'Ananya Pillai',
        email: 'ananya@nexora.com',
        role: 'Employee',
        department: 'Operations',
        phone: '+91 97401 88901',
        pass: 'emp123',
        designation: 'Cloud Infrastructure Specialist',
        salary: '₹82,000 / mo'
    },
    {
        name: 'Vikram Mehta',
        email: 'vikram@nexora.com',
        role: 'Employee',
        department: 'Engineering',
        phone: '+91 96102 33412',
        pass: 'emp123',
        designation: 'UI/UX Frontend Architect',
        salary: '₹68,000 / mo'
    }
];

function getCompanyUsers() {
    const data = localStorage.getItem(COMPANY_USERS_KEY);
    if (!data) {
        localStorage.setItem(COMPANY_USERS_KEY, JSON.stringify(seedUsers));
        return seedUsers;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return seedUsers;
    }
}

function saveCompanyUsers(users) {
    localStorage.setItem(COMPANY_USERS_KEY, JSON.stringify(users));
}

function getActiveUser() {
    const data = localStorage.getItem(ACTIVE_USER_KEY);
    return data ? JSON.parse(data) : null;
}

function setActiveUser(user) {
    if (user) {
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(ACTIVE_USER_KEY);
    }
    updateAuthBar();
}

function updateAuthBar() {
    const user = getActiveUser();
    const authBar = document.getElementById('authBar');
    const nameEl = document.getElementById('currentUserName');
    const roleEl = document.getElementById('currentUserRole');
    const navLoginBtn = document.getElementById('navLoginBtn');

    if (user) {
        authBar.style.display = 'flex';
        nameEl.textContent = user.name;
        roleEl.textContent = user.role;
        navLoginBtn.textContent = 'Dashboard';
        navLoginBtn.onclick = () => showView('dashboard');
    } else {
        authBar.style.display = 'none';
        navLoginBtn.textContent = 'Portal Login';
        navLoginBtn.onclick = () => showView('login');
    }
}

function showView(viewId) {
    document.querySelectorAll('.view-panel').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('nav .nav-link').forEach(l => l.classList.remove('active'));

    const target = document.getElementById(`view-${viewId}`);
    if (target) {
        target.classList.add('active');
    }

    const navLink = document.querySelector(`nav a[href="#${viewId}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }

    if (viewId === 'dashboard') {
        renderDashboard();
    }
}

function logout() {
    setActiveUser(null);
    showView('home');
}

function renderDashboard() {
    const user = getActiveUser();
    if (!user) {
        showView('login');
        return;
    }

    const dashTitle = document.getElementById('dashTitle');
    const dashNotice = document.getElementById('dashRuleNotice');
    const tableHead = document.getElementById('dashTableHead');
    const tableBody = document.getElementById('dashTableBody');

    const allUsers = getCompanyUsers();

    if (user.role === 'Employee') {
        // Exercise Condition: "If employee login the page should authenticate and view all the admin details."
        dashTitle.innerHTML = `🛡️ Employee Portal - Viewing All Administrator Profiles`;
        dashNotice.innerHTML = `<strong>Rule Applied:</strong> As an Employee (<em>${user.name}</em>), you are authorized to view all Company Administrators and Leadership details.`;

        const admins = allUsers.filter(u => u.role === 'Admin');

        tableHead.innerHTML = `
            <tr>
                <th>Admin Name</th>
                <th>Official Email</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Office Location</th>
                <th>Direct Contact</th>
            </tr>
        `;

        tableBody.innerHTML = admins.map(a => `
            <tr>
                <td><strong>${a.name}</strong></td>
                <td><a href="mailto:${a.email}" style="color:#0284c7;">${a.email}</a></td>
                <td><span style="background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:12px; font-size:12px;">${a.designation || 'Director'}</span></td>
                <td>${a.department}</td>
                <td>${a.office || 'Corporate HQ'}</td>
                <td>${a.phone}</td>
            </tr>
        `).join('');

    } else if (user.role === 'Admin') {
        // Exercise Condition: "If admin login the page should authenticate and view all the employee details"
        dashTitle.innerHTML = `👥 Administrator Portal - Viewing All Employee Records`;
        dashNotice.innerHTML = `<strong>Rule Applied:</strong> As an Administrator (<em>${user.name}</em>), you are authorized to inspect all Staff and Employee personnel records.`;

        const employees = allUsers.filter(u => u.role === 'Employee');

        tableHead.innerHTML = `
            <tr>
                <th>Employee Name</th>
                <th>Company Email</th>
                <th>Role / Title</th>
                <th>Department</th>
                <th>Monthly Compensation</th>
                <th>Phone</th>
            </tr>
        `;

        tableBody.innerHTML = employees.map(e => `
            <tr>
                <td><strong>${e.name}</strong></td>
                <td><a href="mailto:${e.email}" style="color:#0284c7;">${e.email}</a></td>
                <td><span style="background:#dcfce7; color:#15803d; padding:3px 8px; border-radius:12px; font-size:12px;">${e.designation || 'Staff'}</span></td>
                <td>${e.department}</td>
                <td>${e.salary || '₹60,000 / mo'}</td>
                <td>${e.phone}</td>
            </tr>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateAuthBar();

    // Login Form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value.trim();
        const role = document.getElementById('loginRole').value;
        const feedback = document.getElementById('loginFeedback');

        const users = getCompanyUsers();
        const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass && u.role === role);

        if (matched) {
            feedback.textContent = `✓ Authentication Successful as ${role}! Redirecting...`;
            feedback.className = 'feedback-msg success';
            setTimeout(() => {
                feedback.className = 'feedback-msg';
                setActiveUser(matched);
                showView('dashboard');
            }, 800);
        } else {
            feedback.textContent = `Authentication failed: Incorrect email, password, or chosen role!`;
            feedback.className = 'feedback-msg error';
        }
    });

    // Registration Form
    const regForm = document.getElementById('registerForm');
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const role = document.getElementById('regRole').value;
        const dept = document.getElementById('regDept').value;
        const pass = document.getElementById('regPass').value;
        const phone = document.getElementById('regPhone').value.trim() || 'N/A';
        const feedback = document.getElementById('regFeedback');

        const users = getCompanyUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            feedback.textContent = `Error: User with email ${email} already exists!`;
            feedback.className = 'feedback-msg error';
            return;
        }

        const newUser = {
            name,
            email,
            role,
            department: dept,
            pass,
            phone,
            designation: role === 'Admin' ? 'Assistant Executive' : 'Staff Engineer',
            salary: '₹65,000 / mo',
            office: 'Regional Branch'
        };

        users.push(newUser);
        saveCompanyUsers(users);

        feedback.textContent = `✓ Registration successful! You can now log in as ${role}.`;
        feedback.className = 'feedback-msg success';
        regForm.reset();

        setTimeout(() => {
            feedback.className = 'feedback-msg';
            showView('login');
        }, 1200);
    });
});
