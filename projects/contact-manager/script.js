// Lab Exercise 8: Contact Management System (CRUD: Add, View, Edit, Delete)
const CONTACTS_STORAGE_KEY = 'lab_contacts_management';

const initialContacts = [
    {
        id: '1',
        name: 'Dr. Suresh Kumar',
        email: 'suresh.cs@pondiuni.ac.in',
        phone: '+91 94432 10987',
        category: 'College',
        company: 'Professor, Dept of CS'
    },
    {
        id: '2',
        name: 'Lakshmi Nair',
        email: 'lakshmi.nair@infosys.com',
        phone: '+91 98401 23456',
        category: 'Work',
        company: 'Infosys Ltd'
    },
    {
        id: '3',
        name: 'Anjali Menon',
        email: 'anjali.m@gmail.com',
        phone: '+91 97456 12340',
        category: 'Personal',
        company: 'Friend'
    },
    {
        id: '4',
        name: 'Campus Medical Centre',
        email: 'medical@pondiuni.ac.in',
        phone: '0413 2654500',
        category: 'Emergency',
        company: 'Health Centre'
    }
];

function getContacts() {
    const data = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (!data) {
        localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(initialContacts));
        return initialContacts;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return initialContacts;
    }
}

function saveContacts(list) {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(list));
    renderContacts();
}

function renderContacts(filteredList = null) {
    const list = filteredList !== null ? filteredList : getContacts();
    const tbody = document.getElementById('contactTableBody');
    const countEl = document.getElementById('contactCount');
    countEl.textContent = list.length;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:30px;">No contacts found matching your criteria.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td><a href="mailto:${c.email}" style="color:#1e3a8a;">${c.email}</a></td>
            <td>${c.phone}</td>
            <td><span class="category-tag tag-${c.category.toLowerCase()}">${c.category}</span></td>
            <td>${c.company || '—'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-sm" onclick="openEditModal('${c.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteContact('${c.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Modal Handlers
const modal = document.getElementById('contactModal');
const modalTitle = document.getElementById('modalTitle');
const form = document.getElementById('contactForm');

function openAddModal() {
    form.reset();
    document.getElementById('editContactId').value = '';
    modalTitle.textContent = 'Add New Contact';
    modal.classList.add('active');
}

function openEditModal(id) {
    const contacts = getContacts();
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    document.getElementById('editContactId').value = contact.id;
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactEmail').value = contact.email;
    document.getElementById('contactPhone').value = contact.phone;
    document.getElementById('contactCategory').value = contact.category;
    document.getElementById('contactCompany').value = contact.company || '';

    modalTitle.textContent = 'Edit Contact Entry';
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact from phpMyAdmin database?')) {
        let contacts = getContacts();
        contacts = contacts.filter(c => c.id !== id);
        saveContacts(contacts);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderContacts();

    document.getElementById('openAddModalBtn').addEventListener('click', openAddModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

    // Save Contact (Create / Update)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editContactId').value;
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const category = document.getElementById('contactCategory').value;
        const company = document.getElementById('contactCompany').value.trim();

        let contacts = getContacts();

        if (id) {
            // Update existing
            const index = contacts.findIndex(c => c.id === id);
            if (index !== -1) {
                contacts[index] = { id, name, email, phone, category, company };
            }
        } else {
            // Add new
            const newContact = {
                id: Date.now().toString(),
                name,
                email,
                phone,
                category,
                company
            };
            contacts.push(newContact);
        }

        saveContacts(contacts);
        closeModal();
    });

    // Search filter
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const contacts = getContacts();
        const filtered = contacts.filter(c => 
            c.name.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query) ||
            c.phone.toLowerCase().includes(query) ||
            (c.company && c.company.toLowerCase().includes(query)) ||
            c.category.toLowerCase().includes(query)
        );
        renderContacts(filtered);
    });
});
