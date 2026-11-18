// Lab Exercise 6: Dynamic Department Website (Login, Registration, Home, About us)
const DEPT_USERS_KEY = 'dept_registered_users';
const CURRENT_USER_KEY = 'dept_current_user';

const defaultDeptUsers = [
    {
        name: 'Sri Parvathi P P',
        email: 'parvathi@dept.edu',
        roll: '24MCA001',
        role: 'Student',
        pass: '1234',
        registeredAt: '2026-07-10'
    },
    {
        name: 'Dr. K. Suresh',
        email: 'suresh.prof@dept.edu',
        roll: 'FAC201',
        role: 'Faculty',
        pass: 'admin123',
        registeredAt: '2025-01-15'
    }
];

function getDeptUsers() {
    const data = localStorage.getItem(DEPT_USERS_KEY);
    if (!data) {
        localStorage.setItem(DEPT_USERS_KEY, JSON.stringify(defaultDeptUsers));
        return defaultDeptUsers;
    }
    try {
        return JSON.parse(data);
    } catch(e) {
        return defaultDeptUsers;
    }
}

function saveDeptUsers(users) {
    localStorage.setItem(DEPT_USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
    updateNavState();
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('nav .nav-link').forEach(link => link.classList.remove('active'));

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    const activeLink = document.querySelector(`nav a[href="#${tabId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    if (tabId === 'dashboard') {
        renderDashboard();
    }
}

function updateNavState() {
    const user = getCurrentUser();
    const userBanner = document.getElementById('userBanner');
    const loggedInName = document.getElementById('loggedInName');
    const userRoleBadge = document.getElementById('userRoleBadge');
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navRegBtn = document.getElementById('navRegBtn');

    if (user) {
        userBanner.style.display = 'flex';
        loggedInName.textContent = user.name;
        userRoleBadge.textContent = user.role;
        navLoginBtn.textContent = 'Dashboard';
        navLoginBtn.onclick = () => showTab('dashboard');
        navRegBtn.style.display = 'none';
    } else {
        userBanner.style.display = 'none';
        navLoginBtn.textContent = 'Login';
        navLoginBtn.onclick = () => showTab('login');
        navRegBtn.style.display = 'inline-block';
    }
}

function logoutUser() {
    setCurrentUser(null);
    showTab('home');
}

function renderDashboard() {
    const user = getCurrentUser();
    if (!user) {
        showTab('login');
        return;
    }

    const profileSummary = document.getElementById('profileSummary');
    profileSummary.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Roll / Staff ID:</strong> ${user.roll}</p>
        <p><strong>Designation/Role:</strong> <span class="badge">${user.role}</span></p>
    `;

    const users = getDeptUsers();
    const tableBody = document.getElementById('registeredUsersTable');
    tableBody.innerHTML = users.map(u => `
        <tr>
            <td><strong>${u.roll}</strong></td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td><span class="badge">${u.role}</span></td>
            <td>${u.registeredAt || '2026-08-01'}</td>
        </tr>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavState();

    // Login Form Submit
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value.trim();
        const role = document.getElementById('loginRole').value;
        const status = document.getElementById('loginStatus');

        const users = getDeptUsers();
        const match = users.find(u => (u.email.toLowerCase() === email.toLowerCase() || u.roll.toLowerCase() === email.toLowerCase()) && u.pass === pass);

        if (match) {
            status.textContent = '✓ Login Successful! Redirecting...';
            status.className = 'status-msg success';
            setTimeout(() => {
                status.className = 'status-msg';
                setCurrentUser(match);
                showTab('dashboard');
            }, 800);
        } else {
            status.textContent = 'Invalid credentials or user does not exist!';
            status.className = 'status-msg error';
        }
    });

    // Register Form Submit
    const regForm = document.getElementById('registerForm');
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const roll = document.getElementById('regRoll').value.trim();
        const role = document.getElementById('regRole').value;
        const pass = document.getElementById('regPass').value;
        const confirmPass = document.getElementById('regConfirmPass').value;
        const status = document.getElementById('regStatus');

        if (pass !== confirmPass) {
            status.textContent = 'Passwords do not match!';
            status.className = 'status-msg error';
            return;
        }

        const users = getDeptUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.roll.toLowerCase() === roll.toLowerCase())) {
            status.textContent = 'Error: Email or Roll Number already registered!';
            status.className = 'status-msg error';
            return;
        }

        const newUser = {
            name,
            email,
            roll,
            role,
            pass,
            registeredAt: new Date().toISOString().split('T')[0]
        };

        users.push(newUser);
        saveDeptUsers(users);

        status.textContent = '✓ Registration complete! You can now log in.';
        status.className = 'status-msg success';
        regForm.reset();

        setTimeout(() => {
            status.className = 'status-msg';
            showTab('login');
        }, 1200);
    });
});
