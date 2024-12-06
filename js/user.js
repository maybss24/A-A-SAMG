document.addEventListener('DOMContentLoaded', () => {
    const userTable = document.querySelector('table tbody');
    let currentEditRow = null;

    // Add New User
    document.getElementById('addUserForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const firstname = document.getElementById('firstname').value.trim();
        const lastname = document.getElementById('lastname').value.trim();

        if (username && firstname && lastname) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${username}</td>
                <td>${firstname}</td>
                <td>${lastname}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="openEditModal(this)">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="openDeleteModal(this)">Delete</button>
                </td>
            `;
            userTable.appendChild(newRow);

            // Reset form and close modal
            document.getElementById('addUserForm').reset();
            const addModal = bootstrap.Modal.getInstance(document.getElementById('addNewModal'));
            addModal.hide();
        }
    });

    // Open Edit Modal
    window.openEditModal = (button) => {
        currentEditRow = button.closest('tr');
        document.getElementById('editUsername').value = currentEditRow.children[0].textContent;
        document.getElementById('editFirstname').value = currentEditRow.children[1].textContent;
        document.getElementById('editLastname').value = currentEditRow.children[2].textContent;

        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    };

    // Save Edited User
    document.getElementById('editUserForm').addEventListener('submit', (event) => {
        event.preventDefault();
        if (currentEditRow) {
            currentEditRow.children[0].textContent = document.getElementById('editUsername').value.trim();
            currentEditRow.children[1].textContent = document.getElementById('editFirstname').value.trim();
            currentEditRow.children[2].textContent = document.getElementById('editLastname').value.trim();

            const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            editModal.hide();
        }
    });

    // Open Delete Modal
    window.openDeleteModal = (button) => {
        currentEditRow = button.closest('tr');
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
    };

    // Delete User
    document.querySelector('#deleteModal .btn-danger').addEventListener('click', () => {
        if (currentEditRow) {
            currentEditRow.remove();
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
        }
    });

    // Search Users
    document.querySelector('.input-group input').addEventListener('input', (event) => {
        const searchValue = event.target.value.toLowerCase();
        document.querySelectorAll('table tbody tr').forEach((row) => {
            const username = row.children[0].textContent.toLowerCase();
            const firstname = row.children[1].textContent.toLowerCase();
            const lastname = row.children[2].textContent.toLowerCase();
            row.style.display =
                username.includes(searchValue) || firstname.includes(searchValue) || lastname.includes(searchValue)
                    ? ''
                    : 'none';
        });
    });
});
